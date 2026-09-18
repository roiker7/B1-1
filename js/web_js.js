// ---------- 다크모드 토글 버튼 ----------
const toggleButton = document.getElementById("theme-toggle");
const html = document.documentElement;

// 1. 페이지가 열리자마자, 저장된 테마가 있는지 확인해서 미리 적용
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  html.setAttribute("data-theme", "dark");
  toggleButton.textContent = "☀️";
} else if (savedTheme === "light") {
  html.setAttribute("data-theme", "light");
  toggleButton.textContent = "🌙";
}
// 2. 버튼 클릭 시, 테마 전환 + 로컬스토리지에 저장
toggleButton.addEventListener("click", () => {
  const isDark = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  toggleButton.textContent = isDark ? "🌙" : "☀️";

  localStorage.setItem("theme", newTheme);
});

// ---------- 햄버거 메뉴  ----------
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.textContent = isOpen ? "✕" : "☰";
});

// 메뉴 안의 링크를 클릭하면 자동으로 메뉴 닫기 (모바일 UX)
siteNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "☰";
  });
});

// CTA 버튼 클릭 시 Contact 섹션으로 스크롤
const CTAButton = document.querySelector(".cta-button");
CTAButton.addEventListener("click", () => {
  const contactSection = document.getElementById("contact");
  contactSection.scrollIntoView({ behavior: "smooth" });
});

// GitHub API를 통해 프로젝트 불러오기
let allRepos = [];
let currentFilter = "all";

async function loadProjects() {
    const username = "roiker7";
    const container = document.getElementById("projects-container");

    container.innerHTML = `불러오는 중...`;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);

        if (!response.ok) {
            throw new Error("GitHub에서 데이터를 가져오지 못했어요");
        }

        const repos = await response.json();
        allRepos = repos.filter(repo => repo.owner.login === username);

        renderLanguageFilters(allRepos);
        renderProjects(allRepos);

    } catch (error) {
        container.innerHTML = `문제가 생겼습니다. 잠시 후 다시 시도해주세요`;
        console.error(error);
    }
}
// 언어 필터 버튼 렌더링
function renderLanguageFilters(repos) {
    const filterContainer = document.getElementById("language-filters");

    const languages = [...new Set(
        repos.map(repo => repo.language).filter(lang => lang !== null)
    )];

    filterContainer.innerHTML = `<button class="filter-btn active" data-lang="all">전체</button>`;

    languages.forEach(lang => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.textContent = lang;
        btn.dataset.lang = lang;
        filterContainer.appendChild(btn);
    });
    // 필터 버튼 클릭 이벤트
    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.dataset.lang;

            const filtered = currentFilter === "all"
                ? allRepos
                : allRepos.filter(repo => repo.language === currentFilter);

            renderProjects(filtered);
        });
    });
}

function renderProjects(repos) {
    const container = document.getElementById("projects-container");

    if (repos.length === 0) {
        container.innerHTML = `해당하는 프로젝트가 없어요`;
        return;
    }
    // 프로젝트 카드 초기화
    container.innerHTML = "";

    repos.forEach(repo => {
        const card = document.createElement("a");
        card.className = "project-card";
        card.href = repo.html_url;
        card.target = "_blank";
        card.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : "자세한 설명은 GitHub에서 확인해주세요."}</p>
        `;
        container.appendChild(card);
    });
}
loadProjects();

// ---------- 타이핑 애니메이션 ----------
function typewriterLoop(elementId, text, speed, pauseTime) {
    const element = document.getElementById(elementId);
    let index = 0;

    function typeNextChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextChar, speed);
        } else {
            setTimeout(() => {
                element.textContent = "";
                index = 0;
                typeNextChar();
            }, pauseTime);
        }
    }
    typeNextChar();
}
typewriterLoop("typewriter", "안녕하세요\n반가워요!", 200, 2500);

// ---------- Contact 폼 제출 처리 ----------
const contactForm = document.querySelector(".contact form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formStatus.textContent = "문의가 접수됐어요! 빠른 시일 내에 답변드릴게요.";
  contactForm.reset();
});

// ---------- 스크롤 시 상단으로 이동 버튼 ----------
const topButton = document.querySelector("#topButton");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 300) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
});

topButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ---------- 스크롤 시 헤더 배경색 변경 ----------
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});