import * as THREE from 'three';
import {
  createBurlapTextures,
  createFabricBumpTexture,
  createWrappingPaperTexture,
  createSkinTextures,
  createHairStrandTextures,
} from './textures.js';

const headTextureLoader = new THREE.TextureLoader();

function loadCutoutHeadTexture(url) {
  const tex = headTextureLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Construiește o geometrie organică tubulară de-a lungul unei curbe,
 * cu rază variabilă și pliuri textile subtile (pentru brațe, picioare, căciuli, mustață).
 */
function createLoftedTubeGeo(
  curve,
  radiusFn,
  tubularSegments = 28,
  radialSegments = 18,
  foldAmp = 0.0
) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const u = i / tubularSegments;
    const pt = curve.getPointAt(u);
    const baseR = radiusFn(u);
    const N = frames.normals[i];
    const B = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const crease =
        foldAmp > 0
          ? 1 + foldAmp * Math.sin(u * Math.PI * 5 + Math.cos(v * 3)) * Math.sin(u * Math.PI)
          : 1;
      const r = baseR * crease;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);
      positions.push(
        pt.x + r * (cos * N.x + sin * B.x),
        pt.y + r * (cos * N.y + sin * B.y),
        pt.z + r * (cos * N.z + sin * B.z)
      );
      uvs.push(j / radialSegments, u);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Construiește o curea din piele lipită strâns de conturul exact al trunchiului
 * (atașată direct de corp, fără spațiu liber și fără clipping cu abdomenul).
 */
function createFittedBelt(torsoOpts, torsoBaseY, beltY, beltHeight, clearance, leatherMat, goldMat) {
  const { height, shoulderW, waistW, hipW, bellyBulge, folds = 9 } = torsoOpts;
  const v = THREE.MathUtils.clamp((beltY - torsoBaseY) / height, 0.05, 0.95);

  const segR = 64;
  const halfH = beltHeight / 2;
  const bandThick = 0.014;
  // Offset minim peste pliurile stofei astfel încât cureaua să fie lipită de haină
  const foldPad = 0.011 * (1 - v * 0.6) + clearance;

  const sampleContour = (theta, yOff, radialPad) => {
    const vy = THREE.MathUtils.clamp((beltY + yOff - torsoBaseY) / height, 0.05, 0.95);
    let crx, crz;
    if (vy < 0.35) {
      const t = vy / 0.35;
      crx = THREE.MathUtils.lerp(hipW, waistW, t);
      crz = THREE.MathUtils.lerp(hipW * 0.85, waistW * 0.88 + bellyBulge, t);
    } else {
      const t = (vy - 0.35) / 0.5;
      crx = THREE.MathUtils.lerp(waistW, shoulderW, Math.sin(t * Math.PI * 0.5));
      crz = THREE.MathUtils.lerp(waistW * 0.88 + bellyBulge, shoulderW * 0.66, t);
    }
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const foldWave =
      (Math.sin(theta * folds + vy * 3.0) * 0.012 + Math.cos(theta * (folds + 4) - vy * 2.0) * 0.007) *
      (1 - vy * 0.6);
    const frontBulge = sin > 0 ? Math.sin(vy * Math.PI) * bellyBulge * 0.55 * sin : 0;
    const x = (crx + Math.max(0, foldWave) + radialPad) * cos;
    const z = (crz + Math.max(0, foldWave) + radialPad) * sin + frontBulge;
    return { x, z };
  };

  // Construim o bandă 3D închisă (fața exterioară + muchia de sus + muchia de jos lipite de corp)
  const positions = [];
  const indices = [];
  // 4 inele: 0 = jos interior (lipit în haină), 1 = jos exterior, 2 = sus exterior, 3 = sus interior
  const rings = [
    { y: -halfH, pad: -0.006 },
    { y: -halfH, pad: foldPad + bandThick },
    { y: halfH, pad: foldPad + bandThick },
    { y: halfH, pad: -0.006 },
  ];

  for (const ring of rings) {
    for (let ir = 0; ir <= segR; ir++) {
      const theta = (ir / segR) * Math.PI * 2;
      const p = sampleContour(theta, ring.y, ring.pad);
      positions.push(p.x, ring.y, p.z);
    }
  }

  const stride = segR + 1;
  for (let r = 0; r < 3; r++) {
    for (let ir = 0; ir < segR; ir++) {
      const a = r * stride + ir;
      const b = (r + 1) * stride + ir;
      const c = (r + 1) * stride + ir + 1;
      const d = r * stride + ir + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const beltGeo = new THREE.BufferGeometry();
  beltGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  beltGeo.setIndex(indices);
  beltGeo.computeVertexNormals();

  const beltGroup = new THREE.Group();
  beltGroup.position.set(0, beltY, 0);

  const strap = new THREE.Mesh(beltGeo, leatherMat);
  strap.castShadow = true;
  beltGroup.add(strap);

  // Cataramă aurie așezată lipit pe partea din față a curelei (theta = PI/2 -> sin = 1)
  const frontPt = sampleContour(Math.PI / 2, 0, foldPad + bandThick);
  const buckleSize = beltHeight * 0.68;
  const buckle = new THREE.Mesh(new THREE.TorusGeometry(buckleSize, beltHeight * 0.17, 10, 4), goldMat);
  buckle.rotation.z = Math.PI / 4;
  buckle.position.set(0, 0, frontPt.z + 0.006);
  beltGroup.add(buckle);

  return beltGroup;
}

/**
 * Mână cu palmă rotunjită organic, deget mare și 4 degete ușor îndoite
 */
function createSculptedHand(material, scale = 1.0, mirrored = false) {
  const hand = new THREE.Group();
  const dir = mirrored ? -1 : 1;

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.042, 18, 14), material);
  palm.scale.set(0.95, 0.48, 1.15);
  palm.castShadow = true;
  hand.add(palm);

  for (let i = 0; i < 4; i++) {
    const ox = (-0.024 + i * 0.016) * dir;
    const len = i === 1 || i === 2 ? 0.062 : 0.050;
    const fCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ox, 0.0, 0.030),
      new THREE.Vector3(ox, -0.006, 0.030 + len * 0.6),
      new THREE.Vector3(ox, -0.022, 0.030 + len),
    ]);
    const finger = new THREE.Mesh(
      createLoftedTubeGeo(fCurve, (u) => THREE.MathUtils.lerp(0.010, 0.007, u), 8, 8),
      material
    );
    hand.add(finger);
  }

  const thumbCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.030 * dir, -0.003, 0.004),
    new THREE.Vector3(0.050 * dir, -0.010, 0.028),
    new THREE.Vector3(0.044 * dir, -0.018, 0.050),
  ]);
  const thumb = new THREE.Mesh(
    createLoftedTubeGeo(thumbCurve, (u) => THREE.MathUtils.lerp(0.0115, 0.008, u), 8, 8),
    material
  );
  hand.add(thumb);

  hand.scale.setScalar(scale);
  return hand;
}

