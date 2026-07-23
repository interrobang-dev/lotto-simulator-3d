import * as THREE from 'three';

export function getCubicBezierPoint(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const p = new THREE.Vector3();
  p.addScaledVector(p0, uuu);
  p.addScaledVector(p1, 3 * uu * t);
  p.addScaledVector(p2, 3 * u * tt);
  p.addScaledVector(p3, ttt);
  return p;
}

// 뚜껑 캡 포획(0, 2.9, 0) 후 공중으로 날아올라 전면 거치대에 안착하는 3D 비행 궤적
export function getVenusFlightPath(slotIndex: number, progress: number): THREE.Vector3 {
  // 1단계 (progress < 0.25): 상단 투명 뚜껑 캡 내부 찰칵 고정
  if (progress < 0.25) {
    return new THREE.Vector3(0, 2.85, 0);
  }

  // 2단계 (progress >= 0.25): 뚜껑에서 릴리스되어 전면 거치대로 곡선 비행 (0.25 -> 1.0 매핑)
  const normT = (progress - 0.25) / 0.75;
  const targetX = -1.8 + slotIndex * 0.55;

  const p0 = new THREE.Vector3(0, 2.85, 0);                 // 뚜껑 캡 시작점
  const p1 = new THREE.Vector3(targetX * 0.5, 3.8, 0.8);     // 공중으로 약간 올라가는 최고점
  const p2 = new THREE.Vector3(targetX * 0.85, 0.5, 1.8);    // 전면으로 안착하는 낙하 경로
  const p3 = new THREE.Vector3(targetX, -1.8, 2.2);          // 거치대 슬롯 안착 위치

  return getCubicBezierPoint(p0, p1, p2, p3, normT);
}
