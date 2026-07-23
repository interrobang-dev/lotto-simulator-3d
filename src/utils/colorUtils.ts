import * as THREE from 'three';

export function getLottoColor(num: number): string {
  if (num >= 1 && num <= 10) return '#fbc400'; // 노랑
  if (num >= 11 && num <= 20) return '#69acec'; // 파랑
  if (num >= 21 && num <= 30) return '#ff7272'; // 빨강
  if (num >= 31 && num <= 40) return '#aaaaaa'; // 회색/검정
  if (num >= 41 && num <= 45) return '#b0d840'; // 초록
  return '#ffffff';
}

export function createBallCanvasTexture(number: number, bgColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 배경색 채우기
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 사방에 원형 숫자 뱃지 그리기 (4 위치: 중앙, 사방)
    const positions = [
      { x: 128, y: 128 },
      { x: 384, y: 128 },
      { x: 128, y: 384 },
      { x: 384, y: 384 },
    ];

    positions.forEach((pos) => {
      // 흰색 원형 배경 뱃지
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 75, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#333333';
      ctx.stroke();

      // 숫자 텍스트
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 70px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(number.toString(), pos.x, pos.y);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
