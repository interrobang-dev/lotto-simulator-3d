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

// 비너스 전면 슬라이드 레일 궤적 좌표 (상단 흡입 파이프 -> 전면 S자 곡선 -> 거치대 안착)
export function getVenusSlidePath(slotIndex: number, t: number): THREE.Vector3 {
  const p0 = new THREE.Vector3(0, 3.5, 0);       // 상단 흡입구
  const p1 = new THREE.Vector3(0, 2.8, 1.5);     // 전면 파이프 이송
  const p2 = new THREE.Vector3(-1.5 + slotIndex * 0.5, -0.5, 2.0); // 전면 레일 회전
  
  // 거치대 슬롯 위치 (슬롯 0~5 메인 6개, 6번 보너스)
  const targetX = -1.8 + slotIndex * 0.55;
  const p3 = new THREE.Vector3(targetX, -1.8, 2.2);

  return getCubicBezierPoint(p0, p1, p2, p3, t);
}
