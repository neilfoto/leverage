/* =========================================================
   槓桿即時評估 — 題目引擎、拖拉互動、計分、成績上傳
   粉嶺官立中學 · 設計與應用科技科 (DAT)
   ========================================================= */

/* ── 老師的 Google Apps Script Web App URL ──
   如日後更換試算表，只需替換下面這一條網址即可。 */
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyTUGLrhzi_7dq4AC9qUeVhTmVAFWP5e1qMDDsbAmqj9mjV4DVN0yzUU_HF0GdwA_KoGA/exec";

/* 五個名詞與對應顏色 */
const TERMS = {
  effort:  { name: "施力", color: "#e07b9a" },
  epoint:  { name: "力點", color: "#d16ba5" },
  fulcrum: { name: "支點", color: "#7d5eae" },
  load:    { name: "負荷", color: "#4a97b8" },
  lpoint:  { name: "重點", color: "#5aa382" }
};

/* ── 題庫（由淺到深）── */
const QUESTIONS = [
  {
    type: "mc", level: "基礎",
    text: "槓桿一共可以分為多少大類？",
    options: ["一類", "兩類", "三類", "四類"],
    answer: 2
  },
  {
    type: "mc", level: "基礎",
    text: "在槓桿中，繞著它轉動、位置固定不動的一點稱為甚麼？",
    options: ["力點", "支點", "重點", "負荷"],
    answer: 1
  },
  {
    type: "mc", level: "理解",
    text: "第一類槓桿的特點是甚麼？",
    options: [
      "重點和力點在兩邊，支點在中間",
      "重點和力點在同一邊，力點在外",
      "重點和力點在同一邊，重點在外",
      "支點、力點、重點在同一點"
    ],
    answer: 0
  },
  {
    type: "mc", level: "應用",
    text: "下列哪一項工具屬於「省力」的第二類槓桿？",
    options: ["剪刀", "鑷子", "裁紙刀", "釣魚竿"],
    answer: 2
  },
  {
    type: "mc", level: "分析",
    text: "鑷子屬於第三類槓桿，其功用最貼切的描述是？",
    options: [
      "省力，但費時",
      "費力，但省時（移動距離較小）",
      "既省力又省時",
      "只改變施力方向，不改變大小"
    ],
    answer: 1
  },
  {
    /* 配對題（倒數第二題）：裁紙刀 — 只配對 支點 / 施力 / 負荷
       支點用「點」作答，施力與負荷用「箭頭」作答（箭頭本身帶方向）。 */
    type: "match", level: "配對",
    text: "裁紙刀（第二類槓桿）：把下方的<b>支點（點）</b>、<b>施力（箭頭）</b>、<b>負荷（箭頭）</b> " +
          "拖放到圖中正確的位置。" +
          "<br><span style=\"font-weight:600;font-size:.95rem;color:var(--ink-soft)\">" +
          "施力與負荷是有方向的力，已用箭頭 ↓/↑ 表示方向；支點是固定不動的一點。</span>",
    image: "images/lever2-cutter.png",
    /* 作答用的可拖曳部件：point = 點；arrow = 箭頭（dir 為方向） */
    pieces: [
      { term: "fulcrum", shape: "point" },
      { term: "effort",  shape: "arrow", dir: "down" },
      { term: "load",    shape: "arrow", dir: "up"   }
    ],
    /* 放置區（正確位置） */
    zones: [
      { id: "z1", left: 13, top: 60, answer: "fulcrum" }, /* 左端鉸鏈 = 支點 */
      { id: "z2", left: 88, top: 24, answer: "effort"  }, /* 右端手柄 = 施力（向下） */
      { id: "z3", left: 48, top: 58, answer: "load"    }  /* 中間刀刃壓紙 = 負荷（向上抗力） */
    ]
  },
  {
    /* 挑戰題（最後一題）：指甲鉗（附件題目）
       (a) 選擇題：上/下半部分各屬哪一類槓桿。
       (b) 配對：上半部分的 支點（點）、施力（箭頭）、負荷（箭頭）。 */
    type: "combo", level: "挑戰",
    image: "images/nail-clipper.png",
    text: "挑戰題：下圖是一個鋼製指甲鉗的側視圖，它是由兩個槓桿組成的<b>複式槓桿</b>。",
    partA: {
      text: "(a) 分辨指甲鉗的「上半部分」和「下半部分」分別屬於哪一類槓桿？",
      options: [
        "上半部分：第一類槓桿；下半部分：第二類槓桿",
        "上半部分：第二類槓桿；下半部分：第三類槓桿",
        "上半部分：第三類槓桿；下半部分：第二類槓桿",
        "上半部分：第二類槓桿；下半部分：第一類槓桿"
      ],
      answer: 1
    },
    partB: {
      text: "(b) 在圖中指出「上半部分」的支點、施力和負荷的位置與方向：" +
            "<b>支點</b>放一個<b>點</b>，<b>施力</b>與<b>負荷</b>各放一個<b>箭頭</b>。",
      pieces: [
        { term: "fulcrum", shape: "point" },
        { term: "effort",  shape: "arrow", dir: "down" },
        { term: "load",    shape: "arrow", dir: "up"   }
      ],
      zones: [
        { id: "z1", left: 14, top: 20, answer: "fulcrum" }, /* 左上樞軸圓孔 = 支點 */
        { id: "z2", left: 88, top: 44, answer: "effort"  }, /* 右端自由端手指按壓 = 施力（向下） */
        { id: "z3", left: 50, top: 40, answer: "load"    }  /* 中間頂壓刀片 = 負荷（向上抗力） */
      ]
    }
  }
];

