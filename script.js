// ==================== LICK-CCP CORE ENGINE ====================
import { rand, genRandomMoney, genTangkouMoney, genId, genTime, fillTemplate, genTangkouName } from "./generator.js";
import { renderCommentUI } from "./ui.js";

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==================== STATE ====================
let memes = null;
let memesReady = false;

let gameState = {
    mode: "random",
    chaos: 0,
    stability: 100,
    level: 1,
    doubleFace: false,       // 屠城模式（原 doubleSun）
    jackpotUsed: false,
    lock: false,
    totalGenerated: 0,
    totalMoney: 0,
    tangkouCount: 0,
    lastMoney: 0,
    maxCombo: 0,
    doubleFaceUsed: false,
};

// ==================== LOAD MEMES ====================
function loadMemes() {
    fetch("memes.json?ts=" + Date.now())
        .then(r => r.json())
        .then(d => {
            memes = d;
            memesReady = true;
            console.log("memes loaded ✔");
            generate();
        })
        .catch(err => console.error("memes load fail", err));
}
window.loadMemesGlobal = loadMemes;

// ==================== CHAOS（被抓包指數）====================
function addChaos(mode) {
    let gain = 0;
    if (mode === "random") {
        const r = Math.random();
        if (r < 0.7)       gain = randRange(1, 5);
        else if (r < 0.9)  gain = randRange(6, 20);
        else if (r < 0.98) gain = randRange(21, 50);
        else                gain = randRange(51, 100);
    }
    if (mode === "tangkou") {
        const r = Math.random();
        if (r < 0.6)       gain = randRange(10, 50);
        else if (r < 0.85) gain = randRange(50, 200);
        else if (r < 0.95) gain = randRange(200, 1000);
        else                gain = randRange(1000, 5000);
    }
    gameState.chaos += gain;
    gameState.stability -= Math.floor(gain / 25);
    if (gameState.stability < 0) gameState.stability = 0;
    return gain;
}

// ==================== JACKPOT ====================
function checkJackpot() {
    if (gameState.jackpotUsed) return 0;
    const r = Math.random();
    if (gameState.mode === "random" && r < 0.001) { gameState.jackpotUsed = true; return randRange(100000, 900000); }
    if (gameState.mode === "tangkou" && r < 0.001) { gameState.jackpotUsed = true; return randRange(1000000, 9000000); }
    if (gameState.level >= 5 && r < 0.0005) { gameState.jackpotUsed = true; return randRange(10000000, 99000000); }
    return 0;
}

// ==================== RAID（媒體抓包）====================
function maybeRaid() {
    const chance = 0.03 + (100 - gameState.stability) / 100 * 0.07;
    if (Math.random() < chance && typeof window.triggerRaid === "function") window.triggerRaid();
}

// ==================== EASTER EGGS ====================
function checkEasterEgg(money) {
    if (gameState.totalGenerated === 10 && typeof window.showToast === "function")
        window.showToast("🥚 你已屠城10次，王滬寧點頭了");
    if (money % 1000 === 0 && money > 0 && typeof window.showToast === "function")
        window.showToast("💯 整千金額！北京：「這個人懂規矩」");
    const now = new Date();
    if (now.getMinutes() === 0 && now.getSeconds() < 10 && typeof window.showToast === "function")
        window.showToast("🕐 整點彩蛋：統戰部現在正在開例會，請靜音");
}

// ==================== ORGAN CERTIFICATE（器官證明書）====================
function createReceipt() {
    if (!memes) return null;

    const baseMoney  = gameState.mode === "random" ? genRandomMoney() : genTangkouMoney();
    const levelBonus = gameState.level * (gameState.mode === "random" ? 50 : 5000);
    const chaosGain  = addChaos(gameState.mode);
    const jackpot    = checkJackpot();
    const money      = baseMoney + levelBonus + chaosGain * 10 + jackpot;

    gameState.totalGenerated++;
    gameState.totalMoney += money;
    gameState.lastMoney   = money;
    if (gameState.mode === "tangkou") gameState.tangkouCount++;

    // ===== CONTENT =====
    let content = [];
    content.push(fillTemplate(rand(memes.openings || [])));
    content.push(fillTemplate(rand(memes.usages   || [])));

    if (gameState.doubleFace) {
        // 屠城模式：台灣說 vs 北京說
        const twSay = rand(memes.tw_says || []);
        const bjSay = rand(memes.bj_says || []);
        content.push(`<div class="face-tw"><div class="face-label">🇹🇼 台灣說法</div>${twSay}</div>`);
        content.push(`<div class="face-bj"><div class="face-label">🔴 北京說法</div>${bjSay}</div>`);
        gameState.doubleFaceUsed = true;
    }

    content.push(fillTemplate(rand(memes.endings || [])));

    // 低機率彩蛋
    if (gameState.chaos > 100 && Math.random() < 0.3)
        content.push("⚠ " + fillTemplate(rand(memes.glitch || [])));
    if (Math.random() < 0.15)
        content.push("🔒 " + fillTemplate(rand(memes.system_weird || [])));
    if (gameState.level >= 5 && Math.random() < 0.25)
        content.push("🧮 " + fillTemplate(rand(memes.kmt_glitch || [])));

    // ===== 器官中介 =====
    const surgeon      = genTangkouName();
    const actualSalary = Math.floor(money * (0.6 + Math.random() * 0.3));
    const isPositive   = money >= actualSalary;
    const msgArr       = isPositive ? (memes.thanksMessages || []) : (memes.angryMessages || []);
    const comparison   = (isPositive ? "✅ 器官合格<br>" : "⚠️ 北京不滿<br>") + rand(msgArr);

    const footer = rand(memes.footers || []);

    const receiptData = {
        id:                  genId(),
        time:                genTime(),
        money,
        moneyDisplay:        money.toLocaleString(),
        highSalary:          surgeon,
        actualSalary,
        actualSalaryDisplay: actualSalary.toLocaleString(),
        content:             content.join("<br><br>"),
        comparison,
        footer,
        isJackpot:           jackpot > 0,
    };

    if (typeof window.notifyCharUnlocked === "function") window.notifyCharUnlocked(surgeon);
    if (typeof window.setLastReceipt === "function")     window.setLastReceipt(receiptData);

    return receiptData;
}

