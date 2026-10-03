import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0718, 0.022);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Rim Lighting tuned to the artwork's coral/cyan/purple palette
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff4d5a, 3.5, 55); // Fiery Coral Red
    pointLight1.position.set(16, 12, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00e5ff, 3, 50); // Electric Cyan
    pointLight2.position.set(-16, -10, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa855f7, 2.5, 50); // Vivid Violet
    pointLight3.position.set(0, 14, -5);
    scene.add(pointLight3);

    // 1. Central 3D Harmonic Torus Knot (Soundwave sculpture)
    const torusGeo = new THREE.TorusKnotGeometry(4.5, 0.9, 140, 24, 2, 3);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x1f143d,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true,
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(12, 0, -4);
    scene.add(torusKnot);

    // Outer glowing wireframe sphere
    const sphereGeo = new THREE.IcosahedronGeometry(7, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xff4d5a,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const glowSphere = new THREE.Mesh(sphereGeo, sphereMat);
    glowSphere.position.copy(torusKnot.position);
    scene.add(glowSphere);

    // 2. Audio Waveform Ribbon (Dynamic particles in Coral, Cyan & Violet)
    const particleCount = 2200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xff4d5a); // Coral Red
    const color2 = new THREE.Color(0x00e5ff); // Electric Cyan
    const color3 = new THREE.Color(0xa855f7); // Violet
    const color4 = new THREE.Color(0xff9233); // Sunset Orange

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const u = (i / particleCount) * Math.PI * 6;
      positions[i3] = (Math.random() - 0.5) * 65;
      positions[i3 + 1] = Math.sin(u) * 5.5 + (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 35;

      const mod = i % 4;
      const mixedColor =
        mod === 0 ? color1 : mod === 1 ? color2 : mod === 2 ? color3 : color4;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Floating 3D Geometric Musical Rings
    const ringGroup = new THREE.Group();
    for (let r = 0; r < 5; r++) {
      const ringGeo = new THREE.RingGeometry(3 + r * 2.2, 3.08 + r * 2.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0xff4d5a : 0x00e5ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.16 - r * 0.02,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      ring.rotation.y = (r * Math.PI) / 8;
      ringGroup.add(ring);
    }
    ringGroup.position.set(12, 0, -4);
    scene.add(ringGroup);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0008;
      mouseY = (event.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 15;
      camera.position.y = -targetY * 15;
      camera.lookAt(0, 0, 0);

      // Rotate torus knot
      torusKnot.rotation.x = elapsedTime * 0.25;
      torusKnot.rotation.y = elapsedTime * 0.35;
      glowSphere.rotation.y = -elapsedTime * 0.15;

      // Pulse rings
      ringGroup.rotation.z = elapsedTime * 0.08;

      // Dynamic wave on particles
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = posArray[i3];
        posArray[i3 + 1] += Math.sin(elapsedTime * 1.5 + x * 0.2) * 0.02;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Orbit lights subtly
      pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 18;
      pointLight1.position.y = Math.cos(elapsedTime * 0.6) * 12;
      pointLight2.position.x = -Math.sin(elapsedTime * 0.4) * 18;
      pointLight2.position.y = -Math.cos(elapsedTime * 0.5) * 12;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden opacity-90"
      style={{
        background:
          'radial-gradient(ellipse at 75% 25%, #231448 0%, #0d0822 60%, #06040e 100%)',
      }}
    />
  );
};
