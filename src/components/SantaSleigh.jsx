import { useEffect, useRef } from "react";
import * as THREE from "three";
import santaHeadUrl from "../assets/textures/santa-head.png";
import elfHeadUrl from "../assets/textures/elf-head.png";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createSparkleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255, 252, 225, 1)");
  grad.addColorStop(0.35, "rgba(255, 215, 110, 0.9)");
  grad.addColorStop(0.7, "rgba(255, 175, 60, 0.25)");
  grad.addColorStop(1, "rgba(255, 175, 60, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildSleigh(materials) {
  const sleigh = new THREE.Group();

  // Curved sleigh side wall shape (in XY plane, facing +X = forward)
  const sideShape = new THREE.Shape();
  sideShape.moveTo(-1.85, 0.0);
  sideShape.lineTo(1.55, 0.0);
  sideShape.bezierCurveTo(2.05, 0.05, 2.2, 0.55, 1.95, 1.05);
  sideShape.bezierCurveTo(1.75, 1.38, 1.25, 1.25, 1.05, 0.92);
  sideShape.bezierCurveTo(0.85, 0.58, 0.15, 0.52, -0.55, 0.62);
  sideShape.bezierCurveTo(-1.15, 0.72, -1.55, 1.25, -1.95, 1.28);
  sideShape.bezierCurveTo(-2.22, 1.3, -2.28, 0.92, -2.02, 0.65);
  sideShape.bezierCurveTo(-1.85, 0.48, -1.95, 0.12, -1.85, 0.0);

  const sideGeo = new THREE.ExtrudeGeometry(sideShape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 4
  });

  const leftSide = new THREE.Mesh(sideGeo, materials.sleighRed);
  leftSide.position.z = 0.86;
  sleigh.add(leftSide);

  const rightSide = new THREE.Mesh(sideGeo, materials.sleighRed);
  rightSide.position.z = -0.97;
  sleigh.add(rightSide);

  // Golden trim rail along top of both sides
  const trimCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.02, 0.72, 0),
    new THREE.Vector3(-2.06, 1.18, 0),
    new THREE.Vector3(-1.62, 1.14, 0),
    new THREE.Vector3(-0.9, 0.72, 0),
    new THREE.Vector3(0.1, 0.6, 0),
    new THREE.Vector3(0.95, 0.82, 0),
    new THREE.Vector3(1.52, 1.24, 0),
    new THREE.Vector3(2.02, 1.02, 0)
  ]);
  const trimGeo = new THREE.TubeGeometry(trimCurve, 44, 0.055, 10, false);

  const leftTrim = new THREE.Mesh(trimGeo, materials.gold);
  leftTrim.position.z = 0.95;
  sleigh.add(leftTrim);

  const rightTrim = new THREE.Mesh(trimGeo, materials.gold);
  rightTrim.position.z = -0.95;
  sleigh.add(rightTrim);

  // Sleigh floor, front curved nose & backrest
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(3.35, 0.16, 1.86),
    materials.sleighDarkRed
  );
  floor.position.set(-0.12, 0.08, 0);
  sleigh.add(floor);

  const frontWall = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.18, 1.9, 16),
    materials.sleighRed
  );
  frontWall.rotation.x = Math.PI / 2;
  frontWall.position.set(1.65, 0.52, 0);
  sleigh.add(frontWall);

  const frontPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.82, 1.84),
    materials.sleighRed
  );
  frontPanel.position.set(1.62, 0.56, 0);
  frontPanel.rotation.z = -0.28;
  sleigh.add(frontPanel);

  // Golden front handlebar / dashboard rail
  const frontBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 2.02, 16),
    materials.gold
  );
  frontBar.rotation.x = Math.PI / 2;
  frontBar.position.set(1.74, 1.06, 0);
  sleigh.add(frontBar);

  // Back wall behind gift sack
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.98, 1.84),
    materials.sleighRed
  );
  backPanel.position.set(-1.78, 0.62, 0);
  backPanel.rotation.z = 0.24;
  sleigh.add(backPanel);

  const backBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 2.0, 14),
    materials.gold
  );
  backBar.rotation.x = Math.PI / 2;
  backBar.position.set(-1.92, 1.12, 0);
  sleigh.add(backBar);

  // Front cushioned bench (driver + passenger)
  const frontSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.26, 1.74),
    materials.leather
  );
  frontSeat.position.set(0.32, 0.34, 0);
  sleigh.add(frontSeat);

  const frontBackrest = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.62, 1.74),
    materials.leather
  );
  frontBackrest.position.set(-0.2, 0.65, 0);
  frontBackrest.rotation.z = 0.16;
  sleigh.add(frontBackrest);

  // Back cargo bench for the gift sack
  const backBench = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.22, 1.72),
    materials.leatherDark
  );
  backBench.position.set(-1.05, 0.3, 0);
  sleigh.add(backBench);

  // Gleaming golden sleigh runners (skis) with curled front scrolls
  const runnerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.15, -0.52, 0),
    new THREE.Vector3(-0.8, -0.55, 0),
    new THREE.Vector3(0.85, -0.55, 0),
    new THREE.Vector3(2.05, -0.45, 0),
    new THREE.Vector3(2.58, -0.05, 0),
    new THREE.Vector3(2.68, 0.45, 0),
    new THREE.Vector3(2.38, 0.64, 0),
    new THREE.Vector3(2.14, 0.46, 0),
    new THREE.Vector3(2.26, 0.25, 0)
  ]);
  const runnerGeo = new THREE.TubeGeometry(runnerCurve, 56, 0.068, 12, false);

  [-0.9, 0.9].forEach((zPos) => {
    const runner = new THREE.Mesh(runnerGeo, materials.gold);
    runner.position.z = zPos;
    sleigh.add(runner);

    [-1.35, -0.15, 1.15].forEach((xPos) => {
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.048, 0.62, 10),
        materials.gold
      );
      strut.position.set(xPos, -0.24, zPos);
      strut.rotation.z = xPos > 0 ? -0.18 : 0.12;
      sleigh.add(strut);
    });
  });

  // Glowing golden holiday lantern on the front nose
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(2.12, 0.85, 0);

  const lanternCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.16, 8),
    materials.gold
  );
  lanternCap.position.y = 0.17;
  lanternGroup.add(lanternCap);

  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.09, 0.22, 10),
    materials.lanternGlow
  );
  lanternGroup.add(lanternGlass);

  const lanternBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.11, 0.07, 8),
    materials.gold
  );
  lanternBase.position.y = -0.13;
  lanternGroup.add(lanternBase);

  const lanternLight = new THREE.PointLight(0xffbe5c, 2.4, 7.0, 1.5);
  lanternLight.position.set(0.18, 0.06, 0);
  lanternGroup.add(lanternLight);

  sleigh.add(lanternGroup);

  return { sleigh, lanternLight };
}