// ==================== RENDER ====================
function render() {
    const container = document.getElementById("receiptContainer");
    const template  = document.getElementById("receiptTemplate");
    if (!container || !template) return;

    container.innerHTML = "";
    const r = createReceipt();
    if (!r) return;

    const node = template.content.cloneNode(true);
    node.querySelector(".rid").innerText     = r.id;
    node.querySelector(".rtime").innerText   = r.time;
    node.querySelector(".rmoney").innerText  = r.moneyDisplay;
    node.querySelector(".rhigh").innerText   = r.highSalary;
    node.querySelector(".ractual").innerText = r.actualSalaryDisplay;
    node.querySelector(".result").innerHTML  = r.content;

    const footer = node.querySelector(".footer");
    if (footer) footer.textContent = r.footer;

    if (r.isJackpot) {
        const card = node.querySelector(".receipt");
        if (card) {
            card.style.border     = "2px solid #ffd700";
            card.style.boxShadow  = "0 0 40px rgba(255,215,0,0.5)";
        }
        if (typeof window.showToast === "function") window.showToast("💎 大獎！¥" + r.moneyDisplay);
    }

    container.appendChild(node);

    // HUD
    const safeSet = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    safeSet("mode",          gameState.mode === "tangkou" ? "屠城" : "摘取");
    safeSet("level",         gameState.level);
    safeSet("chaos",         gameState.chaos);
    safeSet("stabilityText", Math.max(0, gameState.stability));

    const comment = rand(memes.comments || ["統戰系統運作中"]);
    renderCommentUI(comment);

    maybeRaid();
    checkEasterEgg(r.money);

    if (typeof window.checkAchievements === "function") window.checkAchievements(gameState);
}

// ==================== ACTIONS ====================
window.generate = function () {
    if (!memesReady || gameState.lock) return;
    render();
};

window.setMode = function (m) {
    gameState.mode = m;
    const safeSet = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    safeSet("mode", m === "tangkou" ? "屠城" : "摘取");
};

window.toggleDoubleSun = function () {
    gameState.doubleFace = !gameState.doubleFace;
    const btn = document.getElementById("doubleSunBtn");
    if (btn) {
        btn.innerText = gameState.doubleFace ? "🎭 屠城模式 ON" : "🎭 屠城模式 OFF";
        btn.classList.toggle("active", gameState.doubleFace);
    }
    if (memesReady) render();
};

window.upgrade = function () {
    if (gameState.lock) return;
    gameState.level++;
    const safeSet = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    safeSet("level", gameState.level);

    if (gameState.level >= 10) {
        gameState.lock = true;
        if (typeof window.showLockScreen === "function") window.showLockScreen();
        return;
    }

    const tips = [
        "Lv2：屠城技術優化中……",
        "Lv3：統戰積分加速，台灣媒體開始注意你",
        "Lv4：你已進入國台辦觀察名單",
        "Lv5：🔴 解鎖屠城梗！被抓包機率上升！",
        "Lv6：偽裝成功率持續崩潰中",
        "Lv7：王滬寧的眼神開始不對勁",
        "Lv8：系統警告：你知道太多了",
        "Lv9：台灣媒體已在門口等你",
    ];
    const tip = tips[gameState.level - 2];
    if (tip && typeof window.showToast === "function") window.showToast("⬆ " + tip);
    if (memesReady) render();
};

// ==================== INIT ====================
window.enter = function (ok) {
    document.getElementById("introModal").style.display = "none";
    if (ok) loadMemes();
};

document.addEventListener("DOMContentLoaded", () => {
    const m = document.getElementById("introModal");
    if (m) m.style.display = "flex";
});

console.log("LICK-CCP CORE ENGINE ✔");