const TOTAL = QUESTIONS.length;

/* ── 狀態 ── */
let student = { class: "", id: "", name: "" };
let current = 0;
let answers = new Array(TOTAL).fill(null); // MC: 選項index；DND: {zoneId: termKey}
let startTime = null;
let timerInt = null;

/* ── DOM ── */
const infoPanel   = document.getElementById("infoPanel");
const quizPanel   = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const progressWrap= document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const timerLabel  = document.getElementById("timerLabel");

/* ========== 步驟一：資料驗證 ========== */
document.getElementById("startBtn").addEventListener("click", function () {
  const cls  = document.getElementById("in-class").value.trim();
  const sid  = document.getElementById("in-id").value.trim();
  const name = document.getElementById("in-name").value.trim();
  let ok = true;

  toggleInvalid("f-class", !cls);
  toggleInvalid("f-id", !sid);
  toggleInvalid("f-name", !name);
  if (!cls || !sid || !name) ok = false;

  if (!ok) return;

  student = { class: cls, id: sid, name: name };
  infoPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  progressWrap.classList.remove("hidden");
  startTime = Date.now();
  startTimer();
  renderQuestion();
});

function toggleInvalid(fieldId, invalid) {
  document.getElementById(fieldId).classList.toggle("invalid", invalid);
}

/* ========== 計時器 ========== */
function startTimer() {
  timerInt = setInterval(function () {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    timerLabel.textContent = "用時 " + mm + ":" + ss;
  }, 1000);
}

/* ========== 進度列 ========== */
function updateProgress() {
  progressBar.style.width = ((current) / TOTAL * 100) + "%";
  progressLabel.textContent = "第 " + (current + 1) + " 題 / 共 " + TOTAL + " 題";
}

/* ========== 渲染題目 ========== */
function renderQuestion() {
  updateProgress();
  const q = QUESTIONS[current];
  quizPanel.innerHTML = "";

  const head = document.createElement("div");
  head.innerHTML =
    '<span class="q-num">第 ' + (current + 1) + ' 題</span>' +
    '<span class="q-num q-level">' + q.level + '</span>' +
    '<div class="q-text">' + q.text + '</div>';
  quizPanel.appendChild(head);

  if (q.type === "mc") renderMC(q);
  else if (q.type === "dnd") renderDND(q);
  else if (q.type === "match") renderMatch(q);
  else if (q.type === "combo") renderCombo(q);

  renderNav();
}

