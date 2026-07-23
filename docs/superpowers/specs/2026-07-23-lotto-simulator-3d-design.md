# 3D 로또 시뮬레이터 설계 명세서 (Design Spec)

- **작성일**: 2026-07-23
- **프로젝트명**: 3D Physics Lotto Simulator (`lotto-simulator-3d`)
- **기술 스택**: Vite, React 18/19, TypeScript, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Rapier3D (`@react-three/rapier`), Zustand, Tailwind CSS, Lucide-react

---

## 1. 개요 (Overview)
본 프로젝트는 웹 브라우저 상에서 실시간 3D 물리 엔진(Rapier3D) 및 비너스 믹서 스타일의 공기 분출 작동 메커니즘을 적용한 **3D 로또 추첨 시뮬레이터** 웹 애플리케이션 구축을 목표로 합니다.

---

## 2. 아키텍처 및 디렉터리 구조

### 2.1 시스템 디렉터리 구조
```text
lotto-simulator-3d/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-07-23-lotto-simulator-3d-design.md
├── public/
│   ├── models/            # 3D Asset/GLTF (선택)
│   └── sounds/            # 공 충돌, 공기 분출, 추출 효과음
├── src/
│   ├── components/
│   │   ├── 3d/            # 3D Scene 및 Physics 컴포넌트
│   │   │   ├── CanvasContainer.tsx   # R3F Canvas & Physics Provider Wrapper
│   │   │   ├── MixerMachine.tsx      # 투명 구형 챔버 & 물리 콜라이더
│   │   │   ├── ExtractionTube.tsx    # 상단 공 추출 튜브 및 Sensor Collider
│   │   │   ├── LottoBall.tsx         # 로또 공 1~45 (Dynamic RigidBody & Number Texture)
│   │   │   ├── AirBlower.tsx         # 공기 분출 물리력 (Impulse/Force Field)
│   │   │   └── CameraRig.tsx         # 뷰포트 프리셋 & 카메라 연출
│   │   └── ui/            # 2D HUD 및 컨트롤러
│   │       ├── ControlPanel.tsx      # 시작/일시정지/리셋, 바람 강도 슬라이더
│   │       ├── ExtractedBallDeck.tsx # 추출된 공 번호 표시 덱 (6+1개)
│   │       └── StatisticsModal.tsx   # 번호별 출현 빈도 통계 모달
│   ├── store/
│   │   └── useLottoStore.ts          # Zustand 글로벌 시뮬레이션 상태 관리
│   ├── types/
│   │   └── lotto.ts                  # 로또 데이터 및 물리 인터페이스 정의
│   ├── utils/
│   │   └── colorUtils.ts             # 번호 구간별 로또 규격 색상 매핑
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

---

## 3. 3D 물리 씬 & 시뮬레이션 메커니즘

### 3.1 투명 믹서 챔버 (Mixer Machine)
- **RigidBody Type**: `fixed` (고정 구조체)
- **물리 콜라이더**: 구형(Sphere) 및 하단 원통형 콜라이더 조합으로 공 탈출 방지.
- **재질 (Material)**: `MeshPhysicalMaterial` 활용 Glassmorphic 효과 구현 (`transmission: 0.95`, `roughness: 0.1`, `ior: 1.5`).

### 3.2 로또 공 45개 (Lotto Balls)
- **RigidBody Type**: `dynamic` (실시간 물리 연산 적용)
- **물리 제원**:
  - 반발 계수 (Restitution): `0.8` (탄성 튀어오름 효과)
  - 마찰력 (Friction): `0.1`
  - 구형 반지름: `0.2m`
- **시각 디자인**:
  - 번호별 색상 매핑 (1~10 노랑, 11~20 파랑, 21~30 빨강, 31~40 검정, 41~45 초록).
  - CanvasTexture 사방 텍스처 맵핑을 적용하여 회전 시에도 번호 조망 가능.

### 3.3 공기 분출 물리력 (Air Blower System)
- `useFrame` 루프 내에서 하단 챔버 영역 내부 공들에게 난수화된 상승 벡터 임펄스(`applyImpulse`) 적용.
- `Vector3(randomX, randomY_Upward, randomZ)` 방식으로 불규칙 상승 소용돌이 구현.
- 하단 바람 파티클 이펙트 연출 포함.

### 3.4 공 추출 센서 & 튜브 (Extraction Sensor)
- 챔버 상단 중앙에 `sensor` 타입 콜라이더 배치.
- `onIntersectionEnter` 이벤트 발생 시 6개 + 보너스 1개 조건 및 타이밍 간격 검증 후 공 수락.
- 추출된 공은 Kinematic 상태로 전환되어 상단 튜브 트랙 궤적을 따라 이송.

---

## 4. UI/UX Overlay & 상태 관리

### 4.1 Zustand 글로벌 상태 스키마 (`useLottoStore`)
- `status`: `'IDLE' | 'MIXING' | 'EXTRACTING' | 'COMPLETED'`
- `extractedBalls`: 추출 완료된 공 데이터 객체 배열
- `bonusBall`: 보너스 공 데이터
- `airPower`: 바람 분출 강도 (1 ~ 10 레벨)
- `cameraView`: `'DEFAULT' | 'TOP' | 'TUBE_ZOOM' | 'FOLLOW_BALL'`
- `history` & `ballFrequencyMap`: 번호별 출현 빈도 통계 데이터 관리

### 4.2 HUD 인터페이스 구성
1. **Extracted Ball Display Deck (상단)**: 당첨 번호 6개 + 보너스 1개 슬롯. 공 추출 시 팝업 사운드 및 스케일 애니메이션 적용.
2. **Control Bar (하단)**: [시작 / 일시정지 / 리셋], 바람 강도 슬라이더, 카메라 프리셋 버튼.
3. **Statistics Modal (우측 상단)**: 누적 추첨 번호별 빈도 차트 모달.

### 4.3 물리 및 성능 예외 처리 (Guardrails)
- **Outer Safety Net**: 챔버 바깥으로 공이 튕겨나가는 경우 경계 콜라이더 감지 후 원점으로 위치 복구.
- **Adaptive DPR**: `@react-three/drei`의 `AdaptiveDpr`을 통해 저사양 환경 프레임 방어 (60fps 유지).
