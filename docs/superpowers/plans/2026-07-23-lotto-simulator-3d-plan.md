# 3D 비너스(Venus) 로또 추첨기 구현 계획서 (Implementation Plan v2)

- **작성일**: 2026-07-23 (v2 개편)
- **관련 명세서**: [`docs/superpowers/specs/2026-07-23-lotto-simulator-3d-design.md`](file:///d:/workspace/@private/lotto-simulator-3d/docs/superpowers/specs/2026-07-23-lotto-simulator-3d-design.md)
- **목표**: 비너스(Venus) 추첨기 상단 S자 랙, 8방향 회오리 노즐, 전면 배출 레일 및 방송 자동 시퀀스 구현

---

## 비너스 개편 구현 작업 단계 (Tasks)

### **Task 1: 스플라인 유틸리티 및 Zustand 비너스 상태 머신 개편**
- **목표**: 비너스 5단계 시퀀스 상태 및 전면 슬라이드 베지어 궤적 유틸 구현
- **작업 파일**:
  - `src/utils/bezierUtils.ts`: 3차 베지어 곡선 및 공 회전 각도 계산 함수
  - `src/types/lotto.ts`: `READY_RACK`, `DROPPING`, `MIXING`, `EXTRACTING`, `COMPLETED` 상태 및 모드 정의
  - `src/store/useLottoStore.ts`: 자동 시퀀스 타이머 핸들러 및 거치대 공 위치 매핑 로직

---

### **Task 2: 비너스 3D 컴포넌트 구현 (상단 랙, 회오리 노즐, 전면 슬라이드)**
- **목표**: 비너스 추첨기 외형 하드웨어 3D 메쉬 컴포넌트 구축
- **작업 파일**:
  - `src/components/3d/LoadingRack.tsx`: 상단 S자 대기 랙 3D 모델 및 공 45개 배치
  - `src/components/3d/MixerMachine.tsx`: 8방향 방사형 에어 노즐 메쉬 및 챔버 바닥
  - `src/components/3d/SlideTrack.tsx`: 전면 아크릴 배출 슬라이드 파이프 & 7개 수집 거치대 3D 메쉬

---

### **Task 3: 공(LottoBall) 3단계 상태 전환 및 AirBlower 회오리 개편**
- **목표**: 랙 대기 ➔ 챔버 물리 ➔ 슬라이드 레일 굴러내림 모드 전환 구현
- **작업 파일**:
  - `src/components/3d/LottoBall.tsx`: `RACK_MODE`, `PHYSICS_MODE`, `SLIDE_MODE` 3단 상태별 위치 연산
  - `src/components/3d/AirBlower.tsx`: 8방향 소용돌이 공기 기류 파티클 연출
  - `src/components/3d/ExtractionTube.tsx`: 상단 진공 흡입 이펙트 연출

---

### **Task 4: 방송용 카메라 시퀀스 & 2D HUD 컨트롤 인터페이스 갱신**
- **목표**: 방송 스타일 자동 카메라 추적 뷰 및 비너스 컨트롤 UI 구축
- **작업 파일**:
  - `src/components/3d/CameraRig.tsx`: 공 추적 및 시퀀스별 자동 줌인 연출
  - `src/components/ui/ControlPanel.tsx`: [방송 추첨 시작], [공 재정렬], [방송/자유 카메라] 버튼
  - `src/components/ui/ExtractedBallDeck.tsx`: 3D 거치대 안착과 2D 상단 HUD 덱 동기화

---

### **Task 5: 프로덕션 빌드 검증 및 최종 커밋**
- **목표**: `npm run build` 성공 및 비너스 시뮬레이터 구동 확인