/* ── 選擇題 ── */
function renderMC(q) {
  const wrap = document.createElement("div");
  wrap.className = "options";
  const letters = ["A", "B", "C", "D", "E"];
  q.options.forEach(function (opt, i) {
    const div = document.createElement("div");
    div.className = "option" + (answers[current] === i ? " selected" : "");
    div.innerHTML = '<span class="mark">' + letters[i] + '</span><span>' + opt + '</span>';
    div.addEventListener("click", function () {
      answers[current] = i;
      wrap.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
      div.classList.add("selected");
    });
    wrap.appendChild(div);
  });
  quizPanel.appendChild(wrap);
}

/* ── 拖拉題（舊版五名詞，保留相容） ── */
function renderDND(q) {
  if (!answers[current] || typeof answers[current] !== "object") answers[current] = {};
  const placed = answers[current];
  const stage = buildStage(q, placed, q.zones,
    Object.keys(TERMS).map(function (k) { return { term: k, shape: "label" }; }));
  quizPanel.appendChild(stage.el);
  quizPanel.appendChild(stage.tray);
  quizPanel.appendChild(makeTip("提示：可將已放置的標籤再次拖走以更換。"));
}

/* ── 配對題（點 + 箭頭作答） ── */
function renderMatch(q) {
  if (!answers[current] || typeof answers[current] !== "object") answers[current] = {};
  const placed = answers[current];
  const stage = buildStage(q, placed, q.zones, q.pieces);
  quizPanel.appendChild(stage.el);
  quizPanel.appendChild(stage.tray);
  quizPanel.appendChild(makeTip("提示：可將已放置的部件再次拖走以更換；箭頭方向代表力的方向。"));
}

/* ── 挑戰題（combo：(a) 選擇 + (b) 配對） ── */
function renderCombo(q) {
  if (!answers[current] || typeof answers[current] !== "object") answers[current] = { a: null, b: {} };
  if (typeof answers[current].a === "undefined") answers[current].a = null;
  if (!answers[current].b) answers[current].b = {};
  const store = answers[current];

  /* 大圖（供 (a)(b) 共用參考） */
  const fig = document.createElement("div");
  fig.className = "dnd-stage combo-fig";
  fig.innerHTML = '<img src="' + q.image + '" alt="指甲鉗側視圖">';
  quizPanel.appendChild(fig);

  /* (a) 選擇題 */
  const aHead = document.createElement("div");
  aHead.className = "q-sub";
  aHead.innerHTML = q.partA.text;
  quizPanel.appendChild(aHead);

  const wrap = document.createElement("div");
  wrap.className = "options";
  const letters = ["A", "B", "C", "D", "E"];
  q.partA.options.forEach(function (opt, i) {
    const div = document.createElement("div");
    div.className = "option" + (store.a === i ? " selected" : "");
    div.innerHTML = '<span class="mark">' + letters[i] + '</span><span>' + opt + '</span>';
    div.addEventListener("click", function () {
      store.a = i;
      wrap.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
      div.classList.add("selected");
    });
    wrap.appendChild(div);
  });
  quizPanel.appendChild(wrap);

  /* (b) 配對題（點 + 箭頭） */
  const bHead = document.createElement("div");
  bHead.className = "q-sub";
  bHead.innerHTML = q.partB.text;
  quizPanel.appendChild(bHead);

  const stage = buildStage({ image: q.image }, store.b, q.partB.zones, q.partB.pieces);
  quizPanel.appendChild(stage.el);
  quizPanel.appendChild(stage.tray);
  quizPanel.appendChild(makeTip("提示：(b) 只需標出「上半部分」的支點、施力和負荷；可將部件拖走更換。"));
}

