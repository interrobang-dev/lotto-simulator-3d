# 3D 비너스(Venus) 로또 추첨기 정밀 설계 명세서 (Design Spec v2)

- **작성일**: 2026-07-23 (v2 개편)
- **프로젝트명**: 3D Physics Venus Lotto Machine (`lotto-simulator-3d`)
- **기술 스택**: Vite, React 18+, TypeScript, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Rapier3D (`@react-three/rapier`), Zustand, Tailwind CSS, Lucide-react

---

## 1. 개요 (Overview)
본 명세서는 한국 동행복권에서 실제로 사용하는 프랑스 AKANIS/Smartplay 사의 **'비너스(Venus)' 추첨기**의 외형 구조, 45개 공 대기 랙, 하단 8방향 회오리 제트 노즐, 상단 진공 흡입 파이프, 전면 곡선 아크릴 배출 슬라이드 레일 및 방송용 자동 시퀀스를 100% 동일하게 3D로 구현하는 정밀 개편 명세서입니다.

---

## 2. 비너스(Venus) 하드웨어 아키텍처

```text
lotto-simulator-3d/
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-07-23-lotto-simulator-3d-design.md
│       └── plans/
│           └── 2026-07-23-lotto-simulator-3d-plan.md
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CanvasContainer.tsx   # R3F Canvas & Physics Provider
│   │   │   ├── VenusMachine.tsx      # 비너스 메인 3D 아크릴 프레임 하우징
│   │   │   ├── LoadingRack.tsx       # [비너스] 상단 S자 45개 공 대기 랙 & 게이트
│   │   │   ├── MixerMachine.tsx      # [비너스] 투명 구형 챔버 & 8방향 회오리 제트 노즐
│   │   │   ├── SlideTrack.tsx        # [비너스] 전면 아크릴 배출 슬라이드 레일 & 7개 거치대
│   │   │   ├── LottoBall.tsx         # [비너스] RACK_MODE -> PHYSICS_MODE -> SLIDE_MODE 3단 변환
│   │   │   ├── AirBlower.tsx         # [비너스] 8방향 회오리(Vortex) 공기 기류 파티클
│   │   │   ├── ExtractionTube.tsx    # [비너스] 상단 진공 흡입 파이프 이펙트
│   │   │   └── CameraRig.tsx         # [비너스] 방송 스타일 자동 공 추적/줌인 카메라
│   │   └── ui/
│   │       ├── ControlPanel.tsx      # [비너스] 방송 추첨 시작, 랙 리셋, 방송/자유 카메라 스위치
│   │       ├── ExtractedBallDeck.tsx # [비너스] 2D 상단 HUD 덱 & 거치대 3D 연동
│   │       └── StatisticsModal.tsx   # 누적 추첨 번호 통계 모달
│   ├── store/
│   │   └── useLottoStore.ts          # 비너스 시퀀스 상태 머신 스토어
│   └── utils/
│       ├── colorUtils.ts             # 로또 번호 규격 색상 및 텍스처 생성기
│       └── bezierUtils.ts            # [신규] 슬라이드 레일 베지어 곡선 좌표 계산기
```

---

## 3. 비너스(Venus) 동작 5단계 시퀀스 (Sequence State Machine)

1. **`READY_RACK` (대기 랙 정렬)**:
   - 1~45번 공이 상단 S자 아크릴 대기 랙(`LoadingRack`)에 번호순으로 차곡차곡 배치되어 정렬 대기.
2. **`DROPPING` (투입 낙하 - 1.5초)**:
   - 추첨 시작 시 상단 랙 하단 게이트가 열리고, 45개 공이 곡선을 따라 챔버 내부로 우르르 떨어져 투입.
3. **`MIXING` (8방향 회오리 교반 - 3.0초)**:
   - 하단 8방향 제트 노즐에서 분출되는 공기압으로 공들이 불규칙하게 회오리치며 챔버 내부에서 강하게 혼합.
4. **`EXTRACTING` (순차 흡입 및 슬라이드 배출)**:
   - 4.5초 간격으로 상단 파이프에서 진공 흡입 이펙트 발동.
   - 포획된 공은 Kinematic 상태로 전환되어 전면 곡선 슬라이드 레일(`SlideTrack`)을 따라 데굴데굴 굴러 내려와 1~6번 및 보너스 거치대에 정밀 안착.
5. **`COMPLETED` (추첨 완료)**:
   - 6+1개 공 배출 완료 후 방송 결과 자막 및 통계 기록 저장.

---

## 4. 카메라 연출 & 스플라인 이송 궤적

- **공 이송 스플라인 (`bezierUtils.ts`)**:
  - 상단 흡입 튜브 `(0, 3.2, 0)` ➔ 전면 아크릴 레일 `(0, 2.5, 1.2)` ➔ 전면 슬라이드 회전 궤적 ➔ 거치대 목표 슬롯 `(x, -1.8, 2.2)` 좌표를 3차 베지어 곡선으로 계산하여 매끄러운 자전/굴러내림 연출.
- **방송 카메라 (`CameraRig.tsx`)**:
  - `READY_RACK`: 상단 랙 줌인 뷰
  - `MIXING`: 전체 추첨기 전면 뷰
  - `EXTRACTING`: 흡입 줌인 ➔ 슬라이드 굴러내려오는 공 추적 뷰 ➔ 안착 줌인.
