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

// GitHub API를 통해 프로젝트 불러오기
let allRepos = [];       // GitHub에서 가져온 "내 소유" 저장소 전체를 저장해둘 변수
let currentFilter = "all"; // 지금 선택된 언어 필터

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

        // 소유자가 나인 것만 남기기
        allRepos = repos.filter(repo => repo.owner.login === username);

        renderLanguageFilters(allRepos);
        renderProjects(allRepos);

    } catch (error) {
        container.innerHTML = `문제가 생겼습니다. 잠시 후 다시 시도해주세요`;
        console.error(error);
    }
}

// ----------  어떤 언어들이 있는지 뽑아서 버튼 만들기 ----------
function renderLanguageFilters(repos) {
    const filterContainer = document.getElementById("language-filters");

    // language 값만 뽑고, null 제거하고, 중복 제거
    const languages = [...new Set(
        repos.map(repo => repo.language).filter(lang => lang !== null)
    )];

    filterContainer.innerHTML = `<button class="filter-btn active" data-lang="all">전체</button>`;
    
    // "전체" 버튼에 데이터 속성으로 "all" 저장
    languages.forEach(lang => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.textContent = lang; // 버튼에 언어 이름 표시
        btn.dataset.lang = lang; // 버튼에 데이터 속성으로 언어 저장
        filterContainer.appendChild(btn); // 버튼을 필터 컨테이너에 추가
    });

    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.dataset.lang;

            // 핵심: array.filter()로 언어별 필터링
            const filtered = currentFilter === "all"
                ? allRepos
                : allRepos.filter(repo => repo.language === currentFilter);

            renderProjects(filtered);
        });
    });
}

// ---------- 2. 카드 그리기 ----------
function renderProjects(repos) {
    const container = document.getElementById("projects-container");

    if (repos.length === 0) {
        container.innerHTML = `해당하는 프로젝트가 없어요`;
        return;
    }

    container.innerHTML = "";

    repos.forEach(repo => {
        const card = document.createElement("a"); // 카드 요소를 앵커 태그로 생성
        card.className = "project-card"; 
        card.href = repo.html_url;
        card.target = "_blank"; // 새 탭에서 열기
        card.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : "자세한 설명은 GitHub에서 확인해주세요."}</p>
         
        `;
        container.appendChild(card); // 카드 컨테이너에 추가
    });
}
loadProjects();

// ---------- 타이핑 애니메이션 ----------
// speed: 글자 하나당 타이핑 속도(ms)
// pauseTime: 한 문장 끝나고 다음 문장 시작 전 대기 시간(ms)
function typewriterLoop(elementId, text, speed, pauseTime ) { 
    const element = document.getElementById(elementId);
    let index = 0;

    function typeNextChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextChar, speed);
        } 
        else {
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