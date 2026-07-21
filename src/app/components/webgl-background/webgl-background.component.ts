import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-webgl-background',
  templateUrl: './webgl-background.component.html',
  styleUrls: ['./webgl-background.component.scss']
})
export class WebglBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private clouds!: THREE.Mesh;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  private mesh!: THREE.Mesh;
  private particles!: THREE.Points;
  private isMouseMoving = false;
  private mouseStopTimer: any;
 private shootingStars: THREE.Group[] = [];
private frameCount = 0;

  private mouseX = 0;
  private mouseY = 0;

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.z =4.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load('assets/textures/earth-map.jpg');
    const bumpTexture = textureLoader.load('assets/textures/earth-bump.jpg');

    const geometry = new THREE.SphereGeometry(1.45, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      roughness: 0.8,
      metalness: 0.1
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    const cloudTexture = textureLoader.load('assets/textures/earth-clouds.jpg');

    const cloudGeometry = new THREE.SphereGeometry(1.48, 64, 64);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.scene.add(this.clouds);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x00d4ff, 1.5, 20);
    blueLight.position.set(-3, 1, 4);
    this.scene.add(blueLight);
    this.createParticles();
    this.createShootingStars();
  }

  animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.isMouseMoving) {
      const fullRotationY = this.mouseX * Math.PI;
      const fullRotationX = this.mouseY * Math.PI;

      this.mesh.rotation.y += (fullRotationY - this.mesh.rotation.y) * 0.08;
      this.mesh.rotation.x += (fullRotationX - this.mesh.rotation.x) * 0.08;
    } else {
      this.mesh.rotation.y += 0.004;
      this.mesh.rotation.x += 0.001;
    }

    if (this.clouds) {
      this.clouds.rotation.y = this.mesh.rotation.y + 0.15;
      this.clouds.rotation.x = this.mesh.rotation.x;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }
     this.frameCount++;

this.shootingStars.forEach((star: any) => {
  if (star.userData.delay > 0) {
    star.userData.delay--;
    star.visible = false;
    return;
  }

  star.visible = true;

  star.position.x -= star.userData.speed;
  star.position.y -= star.userData.speed * 0.55;

  if (star.position.x < -5 || star.position.y < -3) {
    star.position.x = 4 + Math.random() * 4;
    star.position.y = 2.5 - Math.random() * 4;
    star.userData.delay = 120 + Math.random() * 160;
  }
});

    this.renderer.render(this.scene, this.camera);
  };

  onMouseMove = (event: MouseEvent): void => {
    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    this.isMouseMoving = true;

    clearTimeout(this.mouseStopTimer);

    this.mouseStopTimer = setTimeout(() => {
      this.isMouseMoving = false;
    }, 700);
  };

  onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    this.renderer.dispose();
  }
 createShootingStars(): void {
  for (let i = 0; i < 4; i++) {
    const group = new THREE.Group();

    const headGeometry = new THREE.SphereGeometry(0.045, 16, 16);

    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });

    const head = new THREE.Mesh(headGeometry, headMaterial);
    group.add(head);

    const trailGeometry = new THREE.CylinderGeometry(
      0.012,
      0.001,
      1.4,
      12
    );

    const trailMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const trail = new THREE.Mesh(trailGeometry, trailMaterial);

    trail.rotation.z = Math.PI / 2;
    trail.position.x = 0.7;

    group.add(trail);

    group.position.set(
      4 + Math.random() * 3,
      2.5 - Math.random() * 4,
      1
    );

    group.rotation.z = -0.55;

    group.userData = {
      speed: 0.055 + Math.random() * 0.035,
      delay: i * 90
    };

    this.shootingStars.push(group);
    this.scene.add(group);
  }
}

  createParticles(): void {
    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.015,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }


}