/* ── 共用：建立圖片舞台 + 放置區 + 部件盤 ──
   cfg    : { image }
   store  : 儲存 { zoneId: termKey } 的物件（可為子物件）
   zones  : 放置區陣列
   pieces : 可拖曳部件 [{ term, shape:'point'|'arrow'|'label', dir }] */
function buildStage(cfg, store, zones, pieces) {
  const stage = document.createElement("div");
  stage.className = "dnd-stage";
  stage.innerHTML = '<img src="' + cfg.image + '" alt="題目圖片">';

  const shapeOf = {};
  pieces.forEach(function (p) { shapeOf[p.term] = p; });

  zones.forEach(function (z) {
    const dz = document.createElement("div");
    dz.className = "dropzone";
    dz.dataset.zone = z.id;
    dz.dataset.answer = z.answer;
    dz.style.left = z.left + "%";
    dz.style.top = z.top + "%";
    if (store[z.id]) fillZone(dz, store[z.id], shapeOf[store[z.id]]);
    else dz.textContent = "放這裡";
    addDropHandlers(dz, store, shapeOf);
    stage.appendChild(dz);
  });

  const tray = document.createElement("div");
  tray.className = "token-tray";
  pieces.forEach(function (p) {
    const t = document.createElement("div");
    const used = Object.values(store).indexOf(p.term) !== -1;
    t.className = "token token-" + (p.shape || "label") + (used ? " used" : "");
    t.dataset.term = p.term;
    t.innerHTML = pieceMarkup(p, TERMS[p.term].color) +
      '<span class="tk-name">' + TERMS[p.term].name + '</span>';
    if (p.shape !== "arrow" && p.shape !== "point") t.style.background = TERMS[p.term].color;
    t.setAttribute("draggable", "true");
    addDragHandlers(t);
    tray.appendChild(t);
  });

  return { el: stage, tray: tray, shapeOf: shapeOf };
}

/* 部件的視覺（點 / 箭頭 / 純標籤） */
function pieceMarkup(p, color) {
  if (p.shape === "point") {
    return '<span class="pc pc-point" style="background:' + color + '"></span>';
  }
  if (p.shape === "arrow") {
    return '<span class="pc pc-arrow ' + (p.dir || "down") + '" style="color:' + color + '">' +
      '<svg viewBox="0 0 22 54" aria-hidden="true">' +
      '<line x1="11" y1="2" x2="11" y2="40" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M3 34 L11 51 L19 34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></span>';
  }
  return ""; /* label：靠 token 底色顯示 */
}

function makeTip(text) {
  const tip = document.createElement("p");
  tip.className = "note";
  tip.style.marginTop = "14px";
  tip.style.textAlign = "center";
  tip.innerHTML = text;
  return tip;
}

function fillZone(dz, termKey, piece) {
  dz.classList.add("filled");
  if (piece && (piece.shape === "point" || piece.shape === "arrow")) {
    dz.classList.add("has-piece");
    dz.innerHTML = pieceMarkup(piece, TERMS[termKey].color) +
      '<span class="placed-tag" style="color:' + TERMS[termKey].color + '">' + TERMS[termKey].name + '</span>';
  } else {
    dz.classList.remove("has-piece");
    dz.innerHTML = '<span class="placed" style="background:' + TERMS[termKey].color + '">' + TERMS[termKey].name + '</span>';
  }
  dz.dataset.placed = termKey;
}
function clearZone(dz) {
  dz.classList.remove("filled");
  dz.classList.remove("has-piece");
  dz.textContent = "放這裡";
  delete dz.dataset.placed;
}

