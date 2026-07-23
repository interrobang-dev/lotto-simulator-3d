# 3D 로또 시뮬레이터 구현 계획서 (Implementation Plan)

- **작성일**: 2026-07-23
- **관련 명세서**: [`docs/superpowers/specs/2026-07-23-lotto-simulator-3d-design.md`](file:///d:/workspace/@private/lotto-simulator-3d/docs/superpowers/specs/2026-07-23-lotto-simulator-3d-design.md)
- **목표**: Vite + React + Three.js + Rapier3D 기반의 로또 추첨 시뮬레이터 단계별 구축

---

## 작업 단계별 상세 내용 (Tasks)

### **Task 1: 프로젝트 스캐폴딩 및 의존성 라이브러리 설치**
- **목표**: Vite 기반 React-TS 프로젝트 환경 구성 및 3D/물리 엔진 패키지 설치
- **작업 내용**:
  1. Vite React TypeScript 템플릿 프로젝트 구성
  2. `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` 설치
  3. `zustand`, `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge` 등 설치
  4. Tailwind CSS 설정 (`tailwind.config.js`, `src/index.css`)
- **검증**: `npm run dev` 실행 시 3D Canvas 렌더링 정상 동작 확인

---

### **Task 2: 데이터 타입, 유틸리티 및 Zustand 스토어 구현**
- **목표**: 시뮬레이션 상태 동기화를 위한 글로벌 스토어 구축
- **작업 파일**:
  - `src/types/lotto.ts`: 공 데이터, 시뮬레이션 상태 Enum, 카메라이 뷰 타입
  - `src/utils/colorUtils.ts`: 1~45번 로또 규격 색상 (노랑/파랑/빨강/검정/초록) 및 번호별 텍스처 생성 유틸리티
  - `src/store/useLottoStore.ts`: `status`, `extractedBalls`, `airPower`, `cameraView`, `history`, `ballFrequencyMap` 스토어
- **검증**: 스토어 상태 변경 함수 단위 테스트 및 렌더링 바인딩 확인

---

### **Task 3: 3D Canvas 뷰포트 & 투명 믹서 챔버 구축**
- **목표**: 3D Canvas 환경 구성, 조명, 카메라이 제어 및 투명 아크릴 챔버 메쉬 생성
- **작업 파일**:
  - `src/components/3d/CanvasContainer.tsx`: R3F Canvas & Rapier Physics Provider 설정
  - `src/components/3d/CameraRig.tsx`: 프리셋 시점(정면, 상단, 추출구, 자유 탐색 OrbitControls) 전환
  - `src/components/3d/MixerMachine.tsx`: Glassmorphic 재질(`MeshPhysicalMaterial`) 적용 투명 챔버 및 고정(fixed) 물리 콜라이더
- **검증**: 브라우저 3D 화면에 투명 반짝이는 아크릴 챔버 구조물 렌더링 확인

---

### **Task 4: 로또 공 45개 & 공기 분출(Air Blower) 물리 엔진 구현**
- **목표**: 45개의 실시간 탄성 물리 공 배치 및 공기 분출 상승 임펄스 구현
- **작업 파일**:
  - `src/components/3d/LottoBall.tsx`: 45개 Dynamic RigidBody 공 (반발계수 0.8, 번호 텍스처 사방 각인)
  - `src/components/3d/AirBlower.tsx`: `useFrame` 루프 기반 하단 공들에게 무작위 상승 Vector Force(`applyImpulse`) 적용 로직 및 바람 파티클 이펙트
- **검증**: 시뮬레이션 시작 시 공 45개가 챔버 내부에서 공기 기류를 받아 불규칙하게 통통 튀어오르는 모습 확인

---

### **Task 5: 상단 추출 튜브 센서 & 공 이송 메커니즘 구현**
- **목표**: 상단 센서 영역에 도달한 공 감지 및 당첨 덱 이송 애니메이션 처리
- **작업 파일**:
  - `src/components/3d/ExtractionTube.tsx`: Sensor Collider 배치 및 `onIntersectionEnter` 감지
  - 공 추출 시 Kinematic 변환 후 이송 궤적 애니메이션 처리 및 사운드 트리거
- **검증**: 공기 분출 중 3초 간격으로 공이 1개씩 수집되어 총 6개+보너스1개가 차례로 추출되는지 확인

---

### **Task 6: 2D HUD 컨트롤 패널 & 통계 모달 UI 구현**
- **목표**: 사용자 조작 패널 및 당첨 덱, 통계 분석 UI 구축
- **작업 파일**:
  - `src/components/ui/ExtractedBallDeck.tsx`: 상단 6+1 당첨 공 표시 덱 (팝업 애니메이션)
  - `src/components/ui/ControlPanel.tsx`: 시작/일시정지/리셋 버튼, 바람 강도 슬라이더, 카메라 전환 버튼
  - `src/components/ui/StatisticsModal.tsx`: 번호별 출현 빈도 프로그래스 바 차트 시각화
- **검증**: UI 상에서 버튼 조작 시 3D 물리 씬 및 시뮬레이션 상태가 원활히 제어되는지 확인

---

### **Task 7: 물리 통합 최적화 & 세이프티 가드레일 설치**
- **목표**: 공 탈출 방지 이중 콜라이더 및 60fps 프레임 유지 최적화
- **작업 내용**:
  - 외곽 Safety Net 경계 박스 설치 (탈출 공 자동 중앙 복구)
  - Drei `AdaptiveDpr` 적용으로 FPS 저하 방지
- **검증**: 장시간 연속 시뮬레이션 시 튕김 및 탈출 버그 없이 안정적 작동 검증