/**
 * Cizmă / gheată sculptată (talpă, toc, carâmb, vârf rotunjit sau curbat)
 */
function createSculptedBoot(leatherMat, soleMat, furMat = null, scale = 1.0, pointyTip = false) {
  const boot = new THREE.Group();

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.19, 18), leatherMat);
  shaft.position.set(0, 0.095, -0.02);
  shaft.castShadow = true;
  boot.add(shaft);

  const footCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.045, -0.04),
    new THREE.Vector3(0, 0.042, 0.05),
    new THREE.Vector3(0, pointyTip ? 0.052 : 0.036, pointyTip ? 0.165 : 0.135),
    ...(pointyTip ? [new THREE.Vector3(0, 0.088, 0.215)] : []),
  ]);
  const foot = new THREE.Mesh(
    createLoftedTubeGeo(
      footCurve,
      (u) => (pointyTip ? THREE.MathUtils.lerp(0.064, 0.014, u) : THREE.MathUtils.lerp(0.064, 0.042, u)),
      16,
      14
    ),
    leatherMat
  );
  foot.scale.set(1.05, 0.78, 1.0);
  foot.castShadow = true;
  boot.add(foot);

  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.022, 0.22), soleMat);
  sole.position.set(0, -0.005, 0.045);
  boot.add(sole);

  const heel = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.026, 0.075), soleMat);
  heel.position.set(0, -0.02, -0.025);
  boot.add(heel);

  if (furMat) {
    const cuffGeo = new THREE.TorusGeometry(0.072, 0.028, 14, 24);
    const p = cuffGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = 1 + Math.sin(x * 45 + y * 35) * 0.09;
      p.setXYZ(i, x * n, y * n, z * n);
    }
    cuffGeo.computeVertexNormals();
    const cuff = new THREE.Mesh(cuffGeo, furMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, 0.185, -0.02);
    boot.add(cuff);
  }

  boot.scale.setScalar(scale);
  return boot;
}

/**
 * Haină / tunică continuă sculptată cu pliuri naturale ale stofei (normale spre exterior)
 */
