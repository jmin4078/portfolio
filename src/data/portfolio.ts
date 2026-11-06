// Portfolio content. Every statement here was checked against the project repositories, PRs, and Notion pages.
// Wording matches the portfolio deck (v10): plain terms, own scope only, no code samples.

export type Troubleshooting = {
  title: string
  problem: string[]
  method: string[]
  implementation: string[]
  limits: string[]
  diagram?: { src: string; alt: string }
}

export type Feature = { title: string; points: string[] }

export type Project = {
  slug: string
  name: string
  order: number
  logo: string
  accent: string
  tagline: string
  period: string
  team: string
  role: string
  stack: string[]
  summary: string[]
  repo: { label: string; url: string }
  scopeNote: string
  features: { lead: string; items: Feature[] }[]
  diagrams?: { src: string; alt: string; caption: string }[]
  troubleshooting: Troubleshooting[]
  review: string[]
  reviewSource: string
}

export const profile = {
  name: '제민기',
  photo: 'images/profile.jpg',
  role: 'Backend · AI Engineer',
  headline: '결제·AI처럼 결과가 불확실한 기능도 데이터가 어긋나지 않게 만드는 백엔드 개발자',
  email: 'jmkk9345@naver.com',
  github: 'https://github.com/jmin4078',
  intro: [
    '숫자 계산·검증은 서버가, 문장 작성은 AI가 맡도록 나누고, 평가 문항으로 프롬프트 개선 효과와 부작용을 함께 측정합니다.',
    '결제사 응답이 끊겨도 중복 주문 방지 키와 후처리 배치로 주문·재고·결제 상태를 맞춥니다.',
    '팀 프로젝트 3회 중 2회(BaroHae, Packing) 팀장을 맡았습니다.',
  ],
}

export const skills: { group: string; items: string }[] = [
  { group: 'Backend', items: 'Java · Spring Boot · Spring Data JPA · Spring Scheduling' },
  { group: 'Database', items: 'PostgreSQL · pgvector · Redis · Flyway · Supabase' },
  { group: 'AI', items: 'Spring AI · Google Gemini · 임베딩 유사 검색 · RAG · AI 응답 검증' },
  { group: 'Frontend', items: 'React · TypeScript · TanStack Query · Vanilla JS' },
  { group: 'Test · Tools', items: 'JUnit · Testcontainers · Vitest · Docker · GitHub · Linear' },
]

export const timeline: { period: string; title: string; detail: string }[] = [
  { period: '2026.05 – 2026.11', title: '프로그래머스 데브코스 · 생성형 AI 활용 백엔드', detail: 'Spring Boot·JPA 백엔드, Spring Security·JWT 인증 학습, Spring AI·RAG 실습, 팀 프로젝트 3회 수행' },
  { period: '2025.01 – 2025.07', title: '타이코에이엠피(주) Digital Factory 팀 인턴', detail: '생산 현황 보드 설치 지원, 데이터 누락·호환성 이슈를 찾아 담당 부서에 보고' },
  { period: '2019.03 – 2026.02', title: '영남대학교 정보통신공학전공', detail: '졸업' },
]