/* 桌面：HTML5 Drag & Drop */
let dragTerm = null;
function addDragHandlers(token) {
  token.addEventListener("dragstart", function (e) {
    dragTerm = token.dataset.term;
    token.classList.add("dragging");
    if (e.dataTransfer) e.dataTransfer.setData("text/plain", dragTerm);
  });
  token.addEventListener("dragend", function () {
    dragTerm = null;
    token.classList.remove("dragging");
  });
  /* 觸控支援 */
  token.addEventListener("touchstart", function () { dragTerm = token.dataset.term; }, { passive: true });
}
function addDropHandlers(dz, store, shapeOf) {
  dz.addEventListener("dragover", function (e) { e.preventDefault(); dz.classList.add("over"); });
  dz.addEventListener("dragleave", function () { dz.classList.remove("over"); });
  dz.addEventListener("drop", function (e) {
    e.preventDefault();
    dz.classList.remove("over");
    if (dragTerm) placeTerm(dz, dragTerm, store, shapeOf);
  });
  /* 點擊已填放置區 → 拿走 */
  dz.addEventListener("click", function () {
    if (dz.dataset.placed) {
      for (const zid in store) { if (store[zid] === dz.dataset.placed && zid === dz.dataset.zone) delete store[zid]; }
      clearZone(dz);
      refreshTokens(store);
    } else if (dragTerm) {
      placeTerm(dz, dragTerm, store, shapeOf);
    }
  });
  /* 觸控：先點部件再點放置區 */
  dz.addEventListener("touchend", function () { if (dragTerm && !dz.dataset.placed) placeTerm(dz, dragTerm, store, shapeOf); });
}
function placeTerm(dz, termKey, store, shapeOf) {
  /* 若該部件已在其他區，先移除 */
  for (const zid in store) { if (store[zid] === termKey) delete store[zid]; }
  /* 若該區已有其他部件，覆蓋 */
  store[dz.dataset.zone] = termKey;
  /* 重新渲染同一舞台的放置區 */
  const stage = dz.closest(".dnd-stage");
  stage.querySelectorAll(".dropzone").forEach(function (d) {
    const key = store[d.dataset.zone];
    if (key) fillZone(d, key, shapeOf[key]); else clearZone(d);
  });
  refreshTokens(store);
  dragTerm = null;
}
function refreshTokens(store) {
  const used = Object.values(store);
  document.querySelectorAll(".token").forEach(function (t) {
    t.classList.toggle("used", used.indexOf(t.dataset.term) !== -1);
  });
}

/* ========== 導覽按鈕 ========== */
function renderNav() {
  const nav = document.createElement("div");
  nav.className = "q-nav";

  const prev = document.createElement("button");
  prev.className = "btn btn-ghost";
  prev.textContent = "← 上一題";
  prev.disabled = current === 0;
  prev.style.visibility = current === 0 ? "hidden" : "visible";
  prev.addEventListener("click", function () { current--; renderQuestion(); });

  const next = document.createElement("button");
  next.className = "btn btn-primary";
  next.textContent = current === TOTAL - 1 ? "完成並交卷 ✓" : "下一題 →";
  next.addEventListener("click", function () {
    if (!isAnswered()) { alert("請先作答本題再繼續。"); return; }
    if (current === TOTAL - 1) { finishQuiz(); }
    else { current++; renderQuestion(); }
  });

  nav.appendChild(prev);
  nav.appendChild(next);
  quizPanel.appendChild(nav);
}

function isAnswered() {
  const q = QUESTIONS[current];
  if (q.type === "mc") return answers[current] !== null;
  if (q.type === "dnd") return Object.keys(answers[current] || {}).length === q.zones.length;
  if (q.type === "match") return Object.keys(answers[current] || {}).length === q.zones.length;
  if (q.type === "combo") {
    const a = answers[current] || {};
    return a.a !== null && a.a !== undefined &&
           Object.keys(a.b || {}).length === q.partB.zones.length;
  }
  return false;
}

