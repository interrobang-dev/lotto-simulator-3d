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

// 뚜껑 캡 포획(0, 2.85, 0) 후 부르르 미세 떨림 ➔ 곡선 비행 궤적
export function getVenusFlightPath(slotIndex: number, progress: number): THREE.Vector3 {
  // 1단계 (progress < 0.25): 뚜껑 캡 내부 찰칵 고정 및 고주파 공기압 미세 떨림 (Jitter Shake)
  if (progress < 0.25) {
    const shakeTime = progress * 150;
    const shakeX = Math.sin(shakeTime * 1.7) * 0.025;
    const shakeY = Math.cos(shakeTime * 2.3) * 0.025;
    const shakeZ = Math.sin(shakeTime * 1.9) * 0.025;

    return new THREE.Vector3(shakeX, 3.10 + shakeY, shakeZ);
  }

  // 2단계 (progress >= 0.25): 뚜껑에서 릴리스되어 전면 거치대로 곡선 비행
  const normT = (progress - 0.25) / 0.75;
  const targetX = (slotIndex - 3) * 0.55;

  const p0 = new THREE.Vector3(0, 3.10, 0);                 // 뚜껑 캡 시작점 (구체 표면 밀착 안착)
  const p1 = new THREE.Vector3(targetX * 0.5, 4.1, 1.2);     // 최고점
  const p2 = new THREE.Vector3(targetX * 0.85, 0.5, 2.8);    // 낙하 경로
  const p3 = new THREE.Vector3(targetX, -2.1, 3.4);          // 거치대 슬롯 안착

  return getCubicBezierPoint(p0, p1, p2, p3, normT);
}
