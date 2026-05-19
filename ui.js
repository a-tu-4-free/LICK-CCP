// ==================== LICK-CCP UI ENGINE ====================

let activeReceipt = null;

export function renderReceiptsUI(container, template, list) {
    container.innerHTML = "";
    list.forEach((r, index) => {
        const node = template.content.cloneNode(true);
        const el = node.querySelector(".receipt");
        if (r.type === "tangkou") el.classList.add("tangkou");
        bindText(node, ".result", r.content);
        bindText(node, ".rmoney", r.money);
        bindText(node, ".rid", r.id);
        bindText(node, ".rtime", r.time);
        bindText(node, ".rhighsalary", r.highSalary);
        bindText(node, ".ractual", r.actualSalary);
        const comp = node.querySelector(".comparison");
        if (comp) comp.innerHTML = r.comparison || "";
        setEntryAnimation(el, index);
        attachReceiptInteraction(el, r);
        container.appendChild(node);
    });
}

function bindText(root, selector, value) {
    const el = root.querySelector(selector);
    if (el) el.innerText = value ?? "—";
}

function setEntryAnimation(el, index) {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px) scale(0.98)";
    setTimeout(() => {
        el.style.transition = "0.35s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
    }, index * 100);
}

function attachReceiptInteraction(el, data) {
    let clickLock = false;
    el.addEventListener("click", () => {
        if (clickLock) return;
        clickLock = true;
        el.style.transform = "scale(1.03)";
        setTimeout(() => { el.style.transform = "scale(1)"; clickLock = false; }, 150);
        if (activeReceipt === el) el.style.transform = "scale(1.05) rotate(-1deg)";
        activeReceipt = el;
        triggerGlitch(el);
    });
    el.addEventListener("mouseenter", () => { el.style.transition = "0.2s"; el.style.transform = "translateY(-3px)"; });
    el.addEventListener("mouseleave", () => { el.style.transform = "translateY(0)"; });
}

function triggerGlitch(el) {
    const r = Math.random();
    if (r > 0.65) {
        // 紅色閃爍取代霓虹效果
        el.style.filter = "sepia(1) saturate(3) hue-rotate(-10deg)";
        setTimeout(() => { el.style.filter = "none"; }, 180);
    }
    if (r > 0.85) {
        el.style.transform = "translateX(3px)";
        setTimeout(() => el.style.transform = "translateX(-3px)", 50);
        setTimeout(() => el.style.transform = "translateX(0)", 100);
    }
}

export function renderCommentUI(text) {
    const el = document.getElementById("systemComment");
    if (!el) return;
    if (el.innerText === text) { shake(el); return; }
    el.style.opacity = "0";
    setTimeout(() => {
        el.innerText = text;
        el.style.transition = "0.25s ease";
        el.style.opacity = "1";
    }, 100);
}

function shake(el) {
    el.style.transform = "translateX(4px)";
    setTimeout(() => el.style.transform = "translateX(-4px)", 60);
    setTimeout(() => el.style.transform = "translateX(2px)", 120);
    setTimeout(() => el.style.transform = "translateX(0)", 180);
}