export const projects: Project[] = [
  {
    slug: 'grab',
    name: 'GRAB',
    order: 1,
    logo: 'images/logo-grab.png',
    accent: '#B7E31B',
    tagline: '수요 확인부터 결제까지 잇는 한정 판매 커머스',
    period: '2026.09.22 – 2026.11.04 (진행 중)',
    team: '4인 팀',
    role: '백엔드 주문·결제, 수요 분석·AI 기능 (결제·주문·수요 분석 화면 포함)',
    stack: ['Java 17', 'Spring Boot 4.1', 'Spring AI + Gemini', 'PostgreSQL 18 + pgvector', 'Redis', 'Flyway', 'Testcontainers', 'React 19', 'TypeScript', '토스페이먼츠'],
    summary: [
      '판매자가 상품(DROP)을 공개하면 구매자의 관심 표시(WISH)로 수요를 먼저 확인하고, 정한 수량만 한정 판매합니다.',
      '중복 주문·결제 누락 없이 주문과 결제를 처리하고, 판매자에게 수요 분석 결과와 AI 설명을 제공합니다.',
    ],
    repo: { label: 'github.com/jmin4078/GRAB', url: 'https://github.com/jmin4078/GRAB' },
    scopeNote: '주문·결제 백엔드와 수요 분석·AI 기능, 그리고 결제·주문·수요 분석 화면은 제가 담당했습니다. 인증, DROP·WISH, 판매자·관리자, 배송, CI/CD·모니터링은 팀원이 담당했습니다.',
    features: [
      {
        lead: '결제사 응답이 늦거나 끊겨도 주문·재고·결제 상태가 서로 맞도록 처리했습니다.',
        items: [
          { title: '중복 주문 방지', points: ['주문 요청마다 고유 키(Idempotency-Key)와 요청 내용 해시를 함께 저장', '같은 요청이 다시 오면 기존 주문을 돌려주고, 키는 같은데 내용이 다르면 거절(409)', '같은 요청이 동시에 들어오면 먼저 저장된 주문을 다시 조회해 반환'] },
          { title: '재고 선점', points: ['상품 옵션 행을 항상 같은 순서로 잠가 교착 상태(데드락) 방지', '남은 재고 확인과 예약을 한 트랜잭션에서 처리', '주문 후 10분 안에 결제해야 하며, 결제 금액은 서버가 계산'] },
          { title: '결제 후처리 배치', points: ['결제사(PG) API 호출은 DB 트랜잭션 밖에서 실행', '10초마다 미확정 결제 확인 → 기한 지난 주문 만료 → 실패한 취소 재요청 → 자동 환불', '서버가 여러 대여도 같은 결제를 두 번 처리하지 않음(SKIP LOCKED)'] },
        ],
      },
      {
        lead: '수량은 서버가 계산하고, AI는 계산된 숫자를 판매자가 읽기 쉬운 문장으로 설명합니다.',
        items: [
          { title: '판매량 예측', points: ['관심 표시(WISH) 수 × 판매자의 과거 구매 전환율로 예상 판매량 범위 계산', '판매 이력이 적을수록 범위를 넓게 잡는 95% 윌슨 신뢰구간 사용', '시장 평균은 판매자 5명·상품 10개 이상 모였을 때만 공개'] },
          { title: 'AI 설명', points: ['계산은 서버가 하고, AI(LLM)는 결과를 문장으로 설명만 함', 'AI 설명 속 숫자가 서버 계산값과 하나라도 다르면 설명을 버림', '판매자별 하루 30회 제한, 같은 입력은 캐시 재사용, 전용 스레드에서 실행'] },
          { title: '유사 상품 추천', points: ['상품 정보를 Gemini 임베딩(768차원)으로 바꿔 pgvector에서 검색', '같은 사용자 3명 이상이 함께 관심 표시한 상품 우선, 없으면 유사도 0.75 이상', '비슷한 상품의 실제 판매 실적을 근거로 AI 설명 생성(RAG)'] },
        ],
      },
    ],
    diagrams: [
      { src: 'images/arch-grab.png', alt: 'GRAB 시스템 아키텍처', caption: '시스템 아키텍처 · 주황색이 직접 구현한 부분, 회색은 팀원 담당·외부 서비스' },
      { src: 'images/grab-erd.png', alt: 'GRAB ERD', caption: 'ERD 주요 테이블 · 주황색이 담당 테이블' },
    ],
    troubleshooting: [
      {
        title: 'PG는 승인했는데 주문은 만료되는 불일치',
        problem: [
          '승인 응답 유실·타임아웃·서버 재시작으로 결제가 ‘결과 미확정’(PENDING·UNKNOWN) 상태로 남은 사이, 만료 배치가 주문을 만료시켰습니다. 실제로 승인된 결제의 돈이 고객에게 돌아가지 않았습니다.',
          '원인: 만료 배치가 결제 상태를 확인하지 않았고, 미확정 결제는 사용자가 다시 결제할 때만 정리됐습니다.',
        ],
        method: [
          '배치 순서를 ‘미확정 결제 확인 → 주문 만료’로 고정해 마감 전 승인 건을 먼저 반영하고, 만료 뒤 승인된 건은 결제 취소로 자동 환불합니다.',
          '운영자 화면이 없어 수동 환불이 어려웠기 때문입니다. 일괄 UPDATE·조회 시점 만료·Redis 만료 알림도 검토했지만 로직 중복·재고 미반환·알림 유실 위험이 있어 제외했습니다.',
        ],
        implementation: [
          '60초 넘게 미확정인 결제를 50건씩 가져와 결제사에 조회해 상태를 확정합니다. 한 주기는 최대 5초이고, SKIP LOCKED로 여러 서버가 같은 건을 가져가지 않습니다.',
          '자동 환불은 결제 1건당 한 번만 실행되도록 DB 제약(부분 유일 인덱스)으로 보장하고, 결제사 주문번호가 다르면 환불하지 않습니다.',
          '검증: 서버 3대가 동시에 실행해도 같은 결제를 두 번 처리하지 않았고, 자동 환불 통합 테스트 9개를 추가했습니다.',
        ],
        limits: [
          '운영자 화면이 없어 주문번호 불일치·결제사 거절 건은 수동으로 확인해야 합니다.',
          '결제사 장애 시 주문 만료가 최대 약 45초 늦어집니다.',
          '10분이 지나도 결과를 모르는 결제는 경고 로그만 남기고 자동 처리하지 않습니다.',
        ],
        diagram: { src: 'images/flow-grab-payment.png', alt: '결제 배치 한 주기 흐름' },
      },
      {
        title: 'LLM이 수치를 바꾸거나 잘못 해석하는 위험',
        problem: [
          'AI(LLM)에게 수요 분석 설명을 맡기면 예상 수량·전환율을 다른 숫자로 쓰거나, 재고 부족을 초과로 반대로 쓸 수 있습니다.',
          '판매자는 이 설명을 보고 생산 수량을 정하므로, 숫자가 틀리면 잘못된 생산 결정으로 이어집니다.',
        ],
        method: [
          '숫자는 서버가 정해진 공식으로만 계산하고, AI에는 계산 결과만 보내 문장 설명만 맡깁니다.',
          'AI 설명이 맞는지 서버 값과 비교해 확인할 수 있고, AI 호출이 실패해도 수요 분석 숫자는 그대로 보여줄 수 있기 때문입니다. AI가 실패해도 화면은 오류로 끝나지 않고, 설명 상태(생성됨·버림·실패·꺼짐)만 구분해 보여줍니다.',
        ],
        implementation: [
          'AI 설명에 나온 숫자를 모두 뽑아 서버가 보낸 값과 비교하고, 하나라도 다르면 설명을 버립니다(원문도 저장하지 않음).',
          '부족·초과 방향을 뒤집지 않도록 비율은 정수 %로, 차이는 +/- 부호 대신 SHORT·OVER·EQUAL 값으로 전달합니다. 판매자가 직접 입력한 글은 AI 요청에 넣지 않습니다.',
          '검증: 숫자 비교 규칙을 단위 테스트로 확인했고, 머지 시점 전체 백엔드 테스트가 통과했습니다.',
        ],
        limits: [
          '숫자는 맞지만 뜻이 틀린 문장이 나왔습니다(예상 판매량 범위를 ‘평균’이라고 쓰거나 품절을 단정). 숫자 비교만으로는 잡지 못합니다.',
          'AI 설명의 뜻이 맞는지 확인하는 평가셋은 아직 만들지 못했습니다.',
          '예측이 맞았는지 확인할 수 있도록 판매 시작 시점 값만 자동 기록해 두었고, 정확도 평가는 아직 하지 못했습니다.',
        ],
        diagram: { src: 'images/flow-grab-llm.png', alt: '수요 분석 AI 설명 흐름' },
      },
    ],
    review: [
      '결제 결과를 모르는 상태와 AI 실패를 오류로 끝내지 않고 처리 흐름에 넣었습니다. 미확정 결제는 배치가 결제사에 다시 조회해 정리하고, AI 설명이 실패해도 수요 분석 숫자는 그대로 보여줍니다.',
      '재고에 반영되지 않던 ‘판매 계획 저장’ 기능을 참고용으로 바꾸고 관련 코드 2,479줄을 정리했습니다. 이미 만든 기능이라도 실제 사용 흐름에서 쓰이지 않으면 줄이는 편이 유지보수에 낫다고 판단했습니다.',
      '다시 한다면 AI 설명의 뜻이 맞는지 확인하는 평가셋을 먼저 만들고, 자동 환불에서 빠진 결제를 확인할 운영자 화면을 함께 만들겠습니다.',
    ],
    reviewSource: '설계 문서·PR 기반 정리',
  },
  {
    slug: 'barohae',
    name: 'BaroHae',
    order: 2,
    logo: 'images/logo-barohae.png',
    accent: '#2F6BFF',
    tagline: '긴급 원격 업무를 빠르게 잇는 매칭 플랫폼',
    period: '2026.08.21 – 2026.09.03 (2주)',
    team: '4인 팀 · 팀장',
    role: '팀장 / 백엔드·UI 총괄 (AI 작업자 추천·업무 초안, 품 잔액·원장 기본 구조, 채팅 서버, 관리자)',
    stack: ['Java 17', 'Spring Boot 4.1', 'Spring AI + Gemini', 'JPA', 'PostgreSQL(Supabase)', 'Flyway', 'WebSocket(STOMP)', 'Thymeleaf'],
    summary: [
      '견적·계약 절차가 긴 외주 대신, 24시간 안에 끝낼 원격 업무를 의뢰인과 작업자에게 연결합니다.',
      '실제 돈 대신 시간 단위 재화 ‘품’(1품=30분)을 쓰고, 업무 등록 시 예약 → 취소 시 반환 → 완료 시 정산 과정에서 잔액이 틀어지지 않게 구현했습니다.',
    ],
    repo: { label: 'github.com/jmin4078/Barohae', url: 'https://github.com/jmin4078/Barohae' },
    scopeNote: 'AI 작업자 추천·업무 초안, 품 잔액·원장의 기본 구조, 채팅 서버, 관리자 모니터링·분쟁 처리는 제가 구현했습니다. WebSocket/STOMP 설정, 완료 정산 확장, 소셜 로그인은 팀원이 담당했습니다.',
    features: [
      {
        lead: '점수 계산·검증처럼 틀리면 안 되는 일은 서버가, 문장 작성은 AI가 맡도록 나눴습니다.',
        items: [
          { title: 'AI 작업자 추천', points: ['기술 일치·경험·평점·기한 준수 등 7개 항목, 100점 만점으로 서버가 순위 계산', 'AI는 상위 10명의 추천 이유 문장만 작성', '리뷰가 적은 작업자는 평점을 보정하고, 이력이 없는 신규 작업자는 기한 준수율 50%로 계산', 'AI 호출이 실패해도 서버 점수와 기본 설명으로 추천 결과 제공'] },
          { title: 'AI 업무 초안', points: ['의뢰인이 상황을 적으면 제목·카테고리·필요 기술·완료 기준 초안 작성', 'AI 응답 형식(JSON 스키마)을 검사하고, 길이·태그 개수는 서버에서 다시 검증', '사용자 입력과 지시문을 분리하고, AI가 사실을 지어내거나 품·마감을 정하지 못하게 규칙 지정'] },
          { title: '품 잔액 · 원장', points: ['1품 = 30분, 사용 가능 잔액과 예약된 잔액을 나눠 저장', '잔액 변경 시 회원 행을 잠그고, 반드시 호출한 쪽 트랜잭션 안에서만 실행', '잔액이 바뀔 때마다 변경 후 잔액을 원장(변동 기록)에 저장'] },
        ],
      },
    ],
    diagrams: [
      { src: 'images/arch-barohae.png', alt: 'BaroHae 시스템 아키텍처', caption: '시스템 아키텍처 · 주황색이 직접 구현한 부분, 회색은 팀원 담당·외부 서비스' },
    ],
    troubleshooting: [
      {
        title: '분쟁을 승인해도 예약된 품이 반환되지 않던 문제',
        problem: [
          '관리자가 분쟁을 승인해도 사용자 화면은 ‘분쟁 중’으로 남고, 업무 등록 때 예약한 품이 반환되지 않았습니다.',
          '원인: 분쟁 처리 메서드가 분쟁 상태만 ‘해결됨’으로 바꾸고, 업무 상태 변경·품 환불·원장·감사 로그 기록은 하지 않았습니다.',
        ],
        method: [
          '분쟁 상태·업무 상태·품 반환을 한 트랜잭션으로 묶고, 상태 변경은 엔티티 메서드를 통해서만 가능하게 제한했습니다.',
          '일부만 저장되고 나머지가 빠지는 일을 막기 위해서입니다. 이미 잘못 저장된 과거 분쟁 데이터도 같은 규칙으로 바로잡았습니다.',
        ],
        implementation: [
          '분쟁과 업무를 잠근 상태로 조회해 동시 처리를 막고, 승인 시 품 환불 + 업무 취소(CANCELLED), 기각 시 업무를 제출 상태(SUBMITTED)로 되돌립니다.',
          '환불 내역(원장)과 감사 로그를 같은 트랜잭션에 저장합니다.',
          '검증: ‘분쟁 중’으로 남아 있던 업무 #22를 취소 처리하고 예약된 30분(1품)이 반환되는 것을 확인했습니다. 승인 시 환불, 기각 시 복귀, 과거 데이터 보정 테스트 3개를 추가했습니다.',
        ],
        limits: [
          '이 수정을 ‘AI 업무 초안·회원 탈퇴’ 작업과 한 커밋에 섞어 올려 팀원이 리뷰하기 어려웠습니다.',
          '작업자가 신고한 분쟁의 정산 처리는 이후 팀원이 추가 구현했습니다.',
        ],
        diagram: { src: 'images/flow-barohae-dispute.png', alt: '분쟁 승인 처리 흐름' },
      },
    ],
    review: [
      '잘한 점: 품 잔액이 틀어지지 않도록 트랜잭션·행 잠금·원장 기록·중복 요청 방지 키를 적용했습니다. AI 기능은 서버 점수 계산, 응답 검증, 실패 시 기본 결과 제공까지 함께 구현했습니다.',
      '아쉬운 점: 한 커밋에 여러 기능을 섞어(최대 66개 파일) 리뷰가 어려웠습니다. 업무 목록 조회의 N+1 쿼리 가능성, 서버 여러 대 환경, AI 응답을 기다리는 동안의 지연은 검증하지 못했습니다. 다음 프로젝트인 GRAB에서는 이슈·PR을 기능 단위로 나눠 진행했습니다.',
      '이후 개선: 프로젝트 후 AI 업무 초안을 평가 문항 29개로 3회씩 측정했습니다. 프롬프트를 고쳐 악의적 지시(프롬프트 인젝션) 차단율을 86.7%에서 100%로 올렸지만, 민감정보가 노출되는 새 문제 1건이 생겼습니다. 꼭 지켜야 하는 규칙은 프롬프트만으로는 보장되지 않아 서버 코드에서 검사해야 합니다.',
    ],
    reviewSource: '2차 프로젝트 회고 (KPT 기반)',
  },
  {
    slug: 'packing',
    name: 'Packing',
    order: 3,
    logo: 'images/logo-packing.png',
    accent: '#7B5CF0',
    tagline: '여행 성향으로 관광지와 일정을 추천하는 서비스',
    period: '2026.06.08 – 2026.06.12 (1주)',
    team: '4인 팀 · 팀장',
    role: '팀장 / 로그인·커뮤니티, AI 일정 생성 API 첫 버전, 공통 UI·초기 DB 설계',
    stack: ['Node.js 20', 'Express 5', 'Google Gemini', 'Supabase(DB·Auth·Storage)', 'Vanilla JS', 'TourAPI 4.0', 'Kakao Maps'],
    summary: [
      '여행지 탐색·선별·일정 구성·공유를 여러 서비스에서 따로 하던 불편을 하나의 흐름으로 묶었습니다.',
      'AI가 없는 장소를 만들지 않도록 실제 TourAPI 관광지 데이터 안에서만 추천·일정을 생성합니다.',
    ],
    repo: { label: 'github.com/jmin4078/Packing', url: 'https://github.com/jmin4078/Packing' },
    scopeNote: '로그인·소셜 로그인, 커뮤니티, AI 일정 생성 API의 첫 버전, 공통 UI·로고, 초기 DB 설계를 맡았습니다. 여행 성향 분석·관광지 추천, TourAPI 데이터 적재는 팀원이 담당했고, 일정 생성 API는 이후 팀원들이 크게 다시 작성했습니다.',
    features: [
      {
        lead: '로그인·커뮤니티를 구현하고, AI 일정 생성 API의 첫 버전을 만들었습니다 (이후 팀원들이 재작성).',
        items: [
          { title: 'AI 일정 생성', points: ['여행 성향(MBTI) 점수 상위 12개 실제 관광지만 AI에 전달', 'Gemini 응답을 JSON으로 받고, 형식이 깨지면 JSON 부분만 다시 추출', '같은 조건은 30분간 결과 재사용, AI 실패 시 기본 일정 제공'] },
          { title: '로그인', points: ['Supabase Auth로 이메일 로그인·가입', 'Google·Kakao OAuth 소셜 로그인', '로그인 후 주소창(URL)에 남은 토큰을 읽고 바로 삭제'] },
          { title: '커뮤니티', points: ['게시글·댓글 작성, 좋아요 누르기·취소', '처리 중에는 좋아요 버튼 재클릭 방지', '이미지를 Supabase Storage에 업로드, 실패 시 대체 이미지 표시'] },
        ],
      },
    ],
    diagrams: [
      { src: 'images/arch-packing.png', alt: 'Packing 시스템 아키텍처', caption: '시스템 아키텍처 · 주황색이 직접 구현한 부분, 회색은 팀원 담당·외부 서비스' },
    ],
    troubleshooting: [],
    review: [
      '잘한 점: 1주 안에 성향 분석 → 관광지 추천 → AI 일정 → 커뮤니티 공유까지 실제로 동작하는 서비스로 연결해 배포했습니다.',
      '아쉬운 점: TourAPI·Supabase·Gemini·Kakao를 함께 쓰면서 DB 구조와 코드가 맞지 않아 좋아요·댓글 수와 일정 저장 오류를 여러 번 고쳤습니다. 강사 리뷰에서는 AI 일정 캐시를 서버 메모리에 두어 서버를 늘리면 공유되지 않는 점, 한 라우트 파일에 기능이 몰린 점을 지적받았습니다.',
      '다음 시도: BaroHae에서는 개발 전에 DB 스키마 문서를 먼저 작성해 테이블 역할과 데이터 흐름을 정리했고, AI 호출이 실패했을 때의 동작도 미리 정했습니다.',
    ],
    reviewSource: '1차 프로젝트 회고 (KPT 기반)',
  },
]