function createDrapedTorsoGeo({
  height = 0.68,
  shoulderW = 0.30,
  waistW = 0.28,
  hipW = 0.34,
  bellyBulge = 0.10,
  folds = 9,
}) {
  const segY = 28;
  const segR = 36;
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let iy = 0; iy <= segY; iy++) {
    const v = iy / segY;
    const y = v * height;

    let rx, rz;
    if (v < 0.35) {
      const t = v / 0.35;
      rx = THREE.MathUtils.lerp(hipW, waistW, t);
      rz = THREE.MathUtils.lerp(hipW * 0.85, waistW * 0.88 + bellyBulge, t);
    } else if (v < 0.85) {
      const t = (v - 0.35) / 0.5;
      rx = THREE.MathUtils.lerp(waistW, shoulderW, Math.sin(t * Math.PI * 0.5));
      rz = THREE.MathUtils.lerp(waistW * 0.88 + bellyBulge, shoulderW * 0.66, t);
    } else {
      const t = (v - 0.85) / 0.15;
      rx = THREE.MathUtils.lerp(shoulderW, 0.10, t * t);
      rz = THREE.MathUtils.lerp(shoulderW * 0.66, 0.095, t * t);
    }

    for (let ir = 0; ir <= segR; ir++) {
      const u = ir / segR;
      const theta = u * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      const foldWave =
        (Math.sin(theta * folds + v * 3.0) * 0.012 + Math.cos(theta * (folds + 4) - v * 2.0) * 0.007) *
        (1 - v * 0.6);

      const frontBulge = sin > 0 ? Math.sin(v * Math.PI) * bellyBulge * 0.55 * sin : 0;

      positions.push((rx + foldWave) * cos, y, (rz + foldWave) * sin + frontBulge);
      uvs.push(u, v);
    }
  }

  for (let iy = 0; iy < segY; iy++) {
    for (let ir = 0; ir < segR; ir++) {
      const a = iy * (segR + 1) + ir;
      const b = (iy + 1) * (segR + 1) + ir;
      const c = (iy + 1) * (segR + 1) + (ir + 1);
      const d = iy * (segR + 1) + (ir + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Ureche organică (rotundă sau ascuțită de elf)
 */
function createSculptedEar(skinMat, elfPointy = false) {
  const shape = new THREE.Shape();
  if (elfPointy) {
    shape.moveTo(0, -0.028);
    shape.quadraticCurveTo(0.025, -0.032, 0.045, 0.005);
    shape.quadraticCurveTo(0.072, 0.038, 0.088, 0.055);
    shape.quadraticCurveTo(0.042, 0.046, 0.015, 0.028);
    shape.quadraticCurveTo(-0.008, 0.012, 0, -0.028);
  } else {
    shape.moveTo(0, -0.025);
    shape.quadraticCurveTo(0.024, -0.028, 0.028, 0.0);
    shape.quadraticCurveTo(0.026, 0.032, 0.006, 0.030);
    shape.quadraticCurveTo(-0.008, 0.012, 0, -0.025);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.009,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 3,
  });
  const mesh = new THREE.Mesh(geo, skinMat);
  mesh.castShadow = true;
  return mesh;
}

/**
 * MOȘ CRĂCIUN — Model sculptat complet procedural
 */
export function createSanta(options = {}) {
  const { headUrl = './textures/santa-head.png' } = options;
  const santa = new THREE.Group();
  santa.name = 'SantaClaus';

  const woolBump = createFabricBumpTexture(5);
  const furTex = createHairStrandTextures('#f8fafc', '#d8e0ea');
  const skinTex = createSkinTextures('#edc0a4', '#cf7366');
  const santaHeadTex = loadCutoutHeadTexture(headUrl);

  const redWoolMat = new THREE.MeshPhysicalMaterial({
    color: 0xa8161a,
    bumpMap: woolBump,
    bumpScale: 0.02,
    roughness: 0.84,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xdc4c4c),
  });

  const whiteFurMat = new THREE.MeshStandardMaterial({
    map: furTex.map,
    bumpMap: furTex.bumpMap,
    bumpScale: 0.045,
    roughness: 0.94,
    side: THREE.DoubleSide,
  });

  const skinMat = new THREE.MeshPhysicalMaterial({
    map: skinTex.map,
    bumpMap: skinTex.bumpMap,
    bumpScale: 0.006,
    roughness: 0.56,
    sheen: 0.22,
    sheenColor: new THREE.Color(0xffb8a6),
  });

  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x1c1715,
    roughness: 0.38,
    metalness: 0.14,
  });

  const soleMat = new THREE.MeshStandardMaterial({ color: 0x0e0c0b, roughness: 0.8 });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.22,
    metalness: 0.92,
  });

  const torsoGroup = new THREE.Group();
  santa.add(torsoGroup);

  const santaTorsoOpts = {
    height: 0.72,
    shoulderW: 0.31,
    waistW: 0.29,
    hipW: 0.35,
    bellyBulge: 0.11,
    folds: 10,
  };
  const coatGeo = createDrapedTorsoGeo(santaTorsoOpts);
  const coat = new THREE.Mesh(coatGeo, redWoolMat);
  coat.position.set(0, 0.04, 0);
  coat.castShadow = true;
  coat.receiveShadow = true;
  torsoGroup.add(coat);

  const hemFurGeo = new THREE.TorusGeometry(0.34, 0.045, 14, 32);
  const hfP = hemFurGeo.attributes.position;
  for (let i = 0; i < hfP.count; i++) {
    const x = hfP.getX(i), y = hfP.getY(i), z = hfP.getZ(i);
    const n = 1 + Math.sin(x * 24 + y * 20) * 0.08;
    hfP.setXYZ(i, x * n, y * 0.88 * n, z * n);
  }
  hemFurGeo.computeVertexNormals();
  const hemFur = new THREE.Mesh(hemFurGeo, whiteFurMat);
  hemFur.rotation.x = Math.PI / 2;
  hemFur.position.set(0, 0.06, 0.01);
  torsoGroup.add(hemFur);

  const lapelCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.09, 0.31),
    new THREE.Vector3(0, 0.34, 0.365),
    new THREE.Vector3(0, 0.68, 0.22),
  ]);
  const lapelFur = new THREE.Mesh(
    createLoftedTubeGeo(lapelCurve, () => 0.042, 18, 12, 0.14),
    whiteFurMat
  );
  torsoGroup.add(lapelFur);

  // Curea din piele lipită strâns pe abdomen (fără spațiu și fără clipping!)
  const santaBelt = createFittedBelt(santaTorsoOpts, 0.04, 0.29, 0.082, 0.003, leatherMat, goldMat);
  torsoGroup.add(santaBelt);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.076, 0.08, 18), skinMat);
  neck.position.set(0, 0.755, 0.01);
  torsoGroup.add(neck);

  const collarGeo = new THREE.TorusGeometry(0.145, 0.048, 14, 28);
  const colP = collarGeo.attributes.position;
  for (let i = 0; i < colP.count; i++) {
    const x = colP.getX(i), y = colP.getY(i), z = colP.getZ(i);
    const n = 1 + Math.sin(x * 32 + y * 28) * 0.1;
    colP.setXYZ(i, x * n, y * n, z * n);
  }
  collarGeo.computeVertexNormals();
  const collar = new THREE.Mesh(collarGeo, whiteFurMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.73, 0.01);
  torsoGroup.add(collar);

  [-0.145, 0.145].forEach((xPos) => {
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(xPos, 0.12, 0.06),
      new THREE.Vector3(xPos * 1.05, 0.11, 0.34),
      new THREE.Vector3(xPos * 1.05, -0.05, 0.44),
      new THREE.Vector3(xPos * 1.05, -0.22, 0.46),
    ]);
    const leg = new THREE.Mesh(
      createLoftedTubeGeo(legCurve, (u) => THREE.MathUtils.lerp(0.105, 0.072, u), 20, 14, 0.07),
      redWoolMat
    );
    leg.castShadow = true;
    santa.add(leg);

    const boot = createSculptedBoot(leatherMat, soleMat, whiteFurMat, 1.05, false);
    boot.position.set(xPos * 1.05, -0.35, 0.48);
    santa.add(boot);
  });

  // Cap fotografic decupat din proiectul search-engine (mărit cu încă +5% -> 1.654x)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.069, 0.01);
  headGroup.scale.setScalar(1.654);
  torsoGroup.add(headGroup);

  const santaFaceMat = new THREE.MeshBasicMaterial({
    map: santaHeadTex,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const santaFacePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), santaFaceMat);
  santaFacePlane.position.set(0, 0.01, 0.068);
  headGroup.add(santaFacePlane);

  const hatGroup = new THREE.Group();
  hatGroup.position.set(0.0, 0.15, 0.078);
  hatGroup.rotation.z = 0.05;
  headGroup.add(hatGroup);

  const brimGeo = new THREE.TorusGeometry(0.145, 0.038, 14, 28);
  const brP = brimGeo.attributes.position;
  for (let i = 0; i < brP.count; i++) {
    const x = brP.getX(i), y = brP.getY(i), z = brP.getZ(i);
    const n = 1 + Math.sin(x * 36 + z * 30) * 0.08;
    brP.setXYZ(i, x * n, y * n, z * n);
  }
  brimGeo.computeVertexNormals();
  const hatBrim = new THREE.Mesh(brimGeo, whiteFurMat);
  hatBrim.rotation.x = Math.PI / 2;
  hatBrim.scale.set(1.06, 0.56, 1.0);
  hatGroup.add(hatBrim);

  const hatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.01, 0),
    new THREE.Vector3(-0.02, 0.14, -0.02),
    new THREE.Vector3(-0.10, 0.24, -0.05),
    new THREE.Vector3(-0.21, 0.19, -0.08),
    new THREE.Vector3(-0.26, 0.09, -0.09),
  ]);
  const hatMesh = new THREE.Mesh(
    createLoftedTubeGeo(hatCurve, (u) => THREE.MathUtils.lerp(0.135, 0.022, Math.pow(u, 0.85)), 26, 20, 0.09),
    redWoolMat
  );
  hatMesh.castShadow = true;
  hatGroup.add(hatMesh);

  const pomPom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.052, 2), whiteFurMat);
  pomPom.position.set(-0.26, 0.075, -0.09);
  hatGroup.add(pomPom);

  // Ambele brațe ale lui Moș Crăciun țin ferm hățurile în fața burții (fără clipping!)
  const leftArm = new THREE.Group();
  leftArm.position.set(0.27, 0.64, 0.01);
  torsoGroup.add(leftArm);

  const lArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.08, -0.14, 0.09),
    new THREE.Vector3(0.06, -0.20, 0.27),
    new THREE.Vector3(0.02, -0.18, 0.43),
  ]);
  const lSleeve = new THREE.Mesh(
    createLoftedTubeGeo(lArmCurve, (u) => THREE.MathUtils.lerp(0.084, 0.060, u), 22, 16, 0.08),
    redWoolMat
  );
  lSleeve.castShadow = true;
  leftArm.add(lSleeve);

  const lCuff = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.025, 12, 18), whiteFurMat);
  lCuff.position.set(0.02, -0.18, 0.41);
  leftArm.add(lCuff);

  const lHand = createSculptedHand(leatherMat, 1.12, false);
  lHand.position.set(0.02, -0.18, 0.46);
  lHand.rotation.x = 0.25;
  leftArm.add(lHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(-0.27, 0.64, 0.01);
  torsoGroup.add(rightArm);

  const rArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.08, -0.14, 0.09),
    new THREE.Vector3(-0.06, -0.20, 0.27),
    new THREE.Vector3(-0.02, -0.18, 0.43),
  ]);
  const rSleeve = new THREE.Mesh(
    createLoftedTubeGeo(rArmCurve, (u) => THREE.MathUtils.lerp(0.084, 0.060, u), 22, 16, 0.08),
    redWoolMat
  );
  rSleeve.castShadow = true;
  rightArm.add(rSleeve);

  const rCuff = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.025, 12, 18), whiteFurMat);
  rCuff.position.set(-0.02, -0.18, 0.41);
  rightArm.add(rCuff);

  const rHand = createSculptedHand(leatherMat, 1.12, true);
  rHand.position.set(-0.02, -0.18, 0.46);
  rHand.rotation.x = 0.25;
  rightArm.add(rHand);

  return { santa, torsoGroup, headGroup, rightArm, leftArm, leftHand: lHand, rightHand: rHand, pomPom };
}