function buildSanta(materials, headTexture) {
  const santa = new THREE.Group();

  // Red velvet Santa torso
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.48, 0.86, 24),
    materials.santaRed
  );
  torso.position.y = 0.43;
  santa.add(torso);

  // White fur vertical trim strip
  const furStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.84, 0.16),
    materials.furWhite
  );
  furStrip.position.set(0.36, 0.43, 0);
  santa.add(furStrip);

  // White fur hem & fluffy collar
  const furHem = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.075, 12, 28),
    materials.furWhite
  );
  furHem.rotation.x = Math.PI / 2;
  furHem.position.y = 0.04;
  santa.add(furHem);

  const furCollar = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.09, 12, 24),
    materials.furWhite
  );
  furCollar.rotation.x = Math.PI / 2;
  furCollar.position.y = 0.86;
  santa.add(furCollar);

  // Black leather belt & gleaming gold buckle
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.45, 0.14, 24),
    materials.beltBlack
  );
  belt.position.y = 0.27;
  santa.add(belt);

  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.18, 0.2),
    materials.gold
  );
  buckle.position.set(0.435, 0.27, 0);
  santa.add(buckle);

  const buckleInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.1, 0.11),
    materials.beltBlack
  );
  buckleInner.position.set(0.438, 0.27, 0);
  santa.add(buckleInner);

  // Real-life photographic head cutout (undistorted, crisp, facing viewer) + 3D Santa hat!
  const headGroup = new THREE.Group();
  headGroup.position.set(0.04, 1.35, 0);
  headGroup.rotation.y = 0.42; // Faces directly toward camera with zero warping

  const faceMat = new THREE.MeshBasicMaterial({
    map: headTexture,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), faceMat);
  headGroup.add(facePlane);

  // 3D Santa Hat sitting snugly on top of his real head!
  const hatGroup = new THREE.Group();
  hatGroup.position.set(0.01, 0.26, 0.03);
  hatGroup.rotation.z = 0.06;

  const hatBrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.08, 14, 28),
    materials.furWhite
  );
  hatBrim.rotation.x = Math.PI / 2;
  hatBrim.scale.set(1.08, 0.65, 1);
  hatGroup.add(hatBrim);

  const hatTailPivot = new THREE.Group();
  const hatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.03, 0),
    new THREE.Vector3(-0.06, 0.27, -0.02),
    new THREE.Vector3(-0.26, 0.42, -0.06),
    new THREE.Vector3(-0.5, 0.32, -0.1),
    new THREE.Vector3(-0.62, 0.14, -0.12)
  ]);

  const hatSteps = 12;
  for (let i = 0; i < hatSteps; i += 1) {
    const t0 = i / hatSteps;
    const t1 = (i + 1) / hatSteps;
    const p0 = hatCurve.getPoint(t0);
    const p1 = hatCurve.getPoint(t1);
    const r0 = 0.3 * (1 - t0 * 0.84);
    const r1 = 0.3 * (1 - t1 * 0.84);
    const segLen = p0.distanceTo(p1);
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(r1, r0, segLen * 1.15, 16),
      materials.santaRed
    );
    seg.position.copy(p0).lerp(p1, 0.5);
    seg.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      p1.clone().sub(p0).normalize()
    );
    hatTailPivot.add(seg);
  }

  const pomPom = new THREE.Mesh(
    new THREE.SphereGeometry(0.115, 18, 16),
    materials.furWhite
  );
  pomPom.position.set(-0.65, 0.1, -0.13);
  hatTailPivot.add(pomPom);

  hatGroup.add(hatTailPivot);
  headGroup.add(hatGroup);
  santa.add(headGroup);

  // Animated 3D Arms & Mittens steering the golden reins
  const armsGroup = new THREE.Group();
  [-0.38, 0.38].forEach((zSide) => {
    const armGroup = new THREE.Group();
    armGroup.position.set(0.08, 0.7, zSide);

    const sleeve = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.11, 0.5, 8, 14),
      materials.santaRed
    );
    sleeve.rotation.z = -Math.PI / 2.25;
    sleeve.rotation.y = zSide > 0 ? 0.24 : -0.24;
    sleeve.position.set(0.3, -0.06, zSide > 0 ? -0.08 : 0.08);
    armGroup.add(sleeve);

    const cuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.045, 10, 18),
      materials.furWhite
    );
    cuff.rotation.y = Math.PI / 2;
    cuff.position.set(0.56, -0.1, zSide > 0 ? -0.14 : 0.14);
    armGroup.add(cuff);

    const mitten = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 14),
      materials.santaRedDark
    );
    mitten.scale.set(1.18, 0.95, 0.92);
    mitten.position.set(0.68, -0.11, zSide > 0 ? -0.16 : 0.16);
    armGroup.add(mitten);

    armsGroup.add(armGroup);
  });
  santa.add(armsGroup);

  // 3D Golden Reins from Santa's mittens to front sleigh bar
  [-0.22, 0.22].forEach((zRein) => {
    const reinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.76, 0.59, zRein),
      new THREE.Vector3(1.12, 0.65, zRein * 1.15),
      new THREE.Vector3(1.38, 0.54, zRein * 1.25),
      new THREE.Vector3(1.52, 0.32, zRein * 1.35)
    ]);
    const rein = new THREE.Mesh(
      new THREE.TubeGeometry(reinCurve, 20, 0.022, 8, false),
      materials.gold
    );
    santa.add(rein);
  });

  return { santa, headGroup, hatTailPivot, armsGroup };
}

