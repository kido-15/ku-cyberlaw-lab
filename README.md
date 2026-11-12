# 고려대학교 정보보호대학원 사이버법정책연구실 홈페이지

Cyber Law and Policy Lab, Graduate School of Information Security, Korea University

빌드 과정 없는 정적 사이트(HTML/CSS/JS)입니다. 한국어/영어 전환을 지원합니다.

## 구조

```
index.html            페이지 본문 (한국어 원문)
assets/css/style.css  스타일
assets/js/data.js     ★ 구성원 · 연구 성과 데이터 (여기만 고치면 됨)
assets/js/main.js     연구 분야 목록, 영어 번역, 동작 스크립트
assets/img/            교수 사진, 고려대 엠블럼, KU시큐리티 로고
```

## 자주 하는 수정

| 하고 싶은 것 | 수정할 곳 |
|---|---|
| 구성원 추가 | `assets/js/data.js` → `members` 배열 (예시 주석 참고) |
| 논문 · 학위논문 추가/삭제 | `assets/js/data.js` → `publications` 배열 (`type`: journal / conference / phd / ms) |
| 교수님 사진 바꾸기 | `assets/img/professor.jpg` 교체 |
| 연구 분야 문구 | `assets/js/main.js` 상단 `RESEARCH` |
| 영어 문구 | `assets/js/main.js` → `EN` |
| 한국어 문구 | `index.html`의 해당 텍스트 |

## 로컬에서 보기

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000
```

## 배포 (GitHub Pages 예시)

1. GitHub에 저장소를 만들고 이 폴더를 push
2. Settings → Pages → Branch: `main` / `/ (root)` 선택
3. 몇 분 후 `https://<계정>.github.io/<저장소>/` 에서 확인

## 연구 성과 목록 기준 (2026-11-12 수집)

- **학술논문**: 권헌영 교수가 교신저자인 논문
  - 국내 학술지: KCI 등재 논문. 교신저자는 KCI 원문 PDF의 표기로 확인했습니다.
  - 국제 학술지·학술대회: OpenAlex (출판사 메타데이터의 교신저자 표기)
  - 원문으로 확인하지 못한 논문 중 권헌영 교수가 **마지막 저자**인 경우는 교신저자로 추정해 포함했습니다.
    (원문 확인이 가능했던 논문에서 마지막 저자인 경우는 모두 교신저자였습니다.) `cor: "inferred"`로 표시되어 있습니다.
  - 제외: 다른 교신저자가 확인된 논문, 중간 저자로만 참여한 논문, 번역 논문, 학술대회 발표문·소식지
- **학위논문**: RISS에서 지도교수가 권헌영(權憲永)으로 등록된 고려대학교 석·박사 학위논문 (공동지도 포함)

## 출처

- 연구실 소개: 고려대학교 정보보호대학원 연구실 소개 페이지
  (https://security.korea.ac.kr/bbs/page.php?hid=m04_02_01_06)
- 소개영상: https://www.youtube.com/watch?v=RhtJwv2Uhdo
