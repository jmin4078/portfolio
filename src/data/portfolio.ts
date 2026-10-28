// Portfolio content. Every statement here was checked against the project repositories, PRs, and Notion pages.

export type CodeSample = {
  file: string
  code: string
  highlight: number[] // 1-based line numbers
  notes: string[] // ①②③ explanations, in order
  scenario: string
  test: string
}

export type Troubleshooting = {
  title: string
  problem: string[]
  method: string[]
  implementation: string[]
  limits: string[]
  diagram?: { src: string; alt: string }
  code?: CodeSample
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
  features: { lead: string; items: Feature[]; code?: CodeSample }[]
  diagrams?: { src: string; alt: string; caption: string }[]
  troubleshooting: Troubleshooting[]
  review: string[]
  reviewSource: string
}

export const profile = {
  name: '제민기',
  photo: 'images/profile.jpg',
  role: 'Backend · AI Engineer',
  headline: 'AI가 실패해도 서비스는 멈추지 않게, 끝까지 설계하는 엔지니어',
  email: 'jmkk9345@naver.com',
  github: 'https://github.com/jmin4078',
  intro: [
    'AI가 맡을 판단과 서버가 책임질 판단을 나누고, 평가셋으로 개선 효과와 부작용을 함께 측정합니다.',
    '외부 API 응답이 불확실해도 멱등성과 사후 보정으로 데이터 정합성을 지킵니다.',
    '두 차례 팀장을 맡아 모호한 주제를 실행 가능한 작업으로 정리하고 팀을 이끌었습니다.',
  ],
}

export const skills: { group: string; items: string }[] = [
  { group: 'Backend', items: 'Java · Spring Boot · Spring Data JPA · Spring Scheduling' },
  { group: 'Database', items: 'PostgreSQL · pgvector · Redis · Flyway · Supabase' },
  { group: 'AI', items: 'Spring AI · Google Gemini · 임베딩 유사 검색 · RAG · LLM 응답 검증' },
  { group: 'Frontend', items: 'React · TypeScript · TanStack Query · Vanilla JS' },
  { group: 'Test · Tools', items: 'JUnit · Testcontainers · Vitest · Docker · GitHub · Linear' },
]

