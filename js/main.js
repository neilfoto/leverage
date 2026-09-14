/* 淡入動畫 — 捲動時顯示 */
document.addEventListener("DOMContentLoaded", function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("show"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });

  /* 觸控裝置：輕觸圖片亦可切換顯示標註 */
  document.querySelectorAll(".interactive").forEach(function (box) {
    box.addEventListener("click", function () {
      box.classList.toggle("touch-show");
      box.querySelectorAll(".marker").forEach(function (m) {
        m.style.opacity = box.classList.contains("touch-show") ? "1" : "";
      });
      const hint = box.querySelector(".hint");
      if (hint) hint.style.opacity = box.classList.contains("touch-show") ? "0" : "";
    });
  });
});
