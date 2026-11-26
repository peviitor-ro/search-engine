import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import santaHeadUrl from "../assets/textures/santa-head.png";
import elfHeadUrl from "../assets/textures/elf-head.png";
import { createChristmasSleigh } from "./sleigh/ChristmasSleighComponent.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
    renderer.toneMappingExposure = 1.1;

    // Canvas extins cu +30% pe toate laturile (overflow transparent) ca sania să nu fie tăiată la rotire/zoom
    const CANVAS_BLEED = 1.6;
    const canvasHost = document.createElement("div");
    canvasHost.style.position = "absolute";
    canvasHost.style.inset = "-30%";
    canvasHost.style.width = "160%";
    canvasHost.style.height = "160%";
    canvasHost.style.pointerEvents = "none";

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvasHost.appendChild(canvas);
    container.appendChild(canvasHost);
    container.style.cursor = "grab";

    const scene = new THREE.Scene();

    // Subtle PBR environment reflections for lacquered wood, brass & velvet
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.42;
    pmremGenerator.dispose();

    // FOV compensat matematic pentru CANVAS_BLEED=1.6 (păstrează exact aceeași dimensiune vizuală, fără tăiere la margini)
    const baseFovRad = THREE.MathUtils.degToRad(36);
    const bleedFovDeg = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(baseFovRad / 2) * CANVAS_BLEED)
    );
    const camera = new THREE.PerspectiveCamera(bleedFovDeg, 376 / 251, 0.1, 60);
    camera.position.set(-0.05, 1.7, 9.5);
    camera.lookAt(-0.12, 0.32, 0);

    // Warm festive studio lighting
    const hemiLight = new THREE.HemisphereLight(0xeef4ff, 0x2b3345, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e8, 1.9);
    keyLight.position.set(5.5, 8.5, 7.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7dcff, 1.0);
    rimLight.position.set(-6.0, 4.5, -5.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffe4cc, 0.65);
    fillLight.position.set(-2.0, -1.0, 5.2);
    scene.add(fillLight);

    // Mount reusable 3D Christmas Sleigh component inside hero rig
    const rig = new THREE.Group();
    scene.add(rig);

    const christmasSleigh = createChristmasSleigh({
      includeCabinLight: true,
      includeGoldTrail: !prefersReducedMotion,
      animateMotion: false, // flight hover is driven by the hero rig below
      animateCharacters: !prefersReducedMotion,
      backSignText: "JOBURI LA SAC!",
      santaHeadUrl,
      elfHeadUrl
    });

    // Align sleigh (+Z forward -> +X rightward, matching hero flight direction)
    christmasSleigh.group.rotation.y = Math.PI / 2;
    christmasSleigh.group.position.set(0.14, -1.14, 0);
    christmasSleigh.group.scale.setScalar(1.32);
    rig.add(christmasSleigh.group);

    // Dynamic base pose (3/4 echilibrat spre dreapta la destinație, ambele personaje vizibile)
    const baseRotY = -0.84;
    const baseRotZ = 0.09;
    const baseRotX = 0.11;
    const basePosY = -0.06;

    const updateSize = () => {
      const width = (container.clientWidth || 380) * CANVAS_BLEED;
      const height = (container.clientHeight || 270) * CANVAS_BLEED;
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

    // Parallax on scroll + interactive 3D drag (nu urmărește cursorul fără click/drag)
    const scrollState = { targetY: 0, targetX: 0, targetRotY: 0, targetRotZ: 0 };
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
      if (!drag.active) return;
      const dx = event.clientX - drag.lastX;
      const dy = event.clientY - drag.lastY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        drag.moved = true;
      }
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.rotY = clamp(drag.rotY + dx * 0.01, -Math.PI, Math.PI);
      drag.rotX = clamp(drag.rotX + dy * 0.008, -0.65, 0.65);
    };

    const handlePointerDown = (event) => {
      drag.active = true;
      drag.moved = false;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      zoom.lastInteraction = performance.now();
      container.style.cursor = "grabbing";
    };

    const handlePointerUp = () => {
      if (!drag.active) return;
      drag.active = false;
      zoom.lastInteraction = performance.now();
      container.style.cursor = "grab";
    };

    // Zoom lin cu rotița mouse-ului + revenire automată la zoom-ul inițial după 3s de inactivitate
    const zoom = {
      defaultZ: 9.5,
      targetZ: 9.5,
      currentZ: 9.5,
      lastInteraction: 0
    };
    const handleWheel = (event) => {
      event.preventDefault();
      zoom.targetZ = clamp(zoom.targetZ + event.deltaY * 0.0045, 4.6, 13.5);
      zoom.lastInteraction = performance.now();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("wheel", handleWheel, { passive: false });
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
    const startTime = performance.now();
    let prevTime = startTime;
    let rafId = null;

    const renderFrame = (now) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      const elapsed = (now - startTime) / 1000;

      // 1) Entrance animation: Desktop sweeps from behind logo & reveals hero text
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

        // Intră din profil complet (rig.rotY ~ 0) și se întoarce lin la destinație spre 3/4 ca să se vadă ambele personaje
        introRotZ = -0.18 * Math.sin(p * Math.PI);
        introRotY = 0.84 * Math.pow(1 - t, 1.3);

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
        introRotZ = -0.22 * rem;
        introRotY = 0.84 * rem;
        introScale = 0.65 + 0.35 * easeOut;
      }

      if (!drag.active) {
        drag.rotY *= 0.94;
        drag.rotX *= 0.94;
      }

      // 2) Continuous 3D flight hover + scroll parallax + pointer depth
      const bobY = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.9) * 0.12;
      const bobRotZ = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.5) * 0.04;

      const targetX = prefersReducedMotion ? 0 : scrollState.targetX;
      const targetY =
        basePosY + (prefersReducedMotion ? 0 : scrollState.targetY);
      const targetRotY =
        baseRotY +
        (prefersReducedMotion ? 0 : scrollState.targetRotY) +
        drag.rotY;
      const targetRotX = baseRotX + drag.rotX;
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

      // Zoom lin pe camera Z + revenire automată după 3s fără interacțiune
      if (drag.active) {
        zoom.lastInteraction = now;
      } else if (
        zoom.targetZ !== zoom.defaultZ &&
        now - zoom.lastInteraction >= 3000
      ) {
        zoom.targetZ = zoom.defaultZ;
      }
      zoom.currentZ += (zoom.targetZ - zoom.currentZ) * 0.1;
      camera.position.z = zoom.currentZ;
      camera.lookAt(-0.12, 0.32, 0);

      // 3) Update reusable sleigh (reins, camera-facing heads, golden snowflake trail, lanterns)
      christmasSleigh.update(prefersReducedMotion ? 0 : dt, camera);

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
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerup", handlePointerUp);
      container.style.cursor = "";
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

      christmasSleigh.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (canvasHost.parentNode === container) {
        container.removeChild(canvasHost);
      }
    };
  }, [logoRef, heroTextRef]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Model 3D interactiv cu Moș Crăciun și elful său pe sania cu cadouri"
      className="relative overflow-visible w-[300px] h-[200px] sm:w-[340px] sm:h-[227px] md:w-[376px] md:h-[251px] mt-6 lg:mt-0 select-none"
    />
  );
};

export default SantaSleigh;
