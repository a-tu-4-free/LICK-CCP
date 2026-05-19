// ==================== LICK-CCP CORE ENGINE - GENERATOR ====================

export function rand(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "【統戰系統載入中】";
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 隨機摘取（低）— 人民幣
export function genRandomMoney() {
    return randRange(100, 999);
}

// 換臉模式（高）— 統戰獻金
export function genTangkouMoney() {
    return randRange(1000, 9999);
}

export function genMoney(min = 100, max = 10000) {
    return randRange(min, max);
}

export function genId() {
    return "GTO-" + randRange(1000000, 9999999);
}

export function genTime() {
    return new Date().toLocaleString("zh-TW", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
    });
}

export function genHighSalary() {
    return randRange(80000, 480000);
}

// 器官中介（角色名）
export function genTangkouName() {
    const names = [
        // 統戰行為系列
        "北京直飛機師","九貳共識公證人","器官品質鑑定官","忠誠度注射師",
        "兩面話翻譯機","換臉手術麻醉師","國台辦簽收員","跨海器官快遞員",
        "退役將領統戰顧問","中資引進顧問","統戰法案起草師","換臉後公關師",
        // 土地豪宅系列
        "豪宅鑑價員","國有地圈地師","黨產保管員","台糖地合建師",
        "700坪設計師","52坪保護區管理員","馬家莊園承租人","謝家白宮嚮導",
        "顏家莊園守衛","黨產156億保管師",
        // 議場行為系列
        "立院衝突特技員","粗口翻譯官","議場睡衣設計師","喇叭採購專員",
        "助理費除罪公證人","文件相似度偵測師","大罷免阻撓師","國防預算刪除員",
        // 2025真實事件系列
        "辦三證統戰中介","台灣身分證代辦師","中國貸款引誘員","校園三證推廣員",
        "失敗台商統戰買辦","通緝犯統戰中間人","八炯紀錄片主角","三證換貸款業務員",
        "馬德地政師","馬德土地承租人","馬德豪宅估價員",
        // 其他諷刺
        "黨產追討攔截師","幽靈連署設計師","人頭黨員管理員","現代吳三桂評估官",
        "北京握手協調員","傅系飛行計畫師","花蓮地政師","汐止廖家顧問"
    ];
    return rand(names);
}

export function genLevel(state = {}) {
    const chaos = state.chaos || 0;
    const stability = state.stability || 100;
    const normal = [
        "初級換臉學員", "統戰積分累積者", "九二共識傳道師",
        "北京訪問常客", "低風險親中者"
    ];
    const rare = [
        "🔴 傳說級舔共大師", "⭐ 黨中央特別認證", "🏆 北京最愛台灣政客",
        "👑 統戰最高榮譽獲得者"
    ];
    if (chaos > 80 || stability < 30) return rand(rare);
    return Math.random() > 0.8 ? rand(rare) : rand(normal);
}

export function fillTemplate(str) {
    if (!str) return "";
    return str
        .replace(/{days}/g, () => randRange(20, 820))
        .replace(/{money}/g, () => randRange(300, 5300) + "萬")
        .replace(/{num}/g, () => randRange(10000, 99999))
        .replace(/{year}/g, () => 2024 + randRange(0, 4));
}

export function genFooter() {
    const arr = [
        "LICK-CCP CORE SYSTEM — 北京認證版",
        "統戰部：本器官已完成品質認證",
        "兩岸一家親，器官一起捐",
        "本系統由台灣鄉民憤怒共同維持",
        "LICK-CCP v6.66 — 舔共加強版"
    ];
    return rand(arr);
}

export function generateReceipt() {
    return {
        content: "LEGACY MODE", money: genMoney(),
        id: genId(), time: genTime(), level: genLevel()
    };
}
