
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
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
  private mesh!: THREE.Mesh;
  private particles!: THREE.Points;

  private animationId: number | null = null;
  private mouseStopTimer: any;

 
  private frameCount = 0;

  private isMouseMoving = false;
  private mouseX = 0;
  private mouseY = 0;

  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.initScene();
    this.animate();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private initScene(): void {
    if (!this.isBrowser || !this.canvasRef) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.z = 4.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load(
      'assets/textures/earth-map.jpg'
    );

    const bumpTexture = textureLoader.load(
      'assets/textures/earth-bump.jpg'
    );

    const geometry = new THREE.SphereGeometry(
      1.45,
      64,
      64
    );

    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      normalMap: bumpTexture,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughness: 0.8,
      metalness: 0.1
    });

    this.mesh = new THREE.Mesh(
      geometry,
      material
    );

    this.scene.add(this.mesh);

    const cloudTexture = textureLoader.load(
      'assets/textures/earth-clouds.jpg'
    );

    const cloudGeometry = new THREE.SphereGeometry(
      1.48,
      64,
      64
    );

    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    this.clouds = new THREE.Mesh(
      cloudGeometry,
      cloudMaterial
    );

    this.scene.add(this.clouds);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      0.22
    );
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      0xffffff,
      2.8
    );

    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    const blueLight = new THREE.PointLight(
      0x00d4ff,
      1.8,
      20
    );

    blueLight.position.set(-3, 1, 4);
    this.scene.add(blueLight);


  }

  private animate = (): void => {
    if (
      !this.isBrowser ||
      typeof requestAnimationFrame === 'undefined' ||
      !this.renderer ||
      !this.scene ||
      !this.camera ||
      !this.mesh
    ) {
      return;
    }

    this.animationId = requestAnimationFrame(
      this.animate
    );

    if (this.isMouseMoving) {
      const fullRotationY = this.mouseX * Math.PI;
      const fullRotationX = this.mouseY * Math.PI;

      this.mesh.rotation.y +=
        (fullRotationY - this.mesh.rotation.y) * 0.08;

      this.mesh.rotation.x +=
        (fullRotationX - this.mesh.rotation.x) * 0.08;
    } else {
      this.mesh.rotation.y += 0.004;
      this.mesh.rotation.x += 0.001;
    }

    if (this.clouds) {
      this.clouds.rotation.y =
        this.mesh.rotation.y + 0.15;

      this.clouds.rotation.x =
        this.mesh.rotation.x;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }

    this.frameCount++;

    

    this.renderer.render(
      this.scene,
      this.camera
    );
  };

  private onMouseMove = (
    event: MouseEvent
  ): void => {
    if (!this.isBrowser) {
      return;
    }

    this.mouseX =
      (event.clientX / window.innerWidth - 0.5) * 2;

    this.mouseY =
      (event.clientY / window.innerHeight - 0.5) * 2;

    this.isMouseMoving = true;

    if (this.mouseStopTimer) {
      clearTimeout(this.mouseStopTimer);
    }

    this.mouseStopTimer = setTimeout(() => {
      this.isMouseMoving = false;
    }, 700);
  };

  private onResize = (): void => {
    if (
      !this.isBrowser ||
      !this.camera ||
      !this.renderer
    ) {
      return;
    }

    this.camera.aspect =
      window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  };



  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    if (
      this.animationId !== null &&
      typeof cancelAnimationFrame !== 'undefined'
    ) {
      cancelAnimationFrame(
        this.animationId
      );

      this.animationId = null;
    }

    if (this.mouseStopTimer) {
      clearTimeout(this.mouseStopTimer);
      this.mouseStopTimer = null;
    }

    window.removeEventListener(
      'resize',
      this.onResize
    );

    window.removeEventListener(
      'mousemove',
      this.onMouseMove
    );

    this.disposeThreeResources();
  }

  private disposeThreeResources(): void {
    if (!this.scene) {
      return;
    }

    this.scene.traverse(
      (object: THREE.Object3D) => {
        const mesh = object as THREE.Mesh;

        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(
              material => material.dispose()
            );
          } else {
            mesh.material.dispose();
          }
        }
      }
    );

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