function buildElf(materials, headTexture) {
  const elf = new THREE.Group();

  // Petite emerald-green elf tunic
  const tunic = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.33, 0.66, 20),
    materials.elfGreen
  );
  tunic.position.y = 0.34;
  elf.add(tunic);

  // Scalloped white collar
  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.06, 10, 20),
    materials.furWhite
  );
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.y = 0.66;
  elf.add(collarRing);

  // Shiny gold buttons
  [0.5, 0.36].forEach((yBtn) => {
    const btn = new THREE.Mesh(
      new THREE.SphereGeometry(0.034, 12, 10),
      materials.gold
    );
    btn.position.set(0.255, yBtn, 0);
    elf.add(btn);
  });

  // Elf belt & gold buckle
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.295, 0.305, 0.09, 20),
    materials.beltBlack
  );
  belt.position.y = 0.2;
  elf.add(belt);

  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.125, 0.135),
    materials.gold
  );
  buckle.position.set(0.3, 0.2, 0);
  elf.add(buckle);

  // Seated legs (red leggings + green elf boots)
  [-0.11, 0.11].forEach((zLeg) => {
    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.062, 0.28, 6, 12),
      materials.santaRed
    );
    leg.rotation.z = Math.PI / 2.2;
    leg.position.set(0.25, 0.08, zLeg);
    elf.add(leg);

    const boot = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 12, 10),
      materials.elfGreen
    );
    boot.scale.set(1.38, 0.85, 0.85);
    boot.position.set(0.43, 0.06, zLeg);
    elf.add(boot);
  });

  // Real-life photographic head cutout (woman from Photo 2) + 3D elf ears & 3D elf hat!
  const headGroup = new THREE.Group();
  headGroup.position.set(0.04, 1.06, 0);
  headGroup.rotation.y = 0.44; // Faces directly toward camera with zero warping

  const faceMat = new THREE.MeshBasicMaterial({
    map: headTexture,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.88), faceMat);
  headGroup.add(facePlane);

  // Cute 3D pointed elf ears peeking out on both sides of her real blonde hair
  [-0.36, 0.36].forEach((xEar) => {
    const ear = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 12),
      materials.elfSkin
    );
    ear.position.set(xEar, 0.03, -0.02);
    ear.rotation.z = xEar > 0 ? -Math.PI / 2.3 : Math.PI / 2.3;
    headGroup.add(ear);
  });

  // 3D Pointed Green & Red Elf Hat with animated golden jingle bell sitting on top of her head
  const hatGroup = new THREE.Group();
  hatGroup.position.set(0.0, 0.33, 0.02);
  hatGroup.rotation.z = 0.08;

  const hatCuff = new THREE.Mesh(
    new THREE.TorusGeometry(0.27, 0.06, 12, 24),
    materials.santaRed
  );
  hatCuff.rotation.x = Math.PI / 2;
  hatCuff.scale.set(1.06, 0.65, 1);
  hatGroup.add(hatCuff);

  const hatTailPivot = new THREE.Group();
  const elfHatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.02, 0),
    new THREE.Vector3(-0.05, 0.24, -0.02),
    new THREE.Vector3(-0.22, 0.4, -0.04),
    new THREE.Vector3(-0.42, 0.34, -0.06)
  ]);

  const elfHatSteps = 10;
  for (let i = 0; i < elfHatSteps; i += 1) {
    const t0 = i / elfHatSteps;
    const t1 = (i + 1) / elfHatSteps;
    const p0 = elfHatCurve.getPoint(t0);
    const p1 = elfHatCurve.getPoint(t1);
    const r0 = 0.25 * (1 - t0 * 0.88);
    const r1 = 0.25 * (1 - t1 * 0.88);
    const segLen = p0.distanceTo(p1);
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(r1, r0, segLen * 1.15, 14),
      materials.elfGreen
    );
    seg.position.copy(p0).lerp(p1, 0.5);
    seg.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      p1.clone().sub(p0).normalize()
    );
    hatTailPivot.add(seg);
  }

  const bell = new THREE.Mesh(
    new THREE.SphereGeometry(0.062, 14, 12),
    materials.gold
  );
  bell.position.set(-0.45, 0.31, -0.06);
  hatTailPivot.add(bell);

  hatGroup.add(hatTailPivot);
  headGroup.add(hatGroup);
  elf.add(headGroup);

  // Inner resting arm
  const innerArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.062, 0.3, 6, 12),
    materials.elfGreen
  );
  innerArm.position.set(0.14, 0.42, -0.25);
  innerArm.rotation.z = -0.65;
  elf.add(innerArm);

  // Cheerful waving outer arm — clearly angled OUT to the side (never blocking her face!)
  const waveArmPivot = new THREE.Group();
  waveArmPivot.position.set(0.04, 0.54, 0.28);

  const waveSleeve = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.06, 0.32, 6, 12),
    materials.elfGreen
  );
  waveSleeve.position.set(-0.06, 0.12, 0.18);
  waveSleeve.rotation.x = 0.92;
  waveSleeve.rotation.z = 0.18;
  waveArmPivot.add(waveSleeve);

  const waveCuff = new THREE.Mesh(
    new THREE.TorusGeometry(0.064, 0.024, 8, 14),
    materials.furWhite
  );
  waveCuff.position.set(-0.09, 0.22, 0.33);
  waveCuff.rotation.x = Math.PI / 4;
  waveArmPivot.add(waveCuff);

  const waveHand = new THREE.Mesh(
    new THREE.SphereGeometry(0.066, 12, 10),
    materials.elfSkin
  );
  waveHand.position.set(-0.1, 0.27, 0.4);
  waveArmPivot.add(waveHand);

  elf.add(waveArmPivot);

  return { elf, headGroup, hatTailPivot, waveArmPivot };
}

