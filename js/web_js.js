// 다크모드 토글 버튼
const toggleButton = document.getElementById("theme-toggle");
const html = document.documentElement;

toggleButton.addEventListener("click", () => {
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");

// 다크모드 버튼 누를 때 아이콘도 같이 바꿔주기
  toggleButton.textContent = isDark ? "🌙" : "☀️";
});

// CTA 버튼 클릭 시 Contact 섹션으로 스크롤
const CTAButton = document.querySelector(".cta-button");
CTAButton.addEventListener("click", () => {
  const contactSection = document.getElementById("contact");
  contactSection.scrollIntoView({ behavior: "smooth" });
});