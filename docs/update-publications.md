# 논문 목록 월간 업데이트 절차

매달 1일 클라우드 에이전트(Claude Code 루틴)가 이 문서대로 새 논문을 찾아 `assets/js/data.js`에 추가합니다.
사람이 직접 업데이트할 때도 같은 절차를 따르면 됩니다.

## 대상 (기존 기준과 같음)

| type | 대상 | 출처 |
|---|---|---|
| `journal` | 권헌영(Hun Yeong Kwon) 교수가 **교신저자**인 학술지 논문 | 국내: KCI / 해외: OpenAlex |
| `conference` | 권헌영 교수가 교신저자인 국제학술대회 논문 | OpenAlex |
| `phd` | 권헌영 교수가 지도교수인 **고려대학교** 박사학위논문 | RISS |
| `ms` | 권헌영 교수가 지도교수인 **고려대학교** 석사학위논문 | RISS |

교신저자 판단:
- 원문(KCI PDF 등)이나 출판사 메타데이터(OpenAlex `is_corresponding`)에 교신저자로 표시되어 있으면 `cor: "confirmed"`.
- 확인할 수 없고 권헌영 교수가 **마지막 저자**이면 `cor: "inferred"`로 포함합니다.
- 다른 교신저자가 확인되었거나 중간 저자로만 참여한 논문, 번역 논문, 학술대회 발표문·소식지는 넣지 않습니다.
- 동명이인 주의: 소속이 고려대학교(정보보호대학원)인지 확인합니다.

## 찾는 방법

1. **KCI (국내 학술지)**
   - 저자 검색: `https://www.kci.go.kr/kciportal/po/search/poArtiSearList.kci?poSearchBean.queryText=AU%3A%EA%B6%8C%ED%97%8C%EC%98%81&poSearchBean.docsCount=100`
   - 상세 페이지: `https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART...`
   - 상세 페이지의 `<input id="hdnKeyWords" value='...'>`에 저자 키워드가, `id="korAbst"` / `id="engAbst"`에 초록이 있습니다.
   - 저자 목록이 "외 N명"으로 잘려 있으면 상세 페이지의 저자 목록으로 확인합니다.
   - 요청 시 일반 브라우저 User-Agent와 `Referer: https://www.kci.go.kr/`를 붙이고, 요청 사이에 1초쯤 쉽니다.
2. **OpenAlex (해외 학술지·학술대회)**
   - `https://api.openalex.org/works?filter=author.id:A5004238826,from_publication_date=<작년 1월 1일, 예: 2025-01-01>&per-page=200`
   - 권헌영 교수의 OpenAlex 저자 ID는 여러 개입니다: A5004238826(주), A5038200334, A5049917785, A5015495061, A5029088204, A5022977680, A5002159355, A5096766950, A5050627534, A5064957268, A5096388792, A5030938696.
   - `authorships[].is_corresponding`으로 교신저자를 확인합니다. KCI에도 있는 국내 논문(같은 제목)은 중복이므로 KCI 쪽만 둡니다.
3. **RISS (학위논문)**
   - `https://www.riss.kr/search/Search.do?...&query=권헌영&colName=bib_t` (학위논문) 검색 후 상세 페이지의 **지도교수** 항목이 권헌영(權憲永)이고 학교가 고려대학교인 것만 넣습니다.
   - 공동지도면 `advisor` 필드에 다른 지도교수 이름을 적습니다.
   - 링크는 `https://www.riss.kr/link?id=T...` 형식을 씁니다.

이미 `data.js`에 있는 논문(같은 링크, 또는 같은 제목+연도)은 건너뜁니다.

## data.js에 넣는 형식

`publications` 배열은 **최신 연도가 위**로 오게 정렬되어 있습니다. 같은 연도 안에서는 기존 순서를 해치지 않게 그 연도 묶음의 맨 앞에 넣습니다. 한 줄에 한 항목, 기존 줄과 같은 JSON 모양을 유지합니다.

```js
{"type": "journal", "year": 2026, "title": "논문 제목", "authors": "홍길동, 권헌영", "venue": "학술지명 제00권 제0호, pp.1–20", "link": "https://www.kci.go.kr/...artiId=ART...", "cor": "confirmed", "topics": ["privacy"], "kw": ["개인정보보호법", "가명정보"]},
{"type": "conference", "year": 2026, "title": "Paper title", "authors": "Gil-dong Hong, Hun Yeong Kwon", "venue": "Conference or proceedings name", "link": "https://doi.org/...", "cor": "confirmed"},
{"type": "ms", "year": 2026, "title": {"ko": "국문 제목", "en": "English title"}, "authors": "홍길동", "venue": {"ko": "고려대학교 정보보호대학원 정보보호학과 석사학위논문", "en": "M.S. Thesis, Graduate School of Information Security, Korea University"}, "link": "https://www.riss.kr/link?id=T..."},
```

- 영문 이름 표기는 **Hun Yeong Kwon** (하이픈 없음).
- 학과가 다르면 venue의 학과 이름을 실제 학과로 씁니다(예: 개인정보보호학과, 정보보호학과, 융합보안학과).
- 박사는 `"Ph.D. Dissertation, ..."`, 석사는 `"M.S. Thesis, ..."`.

### 연구 동향용 `topics`, `kw` (KCI 학술지 논문에만)