/* ========== 計分 ========== */
function grade() {
  let score = 0;
  const detail = {};
  QUESTIONS.forEach(function (q, i) {
    if (q.type === "mc") {
      const ok = answers[i] === q.answer;
      if (ok) score++;
      detail["Q" + (i + 1)] = ["A", "B", "C", "D", "E"][answers[i]];
    } else if (q.type === "dnd" || q.type === "match") {
      const placed = answers[i] || {};
      let allOk = true;
      q.zones.forEach(function (z) { if (placed[z.id] !== z.answer) allOk = false; });
      if (allOk) score++;
      /* 記錄拖拉答案（區→名詞） */
      const rec = q.zones.map(function (z) {
        return z.id + ":" + (placed[z.id] ? TERMS[placed[z.id]].name : "空");
      }).join(",");
      detail["Q" + (i + 1)] = rec;
    } else if (q.type === "combo") {
      const a = answers[i] || { a: null, b: {} };
      const aOk = a.a === q.partA.answer;
      let bOk = true;
      q.partB.zones.forEach(function (z) { if ((a.b || {})[z.id] !== z.answer) bOk = false; });
      /* (a) 與 (b) 各佔 0.5 分，兩者皆對才滿 1 分 */
      if (aOk) score += 0.5;
      if (bOk) score += 0.5;
      const L = ["A", "B", "C", "D", "E"];
      const bRec = q.partB.zones.map(function (z) {
        return z.id + ":" + ((a.b || {})[z.id] ? TERMS[a.b[z.id]].name : "空");
      }).join(",");
      detail["Q" + (i + 1)] = "(a)" + (a.a != null ? L[a.a] : "空") + " (b)" + bRec;
    }
  });
  /* 分數可能含 0.5，四捨五入不影響顯示；保留一位小數 */
  score = Math.round(score * 10) / 10;
  return { score: score, detail: detail };
}

/* ========== 完成 ========== */
function finishQuiz() {
  clearInterval(timerInt);
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  const { score, detail } = grade();
  progressBar.style.width = "100%";
  progressLabel.textContent = "已完成 / 共 " + TOTAL + " 題";

  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  renderResult(score, timeSpent);

  /* 上傳成績 */
  uploadResult({
    class: student.class,
    id: student.id,
    name: student.name,
    score: score,
    timeSpent: timeSpent,
    answersDetails: detail
  });
}

