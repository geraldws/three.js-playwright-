import * as THREE from 'three';

/**
 * Build a spur gear: a toothed outline extruded along Z with a hole in the middle.
 */
export function createGearGeometry({
  teeth = 16,
  outerRadius = 2,
  rootRadius = 1.65,
  holeRadius = 0.5,
  thickness = 0.6,
} = {}) {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  // Each tooth: root -> root -> tip -> tip (trapezoid), repeated around the circle.
  const pts = [
    [0.0, rootRadius],
    [0.3, rootRadius],
    [0.4, outerRadius],
    [0.7, outerRadius],
    [0.8, rootRadius],
  ];
  for (let i = 0; i < teeth; i++) {
    for (const [f, r] of pts) {
      const a = (i + f) * step;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0 && f === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 48,
  });
  geometry.translate(0, 0, -thickness / 2);
  return geometry;
}