/**
 * ELFUL AJUTOR — Model sculptat complet procedural
 */
export function createElf(options = {}) {
  const { headUrl = './textures/elf-head.png' } = options;
  const elf = new THREE.Group();
  elf.name = 'ElfHelper';

  const feltBump = createFabricBumpTexture(6);
  const skinTex = createSkinTextures('#f2c9ad', '#df8578');
  const elfHeadTex = loadCutoutHeadTexture(headUrl);

  const greenFeltMat = new THREE.MeshPhysicalMaterial({
    color: 0x166534,
    bumpMap: feltBump,
    bumpScale: 0.018,
    roughness: 0.82,
    sheen: 0.28,
    sheenColor: new THREE.Color(0x4ade80),
  });

  const redFeltMat = new THREE.MeshStandardMaterial({
    color: 0xa61c20,
    bumpMap: feltBump,
    bumpScale: 0.016,
    roughness: 0.82,
  });

  const skinMat = new THREE.MeshPhysicalMaterial({
    map: skinTex.map,
    bumpMap: skinTex.bumpMap,
    bumpScale: 0.005,
    roughness: 0.54,
    sheen: 0.2,
  });

  const darkGreenLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x123821,
    roughness: 0.42,
    metalness: 0.1,
  });

  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x2b180c, roughness: 0.44 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0x140c07, roughness: 0.8 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.22, metalness: 0.92 });

  const bodyGroup = new THREE.Group();
  elf.add(bodyGroup);

  const elfTorsoOpts = {
    height: 0.56,
    shoulderW: 0.20,
    waistW: 0.16,
    hipW: 0.23,
    bellyBulge: 0.02,
    folds: 8,
  };
  const tunicGeo = createDrapedTorsoGeo(elfTorsoOpts);
  const tunic = new THREE.Mesh(tunicGeo, greenFeltMat);
  tunic.position.set(0, 0.04, 0);
  tunic.castShadow = true;
  tunic.receiveShadow = true;
  bodyGroup.add(tunic);

  [0.32, 0.40, 0.48].forEach((yPos) => {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), goldMat);
    btn.position.set(0, yPos, 0.172);
    bodyGroup.add(btn);
  });

  // Șal / guler roșu mulat pe umerii eliptici (fără clipping)
  const collarRing = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.224, 0.11, 28), redFeltMat);
  collarRing.scale.set(1.18, 1.0, 0.88);
  collarRing.position.set(0, 0.562, 0.004);
  collarRing.castShadow = true;
  bodyGroup.add(collarRing);

  // Curea din piele lipită strâns pe talia elfului (fără spațiu și fără clipping!)
  const elfBelt = createFittedBelt(elfTorsoOpts, 0.04, 0.24, 0.058, 0.002, leatherMat, goldMat);
  bodyGroup.add(elfBelt);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.062, 0.10, 16), skinMat);
  neck.position.set(0, 0.60, 0.005);
  bodyGroup.add(neck);

  [-0.095, 0.095].forEach((xPos) => {
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(xPos, 0.10, 0.04),
      new THREE.Vector3(xPos * 1.04, 0.09, 0.28),
      new THREE.Vector3(xPos * 1.04, -0.05, 0.36),
      new THREE.Vector3(xPos * 1.04, -0.20, 0.38),
    ]);
    const leg = new THREE.Mesh(
      createLoftedTubeGeo(legCurve, (u) => THREE.MathUtils.lerp(0.068, 0.046, u), 18, 12, 0.05),
      redFeltMat
    );
    leg.castShadow = true;
    elf.add(leg);

    const boot = createSculptedBoot(darkGreenLeatherMat, soleMat, null, 0.85, true);
    boot.position.set(xPos * 1.04, -0.31, 0.40);
    elf.add(boot);

    const tipBell = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), goldMat);
    tipBell.position.set(xPos * 1.04, -0.24, 0.59);
    elf.add(tipBell);
  });

  // Cap fotografic decupat din proiectul search-engine (mărit cu încă +5% -> 1.654x)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.879, 0.03);
  headGroup.scale.setScalar(1.654);
  bodyGroup.add(headGroup);

  const elfFaceMat = new THREE.MeshBasicMaterial({
    map: elfHeadTex,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const elfFacePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.38), elfFaceMat);
  headGroup.add(elfFacePlane);

  // Urechi ascuțite de elf lipite curat de marginile părului (fără gap pe partea dreaptă)
  [-1, 1].forEach((dir) => {
    const ear = createSculptedEar(skinMat, true);
    const xPos = dir > 0 ? 0.114 : -0.138;
    ear.position.set(xPos, 0.005, -0.015);
    ear.rotation.y = dir > 0 ? 0.25 : Math.PI - 0.25;
    headGroup.add(ear);
  });

  const hatBrim = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.028, 12, 24), redFeltMat);
  hatBrim.rotation.x = Math.PI / 2;
  hatBrim.scale.set(1.06, 0.58, 1.0);
  hatBrim.position.set(0, 0.145, 0.01);
  headGroup.add(hatBrim);

  const elfHatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.15, 0.01),
    new THREE.Vector3(0.02, 0.27, -0.01),
    new THREE.Vector3(0.10, 0.37, -0.04),
    new THREE.Vector3(0.20, 0.34, -0.06),
  ]);
  const elfHatMesh = new THREE.Mesh(
    createLoftedTubeGeo(elfHatCurve, (u) => THREE.MathUtils.lerp(0.115, 0.014, Math.pow(u, 0.85)), 22, 18, 0.08),
    greenFeltMat
  );
  elfHatMesh.castShadow = true;
  headGroup.add(elfHatMesh);

  const hatBell = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 14), goldMat);
  hatBell.position.set(0.21, 0.335, -0.06);
  headGroup.add(hatBell);

  // Brațul stâng odihnit natural pe piciorul / coapsa stângă a elfului
  const leftArm = new THREE.Group();
  leftArm.position.set(0.18, 0.49, 0.01);
  bodyGroup.add(leftArm);

  const lArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.045, -0.17, 0.04),
    new THREE.Vector3(-0.015, -0.29, 0.13),
    new THREE.Vector3(-0.072, -0.335, 0.19),
  ]);
  const lSleeve = new THREE.Mesh(
    createLoftedTubeGeo(lArmCurve, (u) => THREE.MathUtils.lerp(0.056, 0.040, u), 18, 12, 0.06),
    greenFeltMat
  );
  lSleeve.castShadow = true;
  leftArm.add(lSleeve);

  const lHand = createSculptedHand(skinMat, 0.85, false);
  lHand.position.set(-0.082, -0.322, 0.215);
  lHand.rotation.set(0.14, -0.25, -0.12);
  leftArm.add(lHand);

  // Braț drept întins înainte, între elf și partea din față a saniei (clopoțelul e jos, nu acoperă fața!)
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.18, 0.49, 0.01);
  bodyGroup.add(rightArm);

  const rArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.07, -0.14, 0.12),
    new THREE.Vector3(-0.04, -0.17, 0.27),
    new THREE.Vector3(-0.02, -0.13, 0.39),
  ]);
  const rSleeve = new THREE.Mesh(
    createLoftedTubeGeo(rArmCurve, (u) => THREE.MathUtils.lerp(0.056, 0.040, u), 18, 12, 0.06),
    greenFeltMat
  );
  rSleeve.castShadow = true;
  rightArm.add(rSleeve);

  const rHand = createSculptedHand(skinMat, 0.85, true);
  rHand.position.set(-0.02, -0.12, 0.42);
  rHand.rotation.set(0.25, 0.0, 0.0);
  rightArm.add(rHand);

  // Clopoțel festiv realist de Crăciun ținut în față, între elf și bordul saniei
  const handBellGroup = new THREE.Group();
  handBellGroup.position.set(-0.02, -0.09, 0.44);
  handBellGroup.rotation.set(0.22, 0.0, -0.12);

  // Mâner strunjit din lemn închis
  const handlePts = [
    new THREE.Vector2(0.011, 0.0),
    new THREE.Vector2(0.014, 0.025),
    new THREE.Vector2(0.010, 0.055),
    new THREE.Vector2(0.016, 0.082),
    new THREE.Vector2(0.011, 0.098),
    new THREE.Vector2(0.001, 0.104),
  ];
  const handleMesh = new THREE.Mesh(
    new THREE.LatheGeometry(handlePts, 16),
    new THREE.MeshStandardMaterial({ color: 0x3b1808, roughness: 0.42, metalness: 0.08 })
  );
  handleMesh.position.y = -0.025;
  handBellGroup.add(handleMesh);

  // Corpul clopoțelului din alamă aurie lustruită (profil clasic evazat în formă de clopot)
  const bellPts = [
    new THREE.Vector2(0.002, 0.0),
    new THREE.Vector2(0.022, 0.004),
    new THREE.Vector2(0.032, 0.022),
    new THREE.Vector2(0.038, 0.052),
    new THREE.Vector2(0.052, 0.084),
    new THREE.Vector2(0.072, 0.104),
    new THREE.Vector2(0.078, 0.112),
    new THREE.Vector2(0.068, 0.114),
    new THREE.Vector2(0.062, 0.102),
  ];
  const shinyBrassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf6c436,
    roughness: 0.16,
    metalness: 0.94,
    clearcoat: 0.6,
    side: THREE.DoubleSide,
  });
  const bellBody = new THREE.Mesh(new THREE.LatheGeometry(bellPts, 28), shinyBrassMat);
  bellBody.position.y = 0.065;
  bellBody.castShadow = true;
  handBellGroup.add(bellBody);

  // Limba / bila clopoțelului vizibilă în deschidere
  const clapperStem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.075, 8), shinyBrassMat);
  clapperStem.position.y = 0.14;
  handBellGroup.add(clapperStem);

  const clapperBall = new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 12), shinyBrassMat);
  clapperBall.position.y = 0.178;
  handBellGroup.add(clapperBall);

  // Fundiță roșie de catifea + frunzulițe de brad și bobiță roșie la baza clopoțelului
  const ribbonRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.42 });
  const hollyGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });

  [-0.026, 0.026].forEach((ox) => {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.007, 8, 14), ribbonRedMat);
    loop.position.set(ox, 0.074, 0.024);
    loop.rotation.y = ox > 0 ? 0.35 : -0.35;
    handBellGroup.add(loop);

    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.020, 8, 8), hollyGreenMat);
    leaf.scale.set(1.3, 0.45, 0.6);
    leaf.position.set(ox * 1.1, 0.088, 0.026);
    leaf.rotation.z = ox > 0 ? 0.45 : -0.45;
    handBellGroup.add(leaf);
  });

  const bellBerry = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 10), ribbonRedMat);
  bellBerry.position.set(0, 0.082, 0.032);
  handBellGroup.add(bellBerry);

  rightArm.add(handBellGroup);

  return { elf, bodyGroup, headGroup, rightArm, leftArm, hatBell };
}