KCI 논문에는 홈페이지 '연구 동향' 표와 키워드 연결망에 쓰이는 두 필드를 붙입니다.

- `topics`: 아래 주제 코드 중 1~2개 (가장 중심 주제를 먼저)

  | 코드 | 주제 |
  |---|---|
  | privacy | 개인정보와 프라이버시 |
  | security | 정보보호와 사이버보안 |
  | crime | 사이버 범죄와 디지털 수사 |
  | ai | 인공지능과 신기술 |
  | defense | 사이버 안보와 국방 |
  | internet | 인터넷과 플랫폼 규제 |
  | blockchain | 블록체인과 가상자산 |
  | data | 데이터와 공공정보 |
  | egov | 전자정부와 디지털 행정 |
  | industry | 산업과 소비자 규제 |

- `kw`: 표준 키워드 2~4개. 저자 키워드(국문·영문)를 보고 **아래 목록에 같은 뜻이 있으면 반드시 그 이름을 그대로** 씁니다. 목록에 없는 새 개념일 때만 짧은 한국어 명사구로 새 키워드를 만듭니다. 같은 뜻의 표현(예: personal information / 개인정보보호 / privacy protection)은 하나로 합칩니다.

  현재 표준 키워드 (많이 쓰인 순):
  디지털 증거, 압수수색, 개인정보보호, 손해배상, 개인정보보호법, 가명정보, 가상자산, 블록체인, 비교법, 클라우드, 개인정보 유출, 금융보안, 사이버안보, 인공지능, 인공지능 윤리, 인터넷 규제, 참여권, 토픽모델링, 해킹, GDPR, 개인정보자기결정권, 공공데이터, 과징금, 국가안보, 국방, 국제공조, 디지털 포렌식, 디지털 플랫폼, 보안 인력양성, 비식별화, 사이버범죄, 엔지니어링 산업, 이용자 보호, 인공지능 규제, 자격제도, 전자정부, 취약점, 코로나19, 키워드 네트워크 분석, 프라이버시, 감청, 개인정보 침해, 공급망 보안, 기술유출, 데이터 보안, 데이터 브로커, 동의, 디지털 시민성, 디지털자산, 머신러닝, 보안 인증제도, 보안관제, 보안정책, 빅데이터, 영업비밀, 원자력, 입법과정, 저작권, 전자금융거래법, 정보보호법제, 정보주체 권리, 제3자 제공, 제로트러스트, 제품안전, 통신비밀, 표현의 자유, 행정정보 공유, 헌법, AI 거버넌스, EU 인공지능법, IoT, 가상 데스크톱, 감염병, 강제집행, 개인데이터 저장소, 개인정보 보험, 개인정보 분쟁조정, 개인정보 삭제, 개인정보 전송요구권, 개인정보 처리방침, 개인정보 처리위탁, 게임 규제, 결합전문기관, 계좌 지급정지, 공공 정보화사업, 공공부문 AI, 국방 획득, 국외이전, 군사 AI, 다크패턴, 대규모 언어모델, 데이터 거래, 데이터 거버넌스, 데이터 경제, 데이터 이동성, 데이터 정책, 드론, 디지털 성범죄, 디지털 정부, 디지털 증명서, 마이데이터, 망분리, 맞춤형 광고, 매크로, 방송통신 융합, 버그 바운티, 법적 책임, 법조, 보안 요구사항, 보안 인식, 보안 준수, 보이스피싱, 부동산 거래, 북한, 불법 온라인 도박, 비트토렌트, 사법제도, 사이버공격, 사이버군, 사이버범죄협약, 사이버보안, 사이버보안 윤리, 사이버심리전, 사이버전, 산업제어시스템, 소비자 보호, 소비자 안전, 스마트 에너지, 스마트컨트랙트, 스테가노그래피, 악성코드 탐지, 암표, 암호정책, 역외 압수수색, 연구동향 분석, 영상물 등급분류, 오픈소스, 외국법자문사, 위장수사, 위험관리, 위협정보 공유, 유통산업, 융합보안, 의료정보, 이상트래픽 탐지, 인공지능 생태계, 인증, 인터넷 윤리, 잊힐 권리, 자동차 사이버보안, 자율규제, 자율무기체계, 전문가 윤리, 전파정책, 정보공개, 정보기관 감독, 정보기술법제, 정책변동, 침해사고 탐지, 특허 분석, 피싱, 행정 사법통제, 행정공간정보, AI 보안, AI 안전, AI 에이전트, OT 보안

## 마무리

1. `node -e 'global.window={};require("./assets/js/data.js");console.log(window.LAB_DATA.publications.length)'`로 문법 오류가 없는지 확인합니다.
2. `index.html`에서 `data.js?v=...` 값을 오늘 날짜(예: `20261201`)로 바꿔 브라우저에 남은 예전 파일을 피합니다.
3. 새 논문이 있으면 `main`에 커밋하고 푸시합니다. 커밋 메시지: `Monthly publication update (YYYY-MM): +N` 과 추가한 논문 목록.
   푸시하면 GitHub Pages(https://ku-clplab.kr)가 1~2분 뒤 자동으로 갱신됩니다.
4. 새 논문이 없으면 아무것도 커밋하지 않습니다.
5. 홈페이지의 다른 파일(디자인, 문구)은 고치지 않습니다.
