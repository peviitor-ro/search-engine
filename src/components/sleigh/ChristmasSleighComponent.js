import * as THREE from 'three';
import { createSleigh } from './sleigh.js';
import { createSanta, createElf, createGiftSack } from './characters.js';
import { createSnowflakeTexture } from './textures.js';

/**
 * Componentă Three.js reutilizabilă: Sania de Crăciun complet echipată
 * (sanie + Moș Crăciun + Elf ajutor + sac cu cadouri pe bancheta din spate).
 *
 * Exemplu de utilizare:
 *   const santaSleigh = createChristmasSleigh({ includeCabinLight: true });
 *   scene.add(santaSleigh.group);
 *   // în bucla de animație:
 *   santaSleigh.update(dt);
 */
export function createChristmasSleigh(options = {}) {
  const {
    includeCabinLight = true,
    includeGoldTrail = true,
    animateMotion = true,
    animateCharacters = true,
    backSignText = 'JOBURI LA SAC!',
    santaHeadUrl = './textures/santa-head.png',
    elfHeadUrl = './textures/elf-head.png',
  } = options;

  const root = new THREE.Group();
  root.name = 'ChristmasSleighComponent';

  const { sleigh, lanternLights, fairyBulbs } = createSleigh({ backSignText });
  root.add(sleigh);

  if (includeCabinLight) {
    const cabinWarmLight = new THREE.PointLight(0xffb85c, 1.1, 6, 1.6);
    cabinWarmLight.position.set(0, 1.85, 1.15);
    sleigh.add(cabinWarmLight);
  }

  // Moș Crăciun pe bancheta din față
  const santaRig = createSanta({ headUrl: santaHeadUrl });
  santaRig.santa.position.set(0.38, 1.03, 0.56);
  sleigh.add(santaRig.santa);

  // Elful ajutor pe bancheta din față, lângă Moș Crăciun
  const elfRig = createElf({ headUrl: elfHeadUrl });
  elfRig.elf.position.set(-0.40, 1.03, 0.58);
  elfRig.elf.rotation.y = 0.14;
  sleigh.add(elfRig.elf);

  // Sacul cu cadouri pe bancheta din spate
  const giftSack = createGiftSack();
  giftSack.position.set(0, 1.05, -1.0);
  sleigh.add(giftSack);

  // Frâie legate dinamic exact de palmele ambelor mâini ale lui Moș Crăciun (zero decalaj, zero clipping!)
  const reinMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.48 });
  const reinAnchors = [
    { hand: santaRig.rightHand, front: new THREE.Vector3(0.14, 1.42, 1.97) },
    { hand: santaRig.leftHand, front: new THREE.Vector3(0.64, 1.42, 1.97) },
  ];
  const reinMeshes = reinAnchors.map(() => {
    const m = new THREE.Mesh(new THREE.BufferGeometry(), reinMat);
    m.castShadow = true;
    sleigh.add(m);
    return m;
  });

  const _handWorld = new THREE.Vector3();
  const _handInSleigh = new THREE.Vector3();
  const _midPt = new THREE.Vector3();

  function updateReins() {
    sleigh.updateMatrixWorld(true);
    reinAnchors.forEach(({ hand, front }, idx) => {
      hand.getWorldPosition(_handWorld);
      _handInSleigh.copy(_handWorld);
      sleigh.worldToLocal(_handInSleigh);

      _midPt.lerpVectors(_handInSleigh, front, 0.52);
      _midPt.y -= 0.07; // ușoară curbură naturală a curelei de piele

      const curve = new THREE.CatmullRomCurve3([
        _handInSleigh.clone(),
        _midPt.clone(),
        front.clone(),
      ]);
      const oldGeo = reinMeshes[idx].geometry;
      reinMeshes[idx].geometry = new THREE.TubeGeometry(curve, 18, 0.015, 8, false);
      oldGeo.dispose();
    });
  }

  // Dâră delicată de fulgi rotunzi aurii (nuanță auriu-șampanie curat, fără portocaliu/flăcări)
  let trailPoints = null;
  const trailCount = 133;
  const trailPositions = new Float32Array(trailCount * 3);
  const trailAlphas = new Float32Array(trailCount);
  const trailSizes = new Float32Array(trailCount);
  const trailMeta = [];

  if (includeGoldTrail) {
    for (let i = 0; i < trailCount; i++) {
      const life = Math.random();
      const stream = i % 3;
      const startX = stream === 0 ? -0.95 : stream === 1 ? 0.95 : (Math.random() - 0.5) * 1.4;
      const startY = stream === 2 ? 0.45 + Math.random() * 0.75 : 0.12 + Math.random() * 0.28;
      const baseSize = 0.18 + Math.random() * 0.16;
      trailMeta.push({
        life,
        speed: 0.34 + Math.random() * 0.30,
        startX,
        startY,
        baseSize,
        driftX: (Math.random() - 0.5) * 0.65,
        driftY: (Math.random() - 0.35) * 0.55,
        phase: Math.random() * Math.PI * 2,
      });
      trailSizes[i] = baseSize;
      trailAlphas[i] = 1.0;
    }

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('aAlpha', new THREE.BufferAttribute(trailAlphas, 1));
    trailGeo.setAttribute('aSize', new THREE.BufferAttribute(trailSizes, 1));

    const flakeTex = createSnowflakeTexture();
    const trailMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uMap: { value: flakeTex },
        uColor: { value: new THREE.Color(0xf7dc6f) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: `
        attribute float aAlpha;
        attribute float aSize;
        varying float vAlpha;
        uniform float uPixelRatio;
        void main() {
          vAlpha = aAlpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (320.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          float alpha = tex.a * vAlpha * 0.9;
          if (alpha < 0.02) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    trailPoints = new THREE.Points(trailGeo, trailMat);
    trailPoints.name = 'GoldenSnowflakeTrail';
    root.add(trailPoints);
  }

  function updateGoldTrail(dt) {
    if (!trailPoints) return;
    const posArr = trailPoints.geometry.attributes.position.array;
    const alphaArr = trailPoints.geometry.attributes.aAlpha.array;
    const sizeArr = trailPoints.geometry.attributes.aSize.array;

    for (let i = 0; i < trailCount; i++) {
      const m = trailMeta[i];
      m.life += dt * m.speed;
      if (m.life >= 1) {
        m.life -= 1;
      }
      const t = m.life;
      const swirl = Math.sin(elapsed * 2.5 + m.phase + t * 5.0) * 0.14 * t;
      posArr[i * 3] = m.startX + m.driftX * t + swirl;
      posArr[i * 3 + 1] = sleigh.position.y + m.startY + m.driftY * t + Math.cos(elapsed * 2.0 + m.phase) * 0.08 * t;
      posArr[i * 3 + 2] = -2.02 - t * 4.2;

      const fade = Math.sin(Math.min(1, t * 5.0) * Math.PI * 0.5) * Math.pow(1 - t, 1.15);
      const twinkle = 0.82 + 0.18 * Math.sin(elapsed * 6.5 + m.phase);
      alphaArr[i] = fade * twinkle;
      sizeArr[i] = m.baseSize * (0.75 + 0.35 * (1 - t));
    }

    trailPoints.geometry.attributes.position.needsUpdate = true;
    trailPoints.geometry.attributes.aAlpha.needsUpdate = true;
    trailPoints.geometry.attributes.aSize.needsUpdate = true;
  }

  let elapsed = 0;
  const _camWorldPos = new THREE.Vector3();

  function faceHeadTowardCamera(headGroup, camera) {
    if (!camera) return;
    camera.updateMatrixWorld();
    camera.getWorldPosition(_camWorldPos);
    // Întoarce capul și fața 100% direct către utilizator din orice unghi 360° / sus / jos
    headGroup.lookAt(_camWorldPos);
  }

  function update(dt = 0.016, camera = null) {
    elapsed += dt;

    if (animateMotion) {
      sleigh.position.y = Math.sin(elapsed * 1.8) * 0.08;
      sleigh.rotation.x = Math.sin(elapsed * 1.8 - 0.4) * 0.025;
      sleigh.rotation.z = Math.sin(elapsed * 1.2) * 0.02;
    }

    if (animateCharacters) {
      // Moș Crăciun — ține hățurile cu ambele mâini, mișcare subtilă de condus
      santaRig.torsoGroup.rotation.x = Math.sin(elapsed * 1.8) * 0.025;
      const reinPull = Math.sin(elapsed * 2.2) * 0.045;
      santaRig.leftArm.rotation.x = reinPull;
      santaRig.rightArm.rotation.x = reinPull;
      santaRig.pomPom.position.y = 0.075 + Math.sin(elapsed * 3.6) * 0.015;

      // Elful ajutor (mâna stângă odihnită pe picior, mâna dreaptă sună clopoțelul în față)
      elfRig.bodyGroup.position.y = Math.abs(Math.sin(elapsed * 3.4)) * 0.015;
      elfRig.rightArm.rotation.x = Math.sin(elapsed * 6.8) * 0.12;

      // Sacul cu cadouri
      giftSack.rotation.z = Math.sin(elapsed * 1.8 + 0.6) * 0.02;
      giftSack.scale.y = 1 + Math.sin(elapsed * 3.6) * 0.012;
    }

    // Actualizăm poziția frâielor exact în palmele lui Moș Crăciun și dâra de fulgi aurii
    updateReins();
    updateGoldTrail(dt);

    // Fețele se întorc mereu direct spre utilizator, indiferent cum rotești sania
    if (camera) {
      faceHeadTowardCamera(santaRig.headGroup, camera);
      faceHeadTowardCamera(elfRig.headGroup, camera);
    }

    // Licărire caldă a felinarelor și a luminițelor
    lanternLights.forEach((light, idx) => {
      light.intensity =
        1.9 + Math.sin(elapsed * 9.0 + idx * 2.3) * 0.2 + Math.sin(elapsed * 20.0) * 0.06;
    });
    fairyBulbs.forEach(({ mesh, phase }) => {
      mesh.material.emissiveIntensity = 0.8 + Math.sin(elapsed * 3.4 + phase) * 0.35;
    });
  }

  function dispose() {
    root.traverse((obj) => {
      if (obj.isMesh || obj.isPoints) {
        obj.geometry?.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          if (!m) return;
          m.map?.dispose();
          m.bumpMap?.dispose();
          m.uniforms?.uMap?.value?.dispose();
          m.dispose();
        });
      }
    });
  }

  return {
    group: root,
    parts: { sleigh, santa: santaRig.santa, elf: elfRig.elf, giftSack },
    update,
    dispose,
  };
}
