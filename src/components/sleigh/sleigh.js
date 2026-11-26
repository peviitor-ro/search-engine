import * as THREE from 'three';
import { createWoodTextures, createTuftedVelvetTextures, createBackSignTexture } from './textures.js';

/**
 * Sanie de Crăciun realistă:
 * - Lemn lăcuit roșu cu fibră și strat de lac (MeshPhysicalMaterial clearcoat)
 * - Tălpici și ornamente din alamă/aur periat cu reflexii
 * - Banchete din catifea matlasată (față: Moș Crăciun & Elf, spate: sacul cu cadouri)
 * - Felinare detaliate din alamă cu sticlă și flacără caldă
 * - Coroniță de brad detaliată cu fructe de pădure roșii și fundiță
 */
export function createSleigh(options = {}) {
  const { backSignText = 'JOBURI LA SAC!' } = options;
  const sleigh = new THREE.Group();
  sleigh.name = 'ChristmasSleigh';

  const redWoodTex = createWoodTextures('#9e1118', '#4d060a', 2, 2);
  const darkWoodTex = createWoodTextures('#3e1f0d', '#1c0c04', 2, 3);
  const velvetTex = createTuftedVelvetTextures();

  const redLacquerMat = new THREE.MeshPhysicalMaterial({
    map: redWoodTex.map,
    bumpMap: redWoodTex.bumpMap,
    bumpScale: 0.015,
    roughness: 0.24,
    metalness: 0.08,
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    map: darkWoodTex.map,
    bumpMap: darkWoodTex.bumpMap,
    bumpScale: 0.025,
    roughness: 0.62,
    metalness: 0.06,
  });

  const brassGoldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.22,
    metalness: 0.92,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x262626,
    roughness: 0.35,
    metalness: 0.85,
  });

  const velvetCushionMat = new THREE.MeshStandardMaterial({
    map: velvetTex.map,
    bumpMap: velvetTex.bumpMap,
    bumpScale: 0.045,
    roughness: 0.86,
    metalness: 0.02,
  });

  const pineNeedleMat = new THREE.MeshStandardMaterial({
    color: 0x14532d,
    roughness: 0.78,
  });

  // 1. Tălpici curbate din alamă/oțel lustruit + volute frontale elegante
  const runnerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.28, -2.14),
    new THREE.Vector3(0, 0.10, -1.78),
    new THREE.Vector3(0, 0.075, 0.0),
    new THREE.Vector3(0, 0.09, 1.65),
    new THREE.Vector3(0, 0.28, 2.25),
    new THREE.Vector3(0, 0.68, 2.58),
    new THREE.Vector3(0, 0.92, 2.40),
    new THREE.Vector3(0, 0.82, 2.15),
    new THREE.Vector3(0, 0.65, 2.20),
  ]);

  const runnerGeo = new THREE.TubeGeometry(runnerCurve, 64, 0.05, 16, false);

  [-0.95, 0.95].forEach((xPos) => {
    const runner = new THREE.Mesh(runnerGeo, brassGoldMat);
    runner.position.x = xPos;
    runner.castShadow = true;
    runner.receiveShadow = true;
    sleigh.add(runner);

    // Capete decorative aurii
    const frontOrb = new THREE.Mesh(new THREE.SphereGeometry(0.068, 18, 18), brassGoldMat);
    frontOrb.position.set(xPos, 0.65, 2.20);
    sleigh.add(frontOrb);

    const backOrb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 18), brassGoldMat);
    backOrb.position.set(xPos, 0.28, -2.14);
    sleigh.add(backOrb);

    // Suporturi sculptate (curbate spre interior)
    [-1.42, -0.46, 0.64, 1.54].forEach((zPos) => {
      const strutCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xPos, 0.09, zPos),
        new THREE.Vector3(xPos * 0.95, 0.32, zPos),
        new THREE.Vector3(xPos * 0.92, 0.56, zPos),
      ]);
      const strut = new THREE.Mesh(
        new THREE.TubeGeometry(strutCurve, 12, 0.036, 10, false),
        brassGoldMat
      );
      strut.castShadow = true;
      sleigh.add(strut);

      // Inel decorativ la mijlocul suportului
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.015, 8, 16), brassGoldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(xPos * 0.95, 0.32, zPos);
      sleigh.add(ring);
    });
  });

  // Bare transversale de rigidizare
  [-1.42, -0.46, 0.64, 1.54].forEach((zPos) => {
    const crossBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1.84, 12),
      darkMetalMat
    );
    crossBar.rotation.z = Math.PI / 2;
    crossBar.position.set(0, 0.33, zPos);
    sleigh.add(crossBar);
  });

  // 2. Podeaua din lemn de nuc cu scânduri și covoraș brodat
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.12, 3.68), darkWoodMat);
  floor.position.set(0, 0.56, 0.02);
  floor.castShadow = true;
  floor.receiveShadow = true;
  sleigh.add(floor);

  const carpet = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.025, 3.36), velvetCushionMat);
  carpet.position.set(0, 0.63, 0.02);
  carpet.receiveShadow = true;
  sleigh.add(carpet);

  // 3. Panouri laterale curbate cu profil bogat
  const sideShape = new THREE.Shape();
  sideShape.moveTo(-1.84, 0.55);
  sideShape.lineTo(1.84, 0.55);
  sideShape.bezierCurveTo(2.18, 0.66, 2.26, 1.18, 1.96, 1.50);
  sideShape.bezierCurveTo(1.65, 1.54, 1.44, 1.24, 1.14, 1.20);
  sideShape.bezierCurveTo(0.80, 1.16, 0.44, 1.12, 0.08, 1.23);
  sideShape.bezierCurveTo(-0.36, 1.38, -0.96, 1.44, -1.46, 1.70);
  sideShape.bezierCurveTo(-1.80, 1.84, -2.00, 1.58, -1.90, 1.10);
  sideShape.closePath();

  const sideGeo = new THREE.ExtrudeGeometry(sideShape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelThickness: 0.024,
    bevelSize: 0.022,
    bevelSegments: 5,
  });

  const rimPoints = [
    new THREE.Vector3(0, 1.50, 1.96),
    new THREE.Vector3(0, 1.24, 1.25),
    new THREE.Vector3(0, 1.17, 0.55),
    new THREE.Vector3(0, 1.28, -0.15),
    new THREE.Vector3(0, 1.49, -0.95),
    new THREE.Vector3(0, 1.73, -1.62),
    new THREE.Vector3(0, 1.48, -1.88),
  ];
  const rimCurve = new THREE.CatmullRomCurve3(rimPoints);
  const rimGeo = new THREE.TubeGeometry(rimCurve, 56, 0.04, 14, false);

  // Ornament auriu filigranat pe panourile laterale
  const filigreeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.85, 1.55),
    new THREE.Vector3(0, 0.96, 0.95),
    new THREE.Vector3(0, 0.82, 0.20),
    new THREE.Vector3(0, 1.02, -0.55),
    new THREE.Vector3(0, 1.18, -1.25),
    new THREE.Vector3(0, 0.92, -1.55),
  ]);
  const filigreeGeo = new THREE.TubeGeometry(filigreeCurve, 48, 0.022, 10, false);

  [-0.95, 0.86].forEach((xPos, idx) => {
    const panel = new THREE.Mesh(sideGeo, redLacquerMat);
    panel.rotation.y = -Math.PI / 2;
    panel.position.set(xPos + 0.09, 0, 0);
    panel.castShadow = true;
    panel.receiveShadow = true;
    sleigh.add(panel);

    const sideX = idx === 0 ? -0.95 : 0.95;
    const outward = idx === 0 ? -0.055 : 0.055;

    const rim = new THREE.Mesh(rimGeo, brassGoldMat);
    rim.position.x = sideX;
    rim.castShadow = true;
    sleigh.add(rim);

    const filigree = new THREE.Mesh(filigreeGeo, brassGoldMat);
    filigree.position.x = sideX + outward;
    sleigh.add(filigree);

    // Bandă inferioară aurie
    const lowerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.045, 3.32), brassGoldMat);
    lowerTrim.position.set(sideX + outward, 0.67, 0.0);
    sleigh.add(lowerTrim);
  });

  // 4. Bordul frontal și panoul din spate
  const frontBoard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.86, 0.11), redLacquerMat);
  frontBoard.position.set(0, 1.02, 1.89);
  frontBoard.rotation.x = 0.24;
  frontBoard.castShadow = true;
  frontBoard.receiveShadow = true;
  sleigh.add(frontBoard);

  const frontBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 2.0, 16),
    brassGoldMat
  );
  frontBar.rotation.z = Math.PI / 2;
  frontBar.position.set(0, 1.43, 1.98);
  sleigh.add(frontBar);

  // Coroniță bogată de brad pe bordul frontal
  const wreathGroup = new THREE.Group();
  wreathGroup.position.set(0, 1.04, 1.99);
  wreathGroup.rotation.x = 0.24;
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const tuft = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075, 1), pineNeedleMat);
    tuft.position.set(Math.cos(angle) * 0.23, Math.sin(angle) * 0.23, 0);
    tuft.rotation.set(angle, i * 0.5, 0);
    wreathGroup.add(tuft);
  }
  const berryMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    roughness: 0.2,
    clearcoat: 1,
  });
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2 + 0.2;
    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 10), berryMat);
    berry.position.set(Math.cos(angle) * 0.23, Math.sin(angle) * 0.23, 0.06);
    wreathGroup.add(berry);
  }
  // Fundiță de catifea pe coroniță
  const bowMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55 });
  [-0.08, 0.08].forEach((ox) => {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.022, 10, 16), bowMat);
    loop.position.set(ox, 0.24, 0.06);
    loop.rotation.y = ox > 0 ? 0.35 : -0.35;
    wreathGroup.add(loop);
  });
  sleigh.add(wreathGroup);

  const backBoard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.18, 0.12), redLacquerMat);
  backBoard.position.set(0, 1.13, -1.79);
  backBoard.rotation.x = -0.14;
  backBoard.castShadow = true;
  backBoard.receiveShadow = true;
  sleigh.add(backBoard);

  // Plăcuță festivă cu mesaj pe spatele saniei (aliniată exact pe panoul din spate)
  if (backSignText) {
    const signGroup = new THREE.Group();
    signGroup.position.copy(backBoard.position);
    signGroup.rotation.copy(backBoard.rotation);

    const signTex = createBackSignTexture(backSignText);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      transparent: true,
      roughness: 0.35,
      metalness: 0.25,
    });
    const signPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 0.67), signMat);
    signPlane.position.set(0, 0.02, -0.068);
    signPlane.rotation.y = Math.PI;
    signGroup.add(signPlane);
    sleigh.add(signGroup);
  }

  const backTopBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.048, 2.0, 16),
    brassGoldMat
  );
  backTopBar.rotation.z = Math.PI / 2;
  backTopBar.position.set(0, 1.70, -1.87);
  sleigh.add(backTopBar);

  // 5. BANCHETA DIN FAȚĂ (matlasată, pentru Moș Crăciun și Elf)
  const frontBench = new THREE.Group();
  const fbBase = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.30, 0.62), darkWoodMat);
  fbBase.position.set(0, 0.77, 0.56);
  fbBase.castShadow = true;
  fbBase.receiveShadow = true;
  frontBench.add(fbBase);

  const fbCushion = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.14, 0.66), velvetCushionMat);
  fbCushion.position.set(0, 0.96, 0.56);
  fbCushion.castShadow = true;
  fbCushion.receiveShadow = true;
  frontBench.add(fbCushion);

  // Rolă frontală rotunjită pe marginea pernei
  const fbBolster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068, 0.068, 1.74, 16),
    velvetCushionMat
  );
  fbBolster.rotation.z = Math.PI / 2;
  fbBolster.position.set(0, 0.96, 0.88);
  frontBench.add(fbBolster);

  const fbBackrest = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.56, 0.14), velvetCushionMat);
  fbBackrest.position.set(0, 1.25, 0.24);
  fbBackrest.rotation.x = -0.12;
  fbBackrest.castShadow = true;
  frontBench.add(fbBackrest);

  const fbTrim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 1.82, 14),
    brassGoldMat
  );
  fbTrim.rotation.z = Math.PI / 2;
  fbTrim.position.set(0, 1.54, 0.20);
  frontBench.add(fbTrim);
  sleigh.add(frontBench);

  // 6. BANCHETA DIN SPATE (matlasată, pentru sacul cu cadouri)
  const backBench = new THREE.Group();
  const bbBase = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.32, 0.86), darkWoodMat);
  bbBase.position.set(0, 0.78, -0.98);
  bbBase.castShadow = true;
  bbBase.receiveShadow = true;
  backBench.add(bbBase);

  const bbCushion = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.14, 0.88), velvetCushionMat);
  bbCushion.position.set(0, 0.98, -0.98);
  bbCushion.castShadow = true;
  bbCushion.receiveShadow = true;
  backBench.add(bbCushion);

  const bbBolster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068, 0.068, 1.74, 16),
    velvetCushionMat
  );
  bbBolster.rotation.z = Math.PI / 2;
  bbBolster.position.set(0, 0.98, -0.54);
  backBench.add(bbBolster);

  const bbBackrest = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.64, 0.14), velvetCushionMat);
  bbBackrest.position.set(0, 1.33, -1.58);
  bbBackrest.rotation.x = -0.14;
  bbBackrest.castShadow = true;
  backBench.add(bbBackrest);

  const bbFrontTrim = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.04, 0.04), brassGoldMat);
  bbFrontTrim.position.set(0, 0.91, -0.52);
  backBench.add(bbFrontTrim);
  sleigh.add(backBench);

  // 7. Felinare din alamă cu sticlă translucidă și miez luminos
  const lanternLights = [];
  const lanternGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff7d6,
    emissive: 0xffa62b,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    transmission: 0.55,
    thickness: 0.05,
  });

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });

  [-0.95, 0.95].forEach((xPos) => {
    const lg = new THREE.Group();
    // Așezat direct pe marginea aurie frontală a saniei (fără suport negru exterior)
    lg.position.set(xPos, 1.51, 1.95);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.078, 0.075, 6), brassGoldMat);
    base.position.y = 0.02;
    lg.add(base);

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.072, 0.20, 6), lanternGlassMat);
    glass.position.y = 0.13;
    lg.add(glass);

    // Bare metalice verticale ale felinarului
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.21, 6), darkMetalMat);
      bar.position.set(Math.cos(a) * 0.082, 0.13, Math.sin(a) * 0.082);
      lg.add(bar);
    }

    // Flacără interioară
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), flameMat);
    flame.scale.set(0.8, 1.5, 0.8);
    flame.position.y = 0.12;
    lg.add(flame);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.13, 6), brassGoldMat);
    cap.position.y = 0.29;
    lg.add(cap);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), brassGoldMat);
    finial.position.y = 0.37;
    lg.add(finial);

    const light = new THREE.PointLight(0xffb44c, 2.1, 11, 1.5);
    light.position.set(0, 0.14, 0.05);
    lg.add(light);
    lanternLights.push(light);

    sleigh.add(lg);
  });

  // 8. Luminițe calde de Crăciun (alb cald + auriu, aspect natural cu bloom)
  const fairyBulbs = [];
  const warmBulbColors = [0xffe8a3, 0xffc966, 0xfff3cc, 0xffa94d];
  [-0.99, 0.99].forEach((xPos) => {
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const pt = rimCurve.getPoint(t);
      const col = warmBulbColors[i % warmBulbColors.length];
      const bulbMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 1.1,
        roughness: 0.2,
      });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), bulbMat);
      bulb.position.set(xPos + (xPos > 0 ? 0.038 : -0.038), pt.y - 0.055, pt.z);
      sleigh.add(bulb);
      fairyBulbs.push({ mesh: bulb, phase: i * 0.65 });
    }
  });

  return { sleigh, lanternLights, fairyBulbs };
}