/**
 * Sac festiv bogat cu cadouri și jucării pe bancheta din spate:
 * - Catifea vișinie bogată cu textură de iută/broderie, emblemă aurie, șnur împletit cu ciucuri
 * - Crenguță de brad cu bobițe roșii prinsă la nod
 * - Ursuleț de pluș 3D, trompetă aurie de jucărie, cutii variate (pătrate + cutie rotundă de pălării),
 *   globuri metalice și acadele bastonaș
 */
export function createGiftSack() {
  const sackGroup = new THREE.Group();
  sackGroup.name = 'GiftSack';

  const burlapTex = createBurlapTextures();
  const sackMat = new THREE.MeshPhysicalMaterial({
    color: 0x8f1d28,
    map: burlapTex.map,
    bumpMap: burlapTex.bumpMap,
    bumpScale: 0.05,
    roughness: 0.88,
    metalness: 0.04,
    sheen: 0.45,
    sheenColor: new THREE.Color(0xd94654),
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf5b942,
    roughness: 0.24,
    metalness: 0.88,
  });

  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.55,
    metalness: 0.45,
  });

  // Corp organic al sacului cu pliuri adânci și umflături de la jucării
  const sackGeo = new THREE.SphereGeometry(0.60, 48, 36);
  const pos = sackGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const angle = Math.atan2(z, x);
    if (y < -0.15) {
      const flat = Math.min(1, (-y - 0.15) / 0.45);
      y = THREE.MathUtils.lerp(y, -0.35, flat * 0.68);
      x *= 1 + flat * 0.18;
      z *= 1 + flat * 0.13;
    } else if (y > 0.20) {
      const cinch = (y - 0.20) / 0.40;
      const pinch = 1 - cinch * 0.40;
      x *= pinch;
      z *= pinch;
    }

    const folds = Math.sin(angle * 8.0 + y * 3.0) * 0.032 + Math.cos(angle * 13.0) * 0.016;
    const bulge = Math.sin(x * 6.0 + z * 5.2) * Math.cos(y * 5.0) * 0.038;

    x *= 1.22 + folds + bulge;
    z *= 0.94 + folds + bulge;
    y *= 1.06;

    pos.setXYZ(i, x, y, z);
  }
  sackGeo.computeVertexNormals();

  const sackBody = new THREE.Mesh(sackGeo, sackMat);
  sackBody.position.set(0, 0.48, 0);
  sackBody.castShadow = true;
  sackBody.receiveShadow = true;
  sackGroup.add(sackBody);

  // Șnur auriu dublu împletit + nod + ciucuri atârnând pe spate/lateral
  [0.97, 1.02].forEach((yPos, idx) => {
    const rope = new THREE.Mesh(new THREE.TorusGeometry(0.41 - idx * 0.015, 0.03, 12, 36), ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.set(0, yPos, 0);
    sackGroup.add(rope);
  });

  // Ciucuri aurii atârnând de șnur (în spate și laterale)
  [-0.14, 0.14].forEach((ox) => {
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ox * 0.3, 0.99, -0.40),
      new THREE.Vector3(ox * 1.1, 0.84, -0.48),
      new THREE.Vector3(ox * 1.4, 0.66, -0.50),
    ]);
    const cord = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 14, 0.016, 8, false), ropeMat);
    sackGroup.add(cord);

    const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.12, 12), goldMat);
    tassel.position.set(ox * 1.4, 0.60, -0.50);
    sackGroup.add(tassel);
  });

  // Crenguță de brad cu bobițe roșii prinsă la șnurul sacului
  const hollyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
  const berryMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.18, clearcoat: 1 });
  [-0.08, 0, 0.08].forEach((ox, idx) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), hollyMat);
    leaf.scale.set(1.4, 0.45, 0.7);
    leaf.position.set(ox, 0.99, -0.43);
    leaf.rotation.z = (idx - 1) * 0.45;
    sackGroup.add(leaf);
  });
  [
    [-0.025, 1.01, -0.45],
    [0.025, 1.00, -0.455],
    [0.0, 0.97, -0.46],
  ].forEach(([bx, by, bz]) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), berryMat);
    b.position.set(bx, by, bz);
    sackGroup.add(b);
  });

  // Gulerul ondulat deschis cu bordură aurie care urmărește exact unda (zero clipping!)
  const flareGeo = new THREE.CylinderGeometry(0.55, 0.39, 0.24, 48, 4, true);
  const fPos = flareGeo.attributes.position;
  for (let i = 0; i < fPos.count; i++) {
    const x = fPos.getX(i), y = fPos.getY(i), z = fPos.getZ(i);
    const a = Math.atan2(z, x);
    const wave = 1 + Math.sin(a * 9) * 0.06 * ((y + 0.12) / 0.24);
    fPos.setXYZ(i, x * wave, y, z * wave);
  }
  flareGeo.computeVertexNormals();
  const sackFlareMat = sackMat.clone();
  sackFlareMat.side = THREE.DoubleSide;
  const sackFlare = new THREE.Mesh(flareGeo, sackFlareMat);
  sackFlare.position.set(0, 1.09, 0);
  sackGroup.add(sackFlare);

  const rimPts = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r = 0.55 * (1 + Math.sin(a * 9) * 0.06);
    rimPts.push(new THREE.Vector3(Math.cos(a) * r, 1.21, Math.sin(a) * r));
  }
  const rimCurve = new THREE.CatmullRomCurve3(rimPts, true);
  const goldTrimRim = new THREE.Mesh(new THREE.TubeGeometry(rimCurve, 96, 0.02, 10, true), goldMat);
  sackGroup.add(goldTrimRim);

  // Hârtii festive variate
  const paperRed = createWrappingPaperTexture('#b91c1c', '#fde047', 'dots');
  const paperGreen = createWrappingPaperTexture('#15803d', '#fca5a5', 'plaid');
  const paperBlue = createWrappingPaperTexture('#1d4ed8', '#e0f2fe', 'stripes');
  const paperGold = createWrappingPaperTexture('#d97706', '#fef3c7', 'dots');
  const paperPurple = createWrappingPaperTexture('#7e22ce', '#fde047', 'stripes');
  const paperTeal = createWrappingPaperTexture('#0f766e', '#fde68a', 'plaid');
  const tagMat = new THREE.MeshStandardMaterial({ color: 0xfefce8, roughness: 0.85 });

  function makeGiftBox(w, h, d, paperTex, ribbonHex) {
    const gift = new THREE.Group();
    const boxMat = new THREE.MeshPhysicalMaterial({
      map: paperTex,
      roughness: 0.34,
      metalness: 0.08,
      clearcoat: 0.42,
    });
    const ribMat = new THREE.MeshStandardMaterial({
      color: ribbonHex,
      roughness: 0.22,
      metalness: 0.72,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxMat);
    box.castShadow = true;
    box.receiveShadow = true;
    gift.add(box);

    const rib1 = new THREE.Mesh(new THREE.BoxGeometry(w + 0.012, h + 0.012, d * 0.18), ribMat);
    const rib2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.18, h + 0.012, d + 0.012), ribMat);
    gift.add(rib1, rib2);

    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.013, 8, 16), ribMat);
      loop.position.set(Math.cos(a) * 0.036, h / 2 + 0.032, Math.sin(a) * 0.036);
      loop.rotation.y = -a;
      loop.rotation.x = 0.45;
      gift.add(loop);
    }

    // Etichetă mică de cadou
    const tag = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.006, 0.042), tagMat);
    tag.position.set(w * 0.22, h / 2 + 0.012, d * 0.18);
    tag.rotation.y = 0.4;
    gift.add(tag);

    return gift;
  }

  // Cutie rotundă festivă (hatbox)
  function makeRoundGift(r, h, paperTex, ribbonHex) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, h, 24),
      new THREE.MeshPhysicalMaterial({ map: paperTex, roughness: 0.35, clearcoat: 0.4 })
    );
    body.castShadow = true;
    g.add(body);

    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.06, r * 1.06, h * 0.24, 24),
      new THREE.MeshStandardMaterial({ color: ribbonHex, roughness: 0.25, metalness: 0.65 })
    );
    lid.position.y = h * 0.42;
    g.add(lid);

    const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.042, 0.012, 32, 8), goldMat);
    bow.position.y = h * 0.58;
    g.add(bow);
    return g;
  }

  // Ursuleț de pluș 3D care se ițește din sac!
  function makeTeddyBear() {
    const bear = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xa1622f, roughness: 0.95 });
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0xe6c29f, roughness: 0.9 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3 });
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 18), furMat);
    head.castShadow = true;
    bear.add(head);

    [-0.088, 0.088].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 12), furMat);
      ear.position.set(ex, 0.09, -0.01);
      bear.add(ear);
    });

    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 12), snoutMat);
    muzzle.scale.set(1.1, 0.85, 0.9);
    muzzle.position.set(0, -0.025, 0.095);
    bear.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), darkMat);
    nose.position.set(0, -0.012, 0.135);
    bear.add(nose);

    [-0.04, 0.04].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), darkMat);
      eye.position.set(ex, 0.028, 0.10);
      bear.add(eye);
    });

    // Papion roșu
    [-0.032, 0.032].forEach((bx) => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.055, 8), bowMat);
      wing.rotation.z = bx > 0 ? Math.PI / 2 : -Math.PI / 2;
      wing.position.set(bx, -0.105, 0.06);
      bear.add(wing);
    });

    // Lăbuțe pe marginea sacului
    [-0.10, 0.10].forEach((px) => {
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), furMat);
      paw.scale.set(1, 0.8, 1.2);
      paw.position.set(px, -0.13, 0.09);
      bear.add(paw);
    });

    return bear;
  }

  // Trompetă aurie de jucărie care iese din sac
  function makeToyTrumpet() {
    const trumpet = new THREE.Group();
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.34, 12), goldMat);
    tube.position.y = 0.17;
    trumpet.add(tube);

    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.12, 18, 1, true), goldMat);
    bell.rotation.x = Math.PI;
    bell.position.y = 0.36;
    trumpet.add(bell);

    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 8, 16), goldMat);
    loop.position.set(0.035, 0.16, 0);
    trumpet.add(loop);

    return trumpet;
  }

  // Aranjament bogat și aerisit de cadouri și jucării (spațiate curat, fără clipping!)
  const g1 = makeGiftBox(0.23, 0.24, 0.21, paperRed, 0xfacc15);
  g1.position.set(-0.20, 1.25, 0.15);
  g1.rotation.set(0.10, 0.32, 0.12);
  sackGroup.add(g1);

  const g2 = makeGiftBox(0.23, 0.34, 0.21, paperGreen, 0xdc2626);
  g2.position.set(0.22, 1.29, -0.15);
  g2.rotation.set(-0.08, -0.25, -0.10);
  sackGroup.add(g2);

  const roundBox = makeRoundGift(0.115, 0.25, paperTeal, 0xfacc15);
  roundBox.position.set(-0.02, 1.33, -0.23);
  roundBox.rotation.set(-0.12, 0.2, 0.06);
  sackGroup.add(roundBox);

  const g4 = makeGiftBox(0.19, 0.26, 0.19, paperPurple, 0xfde047);
  g4.position.set(-0.24, 1.28, -0.13);
  g4.rotation.set(-0.10, 0.18, 0.12);
  sackGroup.add(g4);

  // Ursulețul de pluș privind vesel din partea dreaptă-față a sacului
  const teddy = makeTeddyBear();
  teddy.position.set(0.18, 1.35, 0.20);
  teddy.rotation.set(-0.08, 0.22, -0.05);
  sackGroup.add(teddy);

  // Trompeta aurie ieșind curat pe lateral-stânga
  const trumpet = makeToyTrumpet();
  trumpet.position.set(-0.37, 1.15, 0.01);
  trumpet.rotation.set(-0.06, 0.15, 0.42);
  sackGroup.add(trumpet);

  // Două acadele bastonaș lucioase pe marginile opuse
  const caneCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.38, 0),
    new THREE.Vector3(0.06, 0.47, 0),
    new THREE.Vector3(0.14, 0.44, 0),
    new THREE.Vector3(0.15, 0.36, 0),
  ]);
  const caneMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, clearcoat: 1 });
  const redStripeMat = new THREE.MeshPhysicalMaterial({ color: 0xdc2626, roughness: 0.15, clearcoat: 1 });

  [
    { pos: [0.38, 1.12, 0.05], rot: [0.04, -0.2, -0.34] },
    { pos: [-0.34, 1.12, 0.22], rot: [0.06, 2.75, -0.30] },
  ].forEach(({ pos: pPos, rot }) => {
    const cane = new THREE.Mesh(new THREE.TubeGeometry(caneCurve, 24, 0.024, 10, false), caneMat);
    cane.position.set(...pPos);
    cane.rotation.set(...rot);
    for (let i = 0; i < 7; i++) {
      const p = caneCurve.getPoint(0.12 + i * 0.125);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 8, 14), redStripeMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(p);
      cane.add(ring);
    }
    sackGroup.add(cane);
  });

  // Globuri metalice lucioase așezate curat în spațiile libere
  [
    { pos: [-0.01, 1.24, 0.34], col: 0xfacc15 },
    { pos: [0.34, 1.24, -0.04], col: 0xef4444 },
    { pos: [-0.02, 1.26, 0.02], col: 0x22c55e },
  ].forEach(({ pos: bPos, col }) => {
    const bauble = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 16, 16),
      new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.12, metalness: 0.85, clearcoat: 1 })
    );
    bauble.position.set(...bPos);
    sackGroup.add(bauble);
  });

  // Cadouri suplimentare stivuite elegant lângă sac pe bancheta din spate
  const sideGiftLeft = makeGiftBox(0.30, 0.24, 0.28, paperGold, 0xb91c1c);
  sideGiftLeft.position.set(-0.62, 0.12, 0.16);
  sideGiftLeft.rotation.y = 0.32;
  sackGroup.add(sideGiftLeft);

  const sideGiftLeftTop = makeGiftBox(0.20, 0.18, 0.20, paperRed, 0xf8fafc);
  sideGiftLeftTop.position.set(-0.62, 0.33, 0.15);
  sideGiftLeftTop.rotation.y = -0.22;
  sackGroup.add(sideGiftLeftTop);

  const sideGiftRight = makeGiftBox(0.28, 0.28, 0.26, paperBlue, 0xfacc15);
  sideGiftRight.position.set(0.62, 0.14, 0.14);
  sideGiftRight.rotation.y = -0.42;
  sackGroup.add(sideGiftRight);

  const sideRoundRight = makeRoundGift(0.11, 0.18, paperGreen, 0xdc2626);
  sideRoundRight.position.set(0.60, 0.37, 0.14);
  sackGroup.add(sideRoundRight);

  return sackGroup;
}
