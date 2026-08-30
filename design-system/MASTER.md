# Minimum Permission Lab Design System

## 목적

초등 5~6학년이 “기능에 정말 필요한 권한만 고르기”라는 학습 목표를 첫 시선에 이해하고, 한 단계씩 안전하게 판단하도록 돕는 라이트 모드 UI 규칙입니다. 장식보다 짧은 문장, 다음 행동, 선택 상태를 우선합니다.

## 시각 원칙

- **차분한 실험실:** 흰 카드, 부드러운 회색 배경, 청색 행동색을 사용합니다.
- **한 번에 한 행동:** 현재 단계에서 가장 중요한 다음 버튼만 `gi-pulse`로 강조합니다.
- **색상만으로 설명하지 않기:** 선택·완료·필수 상태는 텍스트, 테두리, `aria-pressed` 또는 native 상태를 함께 사용합니다.
- **가상 모델을 분명히 하기:** 헤더 요약과 상세 안전 안내에서 실제 권한을 요청하지 않음을 명시합니다.

## 토큰

기존 `src/styles/tokens.css`의 토큰을 단일 기준으로 사용합니다.

- 본문 `--color-text`, 보조 문장 `--color-text-muted`
- 기본 표면 `--color-surface`, 보조 표면 `--color-surface-soft`, 강조 표면 `--color-surface-accent`
- 행동 `--color-primary`, hover/focus 대비 `--color-primary-dark`, focus `--color-focus-ring`
- 간격 `--space-1`~`--space-6`, 반경 `--radius-sm`~`--radius-lg`, 그림자 `--shadow-card`·`--shadow-dialog`
- 버튼·입력·라디오·체크박스·summary 최소 크기 `--min-target-size: 44px`

새로운 색상·외부 폰트·CDN은 추가하지 않습니다.

## 타이포그래피와 문장

- 시스템 sans-serif만 사용합니다.
- 제목은 `line-height: 1.25`, 본문은 약 1rem과 `line-height: 1.6`을 유지합니다.
- 학생 문장은 짧은 존댓말로 쓰고, 한 문단에 한 가지 행동이나 이유만 담습니다.
- 전문어가 필요하면 바로 뒤에 쉬운 설명을 붙입니다. “왜 그렇게 골랐나요?”처럼 행동을 직접 묻습니다.

## 컴포넌트 규칙

### Header and progress

`AppHeader`는 서비스명, `현재 단계: n/7`, `완료한 사례: n/4`, 가상 모델 요약을 제공합니다. 단계 제목은 `StageFocusManager`가 포커스하고 viewport 안으로 이동시킵니다.

### Learning overview and case cards

시작 화면은 목표와 다음 행동을 먼저 보여 주고 사례 카드를 바로 이어 배치합니다. 데스크톱은 2열, 640px 이하에서는 1열입니다. 카드에는 제목, 한 줄 기능, 선택/완료 상태 텍스트가 있습니다. 완료 사례는 disabled이지만 이유를 텍스트로 설명합니다.

### Primary action

`PrimaryActionButton`은 화면당 하나만 `gi-pulse`를 받습니다. 본체 위치는 움직이지 않고 aura의 opacity/box-shadow만 애니메이션합니다. `prefers-reduced-motion: reduce`에서는 고정 focus-colored outline과 단계 번호로 대체합니다.

### Requirement hint

disabled CTA에는 visible `<p role="note">`와 `aria-describedby`를 함께 둡니다. 안내 문장은 남은 선택 수와 다음 행동을 포함하며, “적절히 처리” 같은 추상 표현을 사용하지 않습니다.

### Safety details

안전·교사용 안내와 저장 설명은 native `<details>`로 접을 수 있습니다. summary는 44px 이상이며, 열린 상태에서는 모든 설명이 DOM과 키보드 순서에 포함됩니다.

### Report actions

보고서 마지막에는 인쇄와 다시 시작의 목적을 각각 설명합니다. 점수·실제 앱 안전 판정·인간 승인 표현은 추가하지 않습니다.

## 반응형 기준

- 320×568, 375×812, 768px, 1280px를 확인합니다.
- `document.documentElement.scrollWidth <= document.documentElement.clientWidth`를 만족해야 합니다.
- 카드·버튼·입력·summary는 44px 터치 목표를 유지합니다.
- 모바일에서 긴 표는 이미 제공 중인 세로 비교 카드로 전환하고, 핵심 CTA가 긴 설명 아래에 가려지지 않게 합니다.

## 포커스·모션·프라이버시

- 모든 단계 제목은 `tabIndex={-1}`과 `data-stage-heading`을 유지합니다.
- `:focus-visible`은 3px solid ring과 3px offset입니다.
- `prefers-reduced-motion`에서는 애니메이션·transition을 끄고 정적 강조만 제공합니다.
- 실제 권한 API와 외부 네트워크를 호출하지 않습니다.
- 저장 전 localStorage는 비어 있고, opt-in 뒤에는 기존 전용 키만 사용합니다. 별명과 실제 개인정보는 state/storage/report에 넣지 않습니다.

## 변경 기록

2026-08-30: 헤더 정보 위계, 첫 행동 문장, 보조·위험 버튼 구분, 눌림 피드백, `gi-pulse` reduced-motion 대체를 다듬고 상호작용 규칙을 `src/styles/interactive.css`로 분리했습니다.

2026-08-29: 시작 화면의 첫 행동 위계, 단계 제목 포커스 스크롤, 영향·철회 CTA 조건 안내, 사례 카드 상태 표현, 보고서 다음 행동 문구를 정리했습니다.