export const timeline: { period: string; title: string; detail: string }[] = [
  { period: '2026.05 – 2026.11', title: '프로그래머스 데브코스 · 생성형 AI 활용 백엔드', detail: 'Spring Boot 백엔드, Spring AI·RAG 실습, 팀 프로젝트 3회' },
  { period: '2025.01 – 2025.07', title: '타이코에이엠피(주) Digital Factory 인턴', detail: '생산 현황 보드(Daily Accountability Board) 설치 지원, 데이터 누락·호환성 이슈 보고' },
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
    role: '백엔드 주문·결제 도메인, AI 수요 분석·추천 (결제·수요 분석 화면 포함)',
    stack: ['Java 17', 'Spring Boot 4.1', 'Spring AI + Gemini', 'PostgreSQL 18 + pgvector', 'Redis', 'Flyway', 'Testcontainers', 'React 19', 'TypeScript', '토스페이먼츠'],
    summary: [
      '소규모 브랜드가 수요를 모른 채 생산하는 문제를 WISH로 먼저 확인하고 한정 수량을 판매합니다.',
      '주문·결제 정합성에 더해, 판매자의 재고 결정을 돕는 AI 수요 분석과 유사 상품 추천까지 구현했습니다.',
    ],
    repo: { label: 'github.com/jmin4078/GRAB', url: 'https://github.com/jmin4078/GRAB' },
    scopeNote: '주문·결제 도메인과 수요 분석·AI 기능, 그리고 결제·주문·수요 분석 화면은 제가 담당했습니다. 인증, DROP·WISH, 판매자·관리자, 배송, CI/CD·모니터링은 팀원이 담당했습니다.',
    features: [
      {
        lead: '외부 결제 결과가 불확실해도 주문·재고·결제가 어긋나지 않게 만드는 데 집중했습니다.',
        items: [
          { title: '주문 멱등성', points: ['Idempotency-Key + 요청 본문 SHA-256 해시', '같은 요청은 기존 주문 반환, 다른 요청은 409', '동시 요청 충돌 시 새 트랜잭션에서 재조회'] },
          { title: '주문·재고 선점', points: ['옵션 행을 PK 오름차순 FOR UPDATE로 잠가 데드락 방지', '가용 재고 계산과 예약을 한 트랜잭션에서', '결제 마감 10분, 금액은 서버가 계산'] },
          { title: '결제 배치', points: ['PG 호출은 DB 트랜잭션 밖에서 실행', '정리 → 만료 → 취소 재요청 → 보정 환불', 'SKIP LOCKED로 여러 서버의 중복 처리 방지'] },
        ],
        code: {
          file: 'OrderIdempotencyService.java',
          code: `private Optional<Order> checkExisting(Long buyerId,
        IdempotencyKey idempotencyKey, RequestHash requestHash) {
    return orderRepository
            .findByBuyerIdAndIdempotencyKey(buyerId, idempotencyKey.value())  ①
            .map(order -> validateRequestHash(order, requestHash));
}

private Order validateRequestHash(Order order, RequestHash requestHash) {
    if (!order.getRequestHash().equals(requestHash.value())) {
        throw new BusinessException(
                CommonErrorCode.DUPLICATE_IDEMPOTENCY_KEY);  ②
    }
    return order;
}

@Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)  ③
public Order resolveAfterConcurrentInsert(/* ... */) {
    return checkExisting(buyerId, idempotencyKey, requestHash)
            .orElseThrow(/* ... */);
}`,
          highlight: [4, 11, 16],
          notes: [
            '같은 구매자·멱등 키로 이미 만든 주문을 찾아 그대로 돌려줍니다.',
            '키가 같아도 요청 내용(해시)이 다르면 409로 거절합니다.',
            '동시 요청이 유니크 제약에 걸리면 새 트랜잭션에서 먼저 저장된 주문을 다시 조회합니다.',
          ],
          scenario: '결제 버튼을 두 번 눌러도 주문은 1건만 생성됩니다.',
          test: 'OrderIdempotencyServiceTest.createsOnlyOneOrderForConcurrentRequests',
        },
      },
      {
        lead: 'AI는 숫자를 정하지 않고, 서버가 계산한 숫자를 설명하도록 역할을 나눴습니다.',
        items: [
          { title: '수요 분석', points: ['WISH 수 × 내 실적 전환율로 재고 범위 계산', '표본 크기를 반영한 95% 윌슨 구간', '시장 평균은 판매자 5명·DROP 10개 이상일 때만 공개'] },
          { title: 'AI 설명', points: ['계산은 서버, LLM은 수치 설명만 담당', '응답 속 숫자를 입력값과 대조, 다르면 폐기', '판매자별 하루 30회 한도 · 입력 해시 캐시 · 전용 스레드 풀'] },
          { title: '유사 DROP · RAG', points: ['gemini-embedding-001(768차원) + pgvector HNSW 코사인 인덱스', '함께 WISH한 사용자 3명 이상 우선, 없으면 유사도 0.75 이상', '비슷한 종료 DROP 실적으로 재고 추천 근거 설명(RAG)'] },
        ],
      },
    ],
    diagrams: [
      { src: 'images/grab-architecture.png', alt: 'GRAB 시스템 아키텍처', caption: '시스템 아키텍처 · 주황색이 담당 영역 (운영 배포는 설계 문서의 목표 구성 기준)' },
      { src: 'images/grab-erd.png', alt: 'GRAB ERD', caption: 'ERD 주요 테이블 · 주황색이 담당 테이블' },
    ],
    troubleshooting: [
      {
        title: 'PG는 승인했는데 주문은 만료되는 불일치',
        problem: [
          '승인 응답 유실·타임아웃·서버 재시작으로 결제가 PENDING·UNKNOWN에 남는 사이 만료 배치가 주문을 만료시켰습니다.',
          '실제로 승인된 결제가 ‘보정 필요’로 남아 고객 돈이 묶였습니다. 만료 처리는 결제 상태를 보지 않았고, 미확정 결제는 사용자가 다시 결제할 때만 정리됐습니다.',
        ],
        method: [
          '한 주기를 ‘진행 중 결제 정리 → 만료’ 순서로 고정해 마감 전 승인을 먼저 반영하고, 남은 건은 PG 전액 취소로 자동 환불합니다.',
          '고객 돈이 묶인 상태이고 운영자 화면이 아직 없어서 자동 환불을 택했습니다. 만료 방식은 일괄 UPDATE·lazy 만료·Redis 만료 알림을 검토한 뒤 제외했습니다(로직 중복, 재고 미반환, 알림 유실 위험).',
        ],
        implementation: [
          '60초 지난 PENDING·UNKNOWN을 50건씩 SKIP LOCKED로 선점해 PG 조회로 확정합니다(주기당 시간 예산 5초).',
          '보정 환불은 결제당 기록 1개(부분 유일 인덱스)로 보장하고, PG 주문번호가 다르면 환불하지 않습니다.',
          '검증: 3개 인스턴스가 동시에 선점해도 같은 결제를 두 번 고르지 않음. 보정 환불 통합 테스트 9개 추가, 머지 시점 전체 테스트 통과.',
        ],
        limits: [
          '운영자 화면이 없어 주문번호 불일치·PG 거절 건은 수동 확인으로 남습니다.',
          'PG 장애 시 만료가 최대 약 45초 늦어집니다.',
          '생성 후 10분이 지나도 UNKNOWN인 결제는 경고 로그만 남깁니다.',
        ],
        diagram: { src: 'images/flow-grab-payment.png', alt: '결제 배치 한 주기 흐름' },
        code: {
          file: 'PaymentBatchService.run()',
          code: `public void run(OffsetDateTime now) {
    try {
        cleanUpInProgress(now);  ①
    } catch (Exception e) {
        log.error("진행 중 결제 정리 실행 실패", e);  ③
    }
    try {
        expireDue(now);  ②
    } catch (Exception e) {
        log.error("결제 대기 만료 실행 실패", e);
    }
    try {
        retryCancellations(now);
    } catch (Exception e) {
        log.error("결제 취소 재요청 실행 실패", e);
    }
    try {
        refundCompensations(now);
    } catch (Exception e) {
        log.error("보정 환불 실행 실패", e);
    }
}`,
          highlight: [3, 5, 8],
          notes: [
            '결과를 모르는 결제(PENDING·UNKNOWN)를 PG 조회로 먼저 확정합니다.',
            '그다음 마감이 지난 주문을 만료하고 재고를 반환합니다.',
            '단계마다 따로 try로 감싸, 앞 단계가 실패해도 다음 단계는 실행됩니다.',
          ],
          scenario: '정리를 만료보다 늦게 하면, 이미 승인된 결제가 만료 주문에 묶여 고객 돈이 남습니다.',
          test: 'PaymentConcurrencyIntegrationTest.concurrentExpiryBatchesExpireOnce — 3개 스레드가 동시에 만료해도 만료 1건',
        },
      },
      {
        title: 'LLM이 수치를 바꾸거나 잘못 해석하는 위험',
        problem: [
          '수요 분석 설명을 LLM에 맡기면 예상 수량·전환율 같은 숫자를 바꿔 쓰거나, 부족·초과 방향을 뒤집어 쓸 위험이 있습니다.',
          '판매자가 재고 수량을 정할 때 참고하는 값이라 숫자 오류가 그대로 판단에 영향을 줍니다.',
        ],
        method: [
          '숫자는 서버의 결정적 계산으로만 만들고, LLM에는 계산 결과와 코드값만 보내 설명만 맡깁니다.',
          'LLM 출력은 검증할 수 있어야 하고, LLM이 실패해도 수요 분석 자체는 동작해야 하기 때문입니다. 실패해도 HTTP 200으로 GENERATED·DISCARDED·FAILED·DISABLED 상태를 구분합니다.',
        ],
        implementation: [
          '응답 속 숫자를 모두 추출해 입력값과 대조하고, 하나라도 다르면 DISCARDED로 버리며 원문은 저장하지 않습니다.',
          '비율은 정수 %, 차이는 부호 대신 SHORT·OVER·EQUAL 코드로 전달합니다. 판매자 입력 텍스트는 프롬프트에서 제외합니다.',
          '검증: DemandExplanationValidatorTest로 숫자 대조 규칙을 테스트했고, 머지 시점 전체 백엔드 테스트가 통과했습니다.',
        ],
        limits: [
          '실제 생성 결과에서 숫자는 맞지만 해석이 어긋나는 문장이 나왔습니다(판매량 범위를 ‘평균’으로 표현, 품절 단정). 수치 검증만으로는 부족합니다.',
          'LLM 설명 품질 평가셋은 아직 진행하지 않았습니다.',
          '예측 정확도는 판매 시작 시점 자동 기록으로 사후 평가할 수 있게만 준비했습니다.',
        ],
        diagram: { src: 'images/flow-grab-llm.png', alt: '수요 분석 AI 설명 흐름' },
        code: {
          file: 'DemandExplanationValidator.java',
          code: `public static Optional<DemandExplanation> validate(
        String response, String input, ObjectMapper objectMapper) {
    // ... JSON 파싱·형식 검사
    Set<BigDecimal> allowed = allowedNumbers(objectMapper.readTree(input));  ①
    boolean numbersMatch = explanation.get().texts().stream()
            .flatMap(text -> numbers(text).stream())
            .allMatch(allowed::contains);  ②
    return numbersMatch ? explanation : Optional.empty();  ③
}

static List<BigDecimal> numbers(String text) {
    List<BigDecimal> numbers = new ArrayList<>();
    Matcher matcher = NUMBER.matcher(text);
    while (matcher.find()) {
        numbers.add(normalize(
                new BigDecimal(matcher.group().replace(",", ""))));
    }
    return numbers;
}`,
          highlight: [4, 7, 8],
          notes: [
            'LLM에 보낸 입력 JSON의 숫자(절댓값 포함)를 허용 목록으로 만듭니다.',
            '설명 문장 속 숫자를 모두 뽑아 허용 목록과 대조합니다.',
            '하나라도 없으면 설명 전체를 버립니다(DISCARDED).',
          ],
          scenario: 'LLM이 추천 수량 20개를 25개로 바꿔 쓰면 판매자에게 보여 주지 않습니다.',
          test: 'DemandExplanationValidatorTest.validate_discardsInvalidResponse',
        },
      },
    ],
    review: [
      '외부 PG와 LLM처럼 결과를 장담할 수 없는 시스템을 다루며, ‘결과를 모르는 상태’와 ‘AI 실패’를 예외가 아닌 정상 상태로 설계했습니다.',
      '재고에 아무 효과가 없던 ‘판매 계획 저장’ 기능을 참고용으로 전환하며 2,479줄을 정리했습니다. 만든 기능도 사용 흐름에 맞지 않으면 걷어내는 판단을 배웠습니다.',
      '다시 한다면 LLM 설명의 해석 오류를 잡는 평가셋을 먼저 만들고, 운영자 화면을 갖춰 자동 환불에서 빠진 결제를 추적할 수 있게 하겠습니다.',
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
    role: '팀장 / 백엔드·UI 총괄 (AI 작업자 추천·업무 초안, 품 원장 기반, 채팅 서버, 관리자)',
    stack: ['Java 17', 'Spring Boot 4.1', 'Spring AI + Gemini', 'JPA', 'PostgreSQL(Supabase)', 'Flyway', 'WebSocket(STOMP)', 'Thymeleaf'],
    summary: [
      '견적·계약 절차가 긴 외주 대신, 24시간 안에 끝낼 원격 업무를 의뢰인과 작업자에게 연결합니다.',
      '실제 돈 대신 시간 재화 ‘품’(1품=30분)으로 예약·반환·정산의 정합성을 구현했습니다.',
    ],
    repo: { label: 'github.com/jmin4078/Barohae', url: 'https://github.com/jmin4078/Barohae' },
    scopeNote: 'AI 작업자 추천·업무 초안, 품 원장의 기본 구조, 채팅 서버, 관리자 모니터링은 제가 구현했습니다. WebSocket/STOMP 설정, 완료 정산 확장, 소셜 로그인은 팀원이 담당했습니다.',
    features: [
      {
        lead: 'AI가 맡을 판단과 서버가 책임질 판단을 나누는 데 집중했습니다.',
        items: [
          { title: 'AI 작업자 추천', points: ['서버가 7개 항목 100점으로 순위 계산', 'AI는 상위 10명의 추천 이유만 생성', 'AI 실패 시 서버 점수·기본 설명 반환'] },
          { title: 'AI 업무 초안', points: ['상황 설명 → 제목·카테고리·기술·완료 기준', '스키마 검증 + 서버에서 길이·태그 재검증', '입력 격리, 날조·품·마감 결정 금지 규칙'] },
          { title: '품 원장', points: ['1품=30분, 가용·예약 잔액 분리 저장', '행 잠금 + 호출자 트랜잭션 강제', '변동마다 처리 후 잔액을 원장에 기록'] },
        ],
        code: {
          file: 'WorkerRecommendationService.java',
          code: `double score = skillMatch.ratio() * 35.0  ①
        + Math.min(categoryCompletedCount, 5) / 5.0 * 20.0
        + adjustedRating / 5.0 * 15.0
        + deadlineRate * 10.0
        + responseScore(responseSeconds, responseSamples)
        + workloadScore(activeTaskCount)
        + Math.min(member.getCompletedTaskCount(), 10) / 10.0 * 5.0;

// ... analyzeWithAi(): 상위 10명만 AI에 보냄
try {
    AiWorkerRecommendationReport report =
            aiClient.analyze(evidence(task, candidatesForAi));
    // ... 허용된 후보 키만 받고 중복 제거
} catch (RuntimeException exception) {  ②
    log.warn("AI worker recommendation explanation failed: {}",
            exception.getClass().getSimpleName());
    return Map.of();  ③
}`,
          highlight: [1, 14, 17],
          notes: [
            '순위 점수는 서버가 7개 항목으로 계산합니다(기술 35·경험 20·평점 15·기한 10·응답 10·작업량 5·완료 5).',
            'AI 호출 예외를 잡고',
            '빈 설명을 돌려줍니다. 추천 순위는 서버 점수 그대로 표시됩니다.',
          ],
          scenario: 'Gemini가 장애여도 의뢰인은 추천 순위를 그대로 받습니다.',
          test: 'WorkerRecommendationServiceTest.fallsBackToDeterministicExplanationWhenAiFails',
        },
      },
    ],
    troubleshooting: [
      {
        title: '분쟁을 승인해도 예약된 품이 반환되지 않던 문제',
        problem: [
          '관리자가 분쟁을 승인해도 사용자 화면은 ‘분쟁 중’으로 남고, 업무 등록 때 예약한 품이 반환되지 않았습니다.',
          'resolveDispute()가 분쟁만 RESOLVED로 바꾸고 업무 상태·환불·원장·감사 로그는 처리하지 않아 분쟁과 업무 상태가 어긋났습니다.',
        ],
        method: [
          '분쟁·업무 상태·품 반환을 하나의 트랜잭션으로 묶고, 상태 전이는 도메인 메서드로만 허용했습니다.',
          '일부만 반영되는 불일치를 구조적으로 막기 위해서입니다. 이미 잘못 저장된 과거 데이터도 같은 규칙으로 보정했습니다.',
        ],
        implementation: [
          '분쟁·업무를 비관적 잠금으로 조회하고, 승인 시 품 환불·업무 CANCELLED, 기각 시 SUBMITTED로 복귀합니다.',
          '원장(TASK_REFUND)과 감사 로그를 같은 트랜잭션에 저장합니다.',
          '검증: 업무 #22 DISPUTED → CANCELLED, 예약 30분 반환(가용 120분·예약 0분). 승인 환불·기각 복귀·과거 데이터 보정 테스트 3개.',
        ],
        limits: [
          '이 수정이 ‘AI 업무 초안·회원 탈퇴’ 커밋에 함께 섞여 리뷰가 어려웠습니다(회고: 한 커밋에 여러 기능 혼재).',
          '작업자가 신고한 분쟁의 정산 분기는 이후 팀원이 추가 구현했습니다.',
        ],
        diagram: { src: 'images/flow-barohae-dispute.png', alt: '분쟁 승인 처리 흐름' },
        code: {
          file: 'AdminService.resolveDispute() — 수정 커밋 aa13f32 시점',
          code: `@Transactional
public void resolveDispute(Long adminId, Long disputeId, boolean accepted, String note) {
    // ... 관리자·사유 검증
    Dispute dispute = requireDisputeForUpdate(disputeId);  ①
    Task task = taskRepository.findByIdForUpdate(dispute.getTaskId())
            .orElseThrow(/* ... */);
    if ("RESOLVED".equals(dispute.getStatus()) || "REJECTED".equals(dispute.getStatus())) {
        reconcileLegacyDisputeResolution(adminId, dispute, task, normalizedNote);  ②
        return;
    }
    Instant resolvedAt = Instant.now();
    if (accepted) {
        timeLedgerService.refundTaskReservation(  ③
                task.getRequesterId(), task.getId(), /* 사유 */);
    }
    task.resolveDispute(accepted, resolvedAt);
    dispute.resolve(accepted, normalizedNote, resolvedAt);
    audit(adminId, accepted ? "DISPUTE_RESOLVED" : "DISPUTE_REJECTED", /* ... */);
}`,
          highlight: [4, 8, 13],
          notes: [
            '분쟁과 업무를 비관적 잠금으로 함께 조회합니다.',
            '이미 RESOLVED로 잘못 저장된 과거 데이터는 보정 경로로 처리합니다.',
            '승인 시 예약 품을 환불하고, 업무·분쟁 상태와 감사 로그까지 한 트랜잭션에 저장합니다.',
          ],
          scenario: "승인 후에도 '분쟁 중'으로 남던 업무 #22를 CANCELLED로 복구하고 예약 30분을 반환했습니다.",
          test: 'AdminServiceTest — 승인 환불 · 기각 복귀 · 과거 데이터 보정 3개',
        },
      },
    ],
    review: [
      '트랜잭션·행 잠금·원장·멱등성 키로 품의 정합성을 지켰고, AI를 연결만 하지 않고 서버 점수 계산·결과 검증·실패 대체까지 설계했습니다.',
      '한 커밋에 여러 기능이 섞여(최대 66개 파일) 리뷰가 어려웠고, 업무 목록 N+1 가능성, 다중 서버 환경, AI 동기 호출 지연은 검증하지 못했습니다. GRAB에서는 이슈·PR을 기능 단위로 나눴습니다.',
      '프로젝트 이후 AI 업무 초안을 평가셋 29개 × 3회로 측정했습니다. 프롬프트 개선으로 인젝션 방어를 86.7% → 100%로 올렸지만 민감정보 노출 회귀 1건을 발견해, 반드시 지킬 규칙은 코드에서 막아야 한다는 결론을 얻었습니다.',
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
    role: '팀장 / 로그인·커뮤니티·일정 생성 (AI 일정 생성 API 초기 구현)',
    stack: ['Node.js 20', 'Express 5', 'Google Gemini', 'Supabase(DB·Auth·Storage)', 'Vanilla JS', 'TourAPI 4.0', 'Kakao Maps'],
    summary: [
      '여행지 탐색·선별·일정 구성·공유를 여러 서비스에서 따로 하던 불편을 하나의 흐름으로 묶었습니다.',
      'AI가 없는 장소를 만들지 않도록 실제 TourAPI 관광지 데이터 안에서만 추천·일정을 생성합니다.',
    ],
    repo: { label: 'github.com/jmin4078/Packing', url: 'https://github.com/jmin4078/Packing' },
    scopeNote: '로그인·소셜 로그인, 커뮤니티, AI 일정 생성 API의 초기 버전, 공통 UI·로고, 초기 DB 설계를 맡았습니다. 추천 알고리즘·TourAPI 적재는 팀원이 담당했고, 일정 생성 API는 이후 팀원들이 크게 다시 작성했습니다.',
    features: [
      {
        lead: '팀장으로 로그인·커뮤니티와 AI 일정 생성 API의 초기 버전을 만들었습니다.',
        items: [
          { title: 'AI 일정 생성', points: ['MBTI 점수 상위 12개 실제 관광지로 프롬프트 구성', 'Gemini JSON 응답, 실패 시 범위 재파싱', '같은 조건 30분 캐시, 실패 시 대체 일정'] },
          { title: '로그인', points: ['Supabase Auth로 이메일 로그인·가입', 'Google·Kakao OAuth 소셜 로그인', '콜백 토큰 추출 후 URL에서 제거'] },
          { title: '커뮤니티', points: ['게시글·댓글 작성, 좋아요 토글', '좋아요 중복 클릭 방지', '이미지 Storage 업로드, 실패 시 대체'] },
        ],
      },
    ],
    troubleshooting: [],
    review: [
      '프론트·백엔드·DB·외부 API를 하나의 흐름으로 연결해, 성향 분석부터 추천·AI 일정·커뮤니티까지 실제 서비스처럼 구성했습니다.',
      'TourAPI·Supabase·Gemini·Kakao를 함께 쓰며 DB 구조와 코드가 어긋나 좋아요·댓글 수와 일정 저장 오류를 반복 디버깅했습니다. 강사 리뷰에서 AI 일정 캐시를 서버 메모리에 둔 점(무상태성)과 라우트 파일 책임 과밀을 지적받았습니다.',
      '개발 전에 테이블 역할과 API 데이터 흐름을 먼저 정리하자는 다짐을, BaroHae에서 DB 스키마 문서 작성과 AI 실패 대응 설계로 이어갔습니다.',
    ],
    reviewSource: '1차 프로젝트 회고 (KPT 기반)',
  },
]