function createGiftBox(size, boxMat, ribbonMat) {
  const gift = new THREE.Group();
  const [w, h, d] = size;

  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxMat);
  gift.add(box);

  const ribbon1 = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.025, h + 0.025, Math.min(w, d) * 0.22),
    ribbonMat
  );
  gift.add(ribbon1);

  const ribbon2 = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(w, d) * 0.22, h + 0.025, d + 0.025),
    ribbonMat
  );
  gift.add(ribbon2);

  [-0.07, 0.07].forEach((offset) => {
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.024, 8, 14),
      ribbonMat
    );
    loop.position.set(offset, h / 2 + 0.05, 0);
    loop.rotation.z = offset > 0 ? -0.45 : 0.45;
    gift.add(loop);
  });

  return gift;
}

function buildGiftSack(materials) {
  const sackGroup = new THREE.Group();

  const sackBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.66, 28, 22),
    materials.sackCrimson
  );
  sackBody.scale.set(1.02, 0.92, 1.12);
  sackBody.position.set(0, 0.56, 0);
  sackGroup.add(sackBody);

  const sackRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.105, 12, 24),
    materials.sackCrimson
  );
  sackRim.rotation.x = Math.PI / 2;
  sackRim.position.set(0, 1.05, 0);
  sackGroup.add(sackRim);

  const rope = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.04, 10, 24),
    materials.gold
  );
  rope.rotation.x = Math.PI / 2;
  rope.position.set(0, 0.97, 0);
  sackGroup.add(rope);

  const gift1 = createGiftBox(
    [0.42, 0.42, 0.42],
    materials.giftTeal,
    materials.gold
  );
  gift1.position.set(-0.18, 1.22, 0.22);
  gift1.rotation.set(0.18, 0.42, 0.22);
  sackGroup.add(gift1);

  const gift2 = createGiftBox(
    [0.44, 0.5, 0.4],
    materials.giftOrange,
    materials.furWhite
  );
  gift2.position.set(0.16, 1.34, -0.08);
  gift2.rotation.set(-0.14, -0.35, -0.18);
  sackGroup.add(gift2);

  const gift3 = createGiftBox(
    [0.36, 0.34, 0.36],
    materials.elfGreen,
    materials.gold
  );
  gift3.position.set(-0.26, 1.16, -0.26);
  gift3.rotation.set(-0.22, 0.65, 0.15);
  sackGroup.add(gift3);

  const gift4 = createGiftBox(
    [0.33, 0.33, 0.33],
    materials.santaRed,
    materials.gold
  );
  gift4.position.set(0.24, 1.1, 0.3);
  gift4.rotation.set(0.25, -0.2, -0.24);
  sackGroup.add(gift4);

  return sackGroup;
}