/* ========== 結果畫面 ========== */
function renderResult(score, timeSpent) {
  const pct = Math.round(score / TOTAL * 100);
  const mm = String(Math.floor(timeSpent / 60)).padStart(2, "0");
  const ss = String(timeSpent % 60).padStart(2, "0");
  let msg = "繼續努力！建議回到首頁重溫三類槓桿。";
  if (pct === 100) msg = "太棒了！你完全掌握了槓桿的概念。";
  else if (pct >= 80) msg = "表現優異，只差一點點就滿分了！";
  else if (pct >= 60) msg = "不錯，已掌握大部分概念。";

  let html =
    '<h2>評估完成</h2>' +
    '<p class="note">' + student.class + ' 班　學號 ' + student.id + '　' + student.name + '</p>' +
    '<div class="result-score">' +
      '<div class="big">' + score + ' / ' + TOTAL + '</div>' +
      '<div class="sub">答對率 ' + pct + '%　·　用時 ' + mm + ':' + ss + '</div>' +
      '<p style="margin-top:12px;font-weight:700;color:var(--lilac-700)">' + msg + '</p>' +
    '</div>';

  /* 逐題檢討 */
  html += '<div class="review">';
  QUESTIONS.forEach(function (q, i) {
    let correct, yourAns, rightAns;
    const L = ["A", "B", "C", "D", "E"];
    if (q.type === "mc") {
      correct = answers[i] === q.answer;
      yourAns = L[answers[i]] + ". " + q.options[answers[i]];
      rightAns = L[q.answer] + ". " + q.options[q.answer];
    } else if (q.type === "dnd") {
      const placed = answers[i] || {};
      correct = q.zones.every(function (z) { return placed[z.id] === z.answer; });
      yourAns = correct ? "五個標籤全部正確" : "部分標籤位置不正確";
      rightAns = "支點/力點/施力/重點/負荷 各就各位";
    } else if (q.type === "match") {
      const placed = answers[i] || {};
      correct = q.zones.every(function (z) { return placed[z.id] === z.answer; });
      yourAns = correct ? "支點、施力、負荷位置全部正確" : "部分部件位置不正確";
      rightAns = "支點（點）在左端鉸鏈、施力（箭頭↓）在右端手柄、負荷（箭頭↑）在中間刀刃";
    } else if (q.type === "combo") {
      const a = answers[i] || { a: null, b: {} };
      const aOk = a.a === q.partA.answer;
      const bOk = q.partB.zones.every(function (z) { return (a.b || {})[z.id] === z.answer; });
      correct = aOk && bOk;
      yourAns = "(a) " + (a.a != null ? L[a.a] : "未答") + (aOk ? " ✓" : " ✗") +
                "　(b) " + (bOk ? "配對正確 ✓" : "配對有誤 ✗");
      rightAns = "(a) " + L[q.partA.answer] + "．" + q.partA.options[q.partA.answer] +
                 "；(b) 上半部分：支點（點）在左端樞軸、施力（箭頭↓）在右端按壓端、負荷（箭頭↑）在中間頂壓刀片處";
    }
    html +=
      '<div class="review-item ' + (correct ? "correct" : "wrong") + '">' +
        '<div class="qh">第 ' + (i + 1) + ' 題　' + (correct ? "✓ 答對" : "✗ 答錯") + '</div>' +
        '<div class="ans">你的作答：<b class="' + (correct ? "ok" : "no") + '">' + yourAns + '</b>' +
        (correct ? "" : '<br>正確答案：<b class="ok">' + rightAns + '</b>') + '</div>' +
      '</div>';
  });
  html += '</div>';

  /* 上傳狀態 + 按鈕 */
  html +=
    '<div class="upload-status" id="uploadStatus"></div>' +
    '<div class="q-nav" style="margin-top:24px;">' +
      '<a href="index.html" class="btn btn-ghost">← 回首頁重溫</a>' +
      '<button class="btn btn-primary" id="retryUpload" style="display:none;">重新上傳成績</button>' +
    '</div>';

  resultPanel.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ========== 上傳到 Google Sheet ========== */
async function uploadResult(data) {
  const box = document.getElementById("uploadStatus");
  const retryBtn = document.getElementById("retryUpload");
  box.className = "upload-status show sending";
  box.innerHTML = '<span class="spinner"></span>正在上傳成績至老師的記錄表…';

  const payload = {
    studentClass: data.class,      // 例如: "3A"
    studentId: data.id,            // 例如: "05"
    studentName: data.name,        // 姓名
    score: data.score,             // 得分
    totalQuestions: TOTAL,         // 總題數
    duration: data.timeSpent,      // 用時（秒）
    answers: data.answersDetails,  // 各題作答
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // 用 text/plain 避免 CORS 預檢阻擋
      },
      body: JSON.stringify(payload)
    });

    let ok = response.ok;
    /* 嘗試解析回應（GAS 通常回傳 JSON） */
    try {
      const result = await response.json();
      if (result && (result.status === "success" || result.result === "success")) ok = true;
      console.log("提交回應:", result);
    } catch (e) { /* 即使無法解析 JSON，只要 HTTP 成功仍視為上傳成功 */ }

    if (ok) {
      box.className = "upload-status show ok";
      box.textContent = "✓ 成績已成功上傳！老師已收到你的記錄。";
      if (retryBtn) retryBtn.style.display = "none";
    } else {
      throw new Error("HTTP " + response.status);
    }
  } catch (error) {
    console.error("提交失敗:", error);
    box.className = "upload-status show fail";
    box.textContent = "✗ 成績上傳失敗，請檢查網絡連線後再試。";
    if (retryBtn) {
      retryBtn.style.display = "inline-flex";
      retryBtn.onclick = function () { uploadResult(data); };
    }
  }
}

