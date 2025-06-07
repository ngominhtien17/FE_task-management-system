// components/WavesParticlesBackground.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WavesParticlesBackgroundProps {
  primaryColor?: string;
}

export const WavesParticlesBackground: React.FC<WavesParticlesBackgroundProps> = ({ 
  primaryColor = "#2047b8" 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mountElement = mountRef.current;

    // Khởi tạo scene, camera và renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 1.2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    mountElement.appendChild(renderer.domElement);

    // Chuyển đổi màu sắc từ hex sang RGB
    const color = new THREE.Color(primaryColor);
    const darkColor = new THREE.Color(
      Math.max(color.r - 0.4, 0), 
      Math.max(color.g - 0.4, 0), 
      Math.max(color.b - 0.4, 0)
    );
    
    // Tạo hiệu ứng sóng đại dương
    const waveGeometry = new THREE.PlaneGeometry(5, 5, 128, 128);
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: color,
      wireframe: false,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    
    const waves = new THREE.Mesh(waveGeometry, waveMaterial);
    waves.rotation.x = -Math.PI / 2;
    waves.position.y = -0.5;
    scene.add(waves);
    
    // Tạo hạt lấp lánh
    const particlesCount = 250;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);
    const particlesSizes = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      particlesPositions[i3] = (Math.random() - 0.5) * 5;
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 2.5;
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 3;
      
      particlesSizes[i] = Math.random() * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particlesSizes, 1));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x0000FF,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(darkColor, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x003399, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(color, 1, 10, 1.5);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      frame += 0.01;
      
      // Animate waves
      const wavesPositions = waves.geometry.attributes.position;
      for (let i = 0; i < wavesPositions.count; i++) {
        const x = wavesPositions.getX(i);
        const y = wavesPositions.getY(i);
        
        // Tạo hiệu ứng sóng động
        const wave1 = 0.05 * Math.sin(x * 2 + frame);
        const wave2 = 0.08 * Math.sin(y * 2 + frame * 0.8);
        
        wavesPositions.setZ(i, wave1 + wave2);
      }
      
      wavesPositions.needsUpdate = true;
      
      // Animate particles
      const particlesPositions = particles.geometry.attributes.position;
      for (let i = 0; i < particlesPositions.count; i++) {
        const i3 = i * 3;
        
        // Animate y position softly (floating effect)
        particlesPositions.array[i3 + 1] += Math.sin(frame + i * 0.1) * 0.0015;
        
        // Reset if particle goes too high or too low
        if (particlesPositions.array[i3 + 1] > 1.5) {
          particlesPositions.array[i3 + 1] = -1.5;
        } else if (particlesPositions.array[i3 + 1] < -1.5) {
          particlesPositions.array[i3 + 1] = 1.5;
        }
        
        // Gentle horizontal movement
        particlesPositions.array[i3] += Math.sin(frame * 0.2 + i) * 0.0005;
      }
      
      particlesPositions.needsUpdate = true;
      
      // Rotate particles system very slowly
      particles.rotation.y = frame * 0.05;
      
      // Move point light in a circle
      pointLight.position.x = Math.sin(frame * 0.2) * 2;
      pointLight.position.z = Math.cos(frame * 0.2) * 2;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      waves.geometry.dispose();
      waves.material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      
      scene.remove(waves);
      scene.remove(particles);
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      scene.remove(pointLight);
      
      renderer.dispose();
    };
  }, [primaryColor]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default WavesParticlesBackground;