const SantaSleigh = ({ logoRef, heroTextRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch {
      return undefined;
    }

    if (!renderer.getContext()) {
      renderer.dispose();
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.cursor = "grab";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 376 / 251, 0.1, 60);
    camera.position.set(0.15, 1.5, 7.55);
    camera.lookAt(0, 0.52, 0);

    // Warm festive studio lighting
    const hemiLight = new THREE.HemisphereLight(0xdceeff, 0x3f2024, 1.3);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    keyLight.position.set(4.5, 6.8, 6.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8ec8ff, 1.4);
    rimLight.position.set(-5.5, 4.0, -4.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffe4cc, 0.8);
    fillLight.position.set(-2.0, -1.2, 5.2);
    scene.add(fillLight);

    // Load real-life cutout head textures
    const loader = new THREE.TextureLoader();
    const santaHeadTex = loader.load(santaHeadUrl);
    santaHeadTex.colorSpace = THREE.SRGBColorSpace;
    santaHeadTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const elfHeadTex = loader.load(elfHeadUrl);
    elfHeadTex.colorSpace = THREE.SRGBColorSpace;
    elfHeadTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Shared PBR materials
    const materials = {
      sleighRed: new THREE.MeshStandardMaterial({
        color: 0xc41e24,
        roughness: 0.26,
        metalness: 0.18
      }),
      sleighDarkRed: new THREE.MeshStandardMaterial({
        color: 0x7f1318,
        roughness: 0.42,
        metalness: 0.1
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf6c343,
        roughness: 0.22,
        metalness: 0.84
      }),
      leather: new THREE.MeshStandardMaterial({
        color: 0x6b3a24,
        roughness: 0.65,
        metalness: 0.05
      }),
      leatherDark: new THREE.MeshStandardMaterial({
        color: 0x4c2818,
        roughness: 0.72,
        metalness: 0.04
      }),
      santaRed: new THREE.MeshStandardMaterial({
        color: 0xd6242a,
        roughness: 0.66,
        metalness: 0.04
      }),
      santaRedDark: new THREE.MeshStandardMaterial({
        color: 0x99161b,
        roughness: 0.58,
        metalness: 0.06
      }),
      furWhite: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.86,
        metalness: 0.02
      }),
      beltBlack: new THREE.MeshStandardMaterial({
        color: 0x1d1d22,
        roughness: 0.35,
        metalness: 0.25
      }),
      elfSkin: new THREE.MeshStandardMaterial({
        color: 0xe2b69a,
        roughness: 0.56,
        metalness: 0.02
      }),
      elfGreen: new THREE.MeshStandardMaterial({
        color: 0x17803d,
        roughness: 0.6,
        metalness: 0.05
      }),
      sackCrimson: new THREE.MeshStandardMaterial({
        color: 0xa63329,
        roughness: 0.78,
        metalness: 0.04
      }),
      giftTeal: new THREE.MeshStandardMaterial({
        color: 0x2f7973,
        roughness: 0.38,
        metalness: 0.12
      }),
      giftOrange: new THREE.MeshStandardMaterial({
        color: 0xf3781d,
        roughness: 0.38,
        metalness: 0.12
      }),
      lanternGlow: new THREE.MeshStandardMaterial({
        color: 0xffe49e,
        emissive: 0xffa826,
        emissiveIntensity: 1.8,
        roughness: 0.2
      })
    };

    // Assemble complete 3D sleigh rig
    const rig = new THREE.Group();
    scene.add(rig);

    const { sleigh, lanternLight } = buildSleigh(materials);
    rig.add(sleigh);

    const santaRig = buildSanta(materials, santaHeadTex);
    santaRig.santa.position.set(0.52, 0.44, -0.38);
    rig.add(santaRig.santa);

    const elfRig = buildElf(materials, elfHeadTex);
    elfRig.elf.position.set(-0.02, 0.48, 0.46);
    elfRig.elf.scale.setScalar(0.82);
    rig.add(elfRig.elf);

    const giftSack = buildGiftSack(materials);
    giftSack.position.set(-1.16, 0.36, -0.02);
    rig.add(giftSack);

    // 3D Magical Golden Sparkle Trail behind the sleigh
    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleMeta = [];

    const resetParticle = (i, randomPhase = false) => {
      const life = randomPhase ? Math.random() : 0;
      particleMeta[i] = {
        life,
        speed: 0.45 + Math.random() * 0.55,
        yDrift: (Math.random() - 0.5) * 0.35,
        zSpread: (Math.random() - 0.5) * 1.7,
        yStart: -0.55 + Math.random() * 0.6
      };
      particlePositions[i * 3] = -1.9 - life * 3.1;
      particlePositions[i * 3 + 1] =
        particleMeta[i].yStart + life * particleMeta[i].yDrift;
      particlePositions[i * 3 + 2] = particleMeta[i].zSpread;
    };

    for (let i = 0; i < particleCount; i += 1) {
      resetParticle(i, true);
    }

    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const sparkleTex = createSparkleTexture();
    const sparkleMat = new THREE.PointsMaterial({
      size: 0.25,
      map: sparkleTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    rig.add(sparkles);

    // Dynamic base pose (angled upward-right like racheta.svg)
    const baseRotY = -0.44;
    const baseRotZ = 0.13;
    const baseRotX = 0.08;
    const basePosY = -0.14;

    const updateSize = () => {
      const width = container.clientWidth || 380;
      const height = container.clientHeight || 270;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    updateSize();

    let resizeObserver = null;
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", updateSize);
    }

    // Parallax on scroll + pointer tilt + interactive 3D drag
    const scrollState = { targetY: 0, targetX: 0, targetRotY: 0, targetRotZ: 0 };
    const pointer = { x: 0, y: 0 };
    const drag = {
      active: false,
      moved: false,
      lastX: 0,
      lastY: 0,
      rotY: 0,
      rotX: 0
    };

    const handleScroll = () => {
      const sy = window.scrollY || 0;
      scrollState.targetY = clamp(sy * 0.0022, -0.35, 1.05);
      scrollState.targetX = clamp(sy * 0.0018, -0.25, 0.95);
      scrollState.targetRotY = clamp(sy * 0.0011, -0.25, 0.55);
      scrollState.targetRotZ = clamp(sy * 0.0005, -0.1, 0.22);
    };

    const handleMouseMove = (event) => {
      if (drag.active) {
        const dx = event.clientX - drag.lastX;
        const dy = event.clientY - drag.lastY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          drag.moved = true;
        }
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.rotY = clamp(drag.rotY + dx * 0.01, -Math.PI, Math.PI);
        drag.rotX = clamp(drag.rotX + dy * 0.008, -0.65, 0.65);
        return;
      }
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      pointer.x = (event.clientX / vw - 0.5) * 2;
      pointer.y = (event.clientY / vh - 0.5) * 2;
    };

    const handlePointerDown = (event) => {
      drag.active = true;
      drag.moved = false;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      canvas.style.cursor = "grabbing";
    };

    const handlePointerUp = () => {
      if (!drag.active) return;
      drag.active = false;
      canvas.style.cursor = "grab";
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // Desktop-only sweep flight from behind top-left logo + hero text wake reveal
    const isDesktop = window.innerWidth >= 1024;
    const useDesktopSweep = isDesktop && !prefersReducedMotion;
    const heroTextEl = heroTextRef?.current || null;
    const logoEl = logoRef?.current || null;

    let sweepPlan = null;
    let sweepFinished = !useDesktopSweep;

    if (useDesktopSweep) {
      const endRect = container.getBoundingClientRect();
      const logoRect = logoEl ? logoEl.getBoundingClientRect() : null;
      const textRect = heroTextEl ? heroTextEl.getBoundingClientRect() : null;

      const endCenterX = endRect.left + endRect.width / 2;
      const endCenterY = endRect.top + endRect.height / 2;

      const startX = logoRect ? logoRect.left + 48 : 110;
      const startY = logoRect ? logoRect.top + 18 : 34;

      const startDx = startX - endCenterX;
      const startDy = startY - endCenterY;

      const ctrlX = textRect
        ? textRect.left + textRect.width * 0.45
        : endCenterX - 300;
      const ctrlY = textRect
        ? textRect.top + textRect.height * 0.62
        : endCenterY + 25;

      sweepPlan = {
        duration: 2.45,
        endCenterX,
        startDx,
        startDy,
        ctrlDx: ctrlX - endCenterX,
        ctrlDy: ctrlY - endCenterY,
        textLeft: textRect ? textRect.left : 0,
        textWidth: textRect ? Math.max(textRect.width, 1) : 1
      };

      container.style.transform = `translate3d(${startDx.toFixed(
        1
      )}px, ${startDy.toFixed(1)}px, 0) scale(0.28)`;
      container.style.opacity = "0";

      if (heroTextEl) {
        const hiddenMask = "linear-gradient(90deg, #000 -24%, transparent 0%)";
        heroTextEl.style.maskImage = hiddenMask;
        heroTextEl.style.webkitMaskImage = hiddenMask;
      }
    }

    const cur = {
      x: 0,
      y: basePosY,
      rotY: baseRotY,
      rotX: baseRotX,
      rotZ: baseRotZ
    };
    const tmpParentQuat = new THREE.Quaternion();
    const startTime = performance.now();
    let prevTime = startTime;
    let rafId = null;

    const billboardHeadToCamera = (headGroup, tiltZ = 0) => {
      if (!headGroup.parent) return;
      headGroup.parent.getWorldQuaternion(tmpParentQuat);
      headGroup.quaternion
        .copy(tmpParentQuat)
        .invert()
        .multiply(camera.quaternion);
      if (tiltZ !== 0) {
        headGroup.rotateZ(tiltZ);
      }
    };

    const renderFrame = (now) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      const elapsed = (now - startTime) / 1000;

      // 1) Entrance animation: Desktop sweeps from behind logo & reveals hero text; Mobile/Tablet keeps 3D fly-in
      let introX = 0;
      let introY = 0;
      let introZ = 0;
      let introRotZ = 0;
      let introRotY = 0;
      let introScale = 1;

      if (useDesktopSweep && sweepPlan && !sweepFinished) {
        const p = clamp(elapsed / sweepPlan.duration, 0, 1);
        const t = 1 - Math.pow(1 - p, 2.6);
        const inv = 1 - t;

        const curDx =
          inv * inv * sweepPlan.startDx + 2 * inv * t * sweepPlan.ctrlDx;
        const curDy =
          inv * inv * sweepPlan.startDy + 2 * inv * t * sweepPlan.ctrlDy;
        const curScale = 0.28 + 0.72 * t;
        const curOpacity = clamp(p / 0.14, 0, 1);

        container.style.transform = `translate3d(${curDx.toFixed(
          1
        )}px, ${curDy.toFixed(1)}px, 0) scale(${curScale.toFixed(3)})`;
        container.style.opacity = curOpacity.toFixed(3);

        // Bank sleigh gently as it dives across the headline, then level up into hero pose
        introRotZ = -0.22 * Math.sin(p * Math.PI);
        introRotY = -0.28 * (1 - t);

        // Reveal hero text smoothly in the wake of the sleigh
        if (heroTextEl) {
          const sleighScreenX = sweepPlan.endCenterX + curDx;
          const pct = clamp(
            ((sleighScreenX - sweepPlan.textLeft) / sweepPlan.textWidth) * 100 -
              4,
            -24,
            118
          );
          const mask = `linear-gradient(90deg, #000 ${pct.toFixed(
            1
          )}%, transparent ${(pct + 18).toFixed(1)}%)`;
          heroTextEl.style.maskImage = mask;
          heroTextEl.style.webkitMaskImage = mask;
        }

        if (p >= 1) {
          sweepFinished = true;
          container.style.transform = "";
          container.style.opacity = "";
          if (heroTextEl) {
            heroTextEl.style.maskImage = "";
            heroTextEl.style.webkitMaskImage = "";
          }
        }
      } else if (!useDesktopSweep && !prefersReducedMotion && elapsed < 1.75) {
        const p = clamp(elapsed / 1.75, 0, 1);
        const easeOut = 1 - Math.pow(1 - p, 3);
        const rem = 1 - easeOut;
        introX = -5.4 * rem;
        introY = -1.55 * rem + Math.sin(p * Math.PI) * 0.35;
        introZ = -3.6 * rem;
        introRotZ = -0.26 * rem;
        introRotY = -0.5 * rem;
        introScale = 0.65 + 0.35 * easeOut;
      }

      if (!drag.active) {
        drag.rotY *= 0.94;
        drag.rotX *= 0.94;
      }

      // 2) Continuous 3D flight hover + scroll parallax + pointer depth
      const bobY = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.9) * 0.14;
      const bobRotZ = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.5) * 0.045;

      const targetX = prefersReducedMotion
        ? 0
        : scrollState.targetX + pointer.x * 0.18;
      const targetY =
        basePosY +
        (prefersReducedMotion ? 0 : scrollState.targetY - pointer.y * 0.12);
      const targetRotY =
        baseRotY +
        (prefersReducedMotion ? 0 : scrollState.targetRotY + pointer.x * 0.24) +
        drag.rotY;
      const targetRotX =
        baseRotX +
        (prefersReducedMotion ? 0 : pointer.y * 0.14) +
        drag.rotX;
      const targetRotZ =
        baseRotZ + (prefersReducedMotion ? 0 : scrollState.targetRotZ);

      const lerp = 0.08;
      cur.x += (targetX - cur.x) * lerp;
      cur.y += (targetY - cur.y) * lerp;
      cur.rotY += (targetRotY - cur.rotY) * lerp;
      cur.rotX += (targetRotX - cur.rotX) * lerp;
      cur.rotZ += (targetRotZ - cur.rotZ) * lerp;

      rig.position.set(cur.x + introX, cur.y + bobY + introY, introZ);
      rig.rotation.set(
        cur.rotX,
        cur.rotY + introRotY,
        cur.rotZ + bobRotZ + introRotZ
      );
      rig.scale.setScalar(introScale);
      rig.updateMatrixWorld(true);

      // 3) Always billboard both real faces toward the viewer (even while rotating/dragging 3D sleigh)
      const santaTilt = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 2.2) * 0.075;
      const elfTilt = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 2.7 + 0.4) * 0.09;
      billboardHeadToCamera(santaRig.headGroup, santaTilt);
      billboardHeadToCamera(elfRig.headGroup, elfTilt);

      // Lively sleigh & character animations
      if (!prefersReducedMotion) {
        santaRig.hatTailPivot.rotation.z = Math.sin(elapsed * 3.2 - 0.5) * 0.1;
        santaRig.armsGroup.position.y = Math.sin(elapsed * 2.4) * 0.035;

        elfRig.hatTailPivot.rotation.z = Math.sin(elapsed * 3.8 - 0.3) * 0.12;
        elfRig.waveArmPivot.rotation.x = Math.sin(elapsed * 5.6) * 0.34;
        elfRig.waveArmPivot.rotation.z = Math.cos(elapsed * 5.6) * 0.14;

        giftSack.rotation.z = Math.sin(elapsed * 2.3 + 1.0) * 0.03;
        lanternLight.intensity = 2.25 + Math.sin(elapsed * 7.5) * 0.28;

        const posAttr = sparkleGeo.attributes.position;
        for (let i = 0; i < particleCount; i += 1) {
          const meta = particleMeta[i];
          meta.life += dt * meta.speed;
          if (meta.life > 1) {
            resetParticle(i, false);
          } else {
            posAttr.array[i * 3] = -1.85 - meta.life * 3.1;
            posAttr.array[i * 3 + 1] =
              meta.yStart +
              meta.life * meta.yDrift +
              Math.sin(elapsed * 3 + i) * 0.06;
            posAttr.array[i * 3 + 2] = meta.zSpread;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (!prefersReducedMotion || elapsed < 0.2) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      container.style.transform = "";
      container.style.opacity = "";
      if (heroTextEl) {
        heroTextEl.style.maskImage = "";
        heroTextEl.style.webkitMaskImage = "";
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      santaHeadTex.dispose();
      elfHeadTex.dispose();
      if (sparkleTex) sparkleTex.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [logoRef, heroTextRef]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Model 3D interactiv cu Moș Crăciun și elful său pe sania cu cadouri"
      title="Trage pentru a roti modelul 3D"
      className="w-[300px] h-[200px] sm:w-[340px] sm:h-[227px] md:w-[376px] md:h-[251px] mt-6 lg:mt-0 select-none"
    />
  );
};

export default SantaSleigh;
