import {
  Component,
  ElementRef,
  viewChild,
  afterNextRender,
  OnDestroy,
  inject,
  effect,
} from "@angular/core";
import { SystemService } from "../core/system.service";
import { technologies } from "../core/portfolio";
@Component({
  selector: "system-scene",
  standalone: true,
  template: `<div
      class="scene"
      #host
      role="img"
      aria-label="Interactive distributed system architecture; equivalent node controls below"
    ></div>
    <div class="scene-label">
      <span class="status-dot"></span> {{ s.state() }}
    </div>
    <div class="scene-bottom">
      <span>FIG. 01 / DISTRIBUTED SYSTEM</span
      ><span>{{ quality }} · DRAG TO EXPLORE</span>
    </div>`,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 100%;
        min-height: 440px;
      }
      .scene {
        position: absolute;
        inset: 0;
      }
      .scene-label,
      .scene-bottom {
        position: absolute;
        left: 22px;
        right: 22px;
        font: 10px monospace;
        letter-spacing: 1px;
        pointer-events: none;
      }
      .scene-label {
        top: 22px;
        color: #c5f277;
      }
      .scene-bottom {
        bottom: 22px;
        display: flex;
        justify-content: space-between;
        color: #879088;
      }
    `,
  ],
})
export class SceneComponent implements OnDestroy {
  s = inject(SystemService);
  host = viewChild.required<ElementRef<HTMLDivElement>>("host");
  quality =
    innerWidth < 650
      ? "LOW"
      : navigator.hardwareConcurrency >= 8
        ? "HIGH"
        : "MEDIUM";
  private destroyScene?: () => void;
  private update?: () => void;
  private dead = false;
  constructor() {
    effect(() => {
      this.s.failed();
      this.s.pulse();
      this.s.cameraReset();
      this.s.selected();
      this.s.reduced();
      this.update?.();
    });
    afterNextRender(() => this.init());
  }
  async init() {
    const [T, { OrbitControls }] = await Promise.all([
      import("three"),
      import("three/addons/controls/OrbitControls.js"),
    ]);
    if (this.dead) return;
    const el = this.host().nativeElement;
    let renderer: InstanceType<typeof T.WebGLRenderer>;
    try {
      renderer = new T.WebGLRenderer({
        antialias: innerWidth > 650,
        alpha: true,
      });
    } catch {
      el.innerHTML =
        '<p style="padding:100px 30px;color:#c5f277">SYSTEM CORE → Angular → Spring Boot → Redis / MySQL<br><br>Use the accessible technology controls below to explore.</p>';
      return;
    }
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 650 ? 1 : 1.6),
    );
    el.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
    const homeDistance = () => Math.max(12, 5.2 / (Math.tan(Math.PI / 9) * Math.max(el.clientWidth / Math.max(el.clientHeight, 1), 0.5)));
    camera.position.set(0, 2.5, homeDistance());
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI * 0.8;
    const group = new T.Group();
    scene.add(group);
    const grid = new T.GridHelper(18, 28, 0x293c30, 0x19241d);
    grid.position.y = -3;
    scene.add(grid);
    scene.add(new T.AmbientLight(0xffffff, 2));
    const light = new T.DirectionalLight(0xc5f277, 4);
    light.position.set(3, 6, 5);
    scene.add(light);
    const core = new T.Mesh(
      new T.IcosahedronGeometry(0.78, 1),
      new T.MeshStandardMaterial({ color: 0xc5f277, wireframe: true }),
    );
    group.add(core);
    const inner = new T.Mesh(
      new T.IcosahedronGeometry(0.45, 0),
      new T.MeshStandardMaterial({
        color: 0x799947,
        metalness: 0.5,
        roughness: 0.5,
      }),
    );
    core.add(inner);
    function label(text: string) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 80;
      const ctx = c.getContext("2d")!;
      ctx.font = "26px monospace";
      ctx.fillStyle = "#dfe6d9";
      ctx.textAlign = "center";
      ctx.fillText(text, 256, 46);
      const texture = new T.CanvasTexture(c);
      const sprite = new T.Sprite(
        new T.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        }),
      );
      sprite.scale.set(2.5, 0.39, 1);
      return sprite;
    }
    const title = label("SYSTEM CORE");
    title.position.set(0, -1, 0);
    group.add(title);
    const nodes = technologies.map((n, i) => {
      const mesh = new T.Mesh(
        new T.BoxGeometry(0.38, 0.38, 0.38),
        new T.MeshStandardMaterial({ color: 0xa7bb91, wireframe: i % 3 === 0 }),
      );
      mesh.position.set(n.x, n.y, n.z);
      mesh.userData["name"] = n.name;
      const l = label(n.name.toUpperCase());
      l.position.y = 0.5;
      mesh.add(l);
      group.add(mesh);
      return mesh;
    });
    const routePairs = [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 3],
    ];
    const routeLines = routePairs.map(([a, b], i) => {
      const l = new T.Line(
        new T.BufferGeometry().setFromPoints([
          nodes[a].position,
          nodes[b].position,
        ]),
        new T.LineBasicMaterial({ color: i === 3 ? 0xe8977d : 0x7e995d }),
      );
      l.visible = i !== 3;
      group.add(l);
      return l;
    });
    const links = nodes.map((n) => {
      const l = new T.Line(
        new T.BufferGeometry().setFromPoints([new T.Vector3(), n.position]),
        new T.LineBasicMaterial({ color: 0x3c5140 }),
      );
      group.add(l);
      return l;
    });
    const packets = nodes.map(() => {
      const p = new T.Mesh(
        new T.SphereGeometry(0.055, 6, 6),
        new T.MeshBasicMaterial({ color: 0xc5f277 }),
      );
      group.add(p);
      return p;
    });
    const ray = new T.Raycaster();
    const mouse = new T.Vector2();
    let downX = 0,
      downY = 0,
      visible = true,
      frame = 0,
      last = 0,
      burst = 0,
      drag: (typeof nodes)[number] | undefined;
    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      if (!this.s.play() && !this.s.selected()) camera.position.z = homeDistance();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    io.observe(el);
    const pick = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        (-(e.clientY - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(mouse, camera);
      return ray.intersectObjects([core, ...nodes], false)[0]?.object;
    };
    const down = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      const o = pick(e);
      if (e.shiftKey && o?.userData["name"] === "Redis") {
        drag = o as (typeof nodes)[number];
        controls.enabled = false;
        renderer.domElement.setPointerCapture(e.pointerId);
      }
    };
    const move = (e: PointerEvent) => {
      if (drag) {
        drag.position.x += (e.clientX - downX) * 0.012;
        downX = e.clientX;
        links[2].geometry.setFromPoints([new T.Vector3(), drag.position]);
        return;
      }
      const o = pick(e);
      renderer.domElement.style.cursor = o ? "pointer" : "grab";
      nodes.forEach((n, i) => {
        n.scale.setScalar(o === n ? 1.3 : 1);
        links[i].material.color.set(o === n ? 0xc5f277 : 0x3c5140);
      });
    };
    const up = (e: PointerEvent) => {
      if (drag) {
        if (Math.abs(drag.position.x - 1.7) > 1) this.s.breakRedis();
        drag.position.set(1.7, -1.3, 1);
        links[2].geometry.setFromPoints([new T.Vector3(), drag.position]);
        drag = undefined;
        controls.enabled = true;
        return;
      }
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const o = pick(e);
      if (o === core) this.s.reset();
      else if (o) this.s.selected.set(o.userData["name"]);
    };
    const focus = () => {
      const n = nodes.find((n) => n.userData["name"] === this.s.selected());
      if (n) {
        controls.target.copy(n.position);
        camera.position.copy(n.position).add(new T.Vector3(0, 1, 8));
      }
    };
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,textarea,select")) return;
      if (e.key === "Escape") {
        controls.target.set(0, 0, 0);
        camera.position.set(0, 2.5, homeDistance());
      }
      if (
        this.s.play() &&
        [
          "w",
          "a",
          "s",
          "d",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        e.preventDefault();
        camera.position.x += ["a", "ArrowLeft"].includes(e.key)
          ? -0.3
          : ["d", "ArrowRight"].includes(e.key)
            ? 0.3
            : 0;
        camera.position.z += ["w", "ArrowUp"].includes(e.key)
          ? -0.3
          : ["s", "ArrowDown"].includes(e.key)
            ? 0.3
            : 0;
        camera.position.clamp(
          new T.Vector3(-8, -5, 5),
          new T.Vector3(8, 9, 17),
        );
      }
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("dblclick", focus);
    window.addEventListener("keydown", key);
    let lastReset = this.s.cameraReset();
    this.update = () => {
      burst = performance.now();
      nodes[2].material.color.set(this.s.failed() ? 0xe8977d : 0xa7bb91);
      links[2].visible = !this.s.failed();
      routeLines[1].visible = !this.s.failed();
      routeLines[2].visible = !this.s.failed();
      routeLines[3].visible = this.s.failed();
      if (lastReset !== this.s.cameraReset()) {
        lastReset = this.s.cameraReset();
        controls.target.set(0, 0, 0);
        camera.position.set(0, 2.5, homeDistance());
      }
    };
    this.update();
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (
        !visible ||
        document.hidden ||
        time - last < (innerWidth < 650 ? 33 : 16)
      )
        return;
      last = time;
      controls.enableZoom = this.s.play();
      controls.update();
      const active = time - burst < 2200 && !this.s.reduced();
      packets.forEach((p, i) => {
        const path = this.s.failed()
          ? [0, 1, 3, 1, 0]
          : this.s.requests() % 3 === 0
            ? [0, 1, 2, 3, 2, 1, 0]
            : [0, 1, 2, 1, 0];
        const progress =
          Math.min(0.999, (time - burst) / 2200) * (path.length - 1);
        const segment = Math.floor(progress);
        p.visible = active && i === 0;
        if (p.visible)
          p.position.lerpVectors(
            nodes[path[segment]].position,
            nodes[path[segment + 1]].position,
            progress - segment,
          );
      });
      if (active) core.rotation.y += 0.012;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);
    this.destroyScene = () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("dblclick", focus);
      window.removeEventListener("keydown", key);
      scene.traverse((o) => {
        if (o instanceof T.Mesh || o instanceof T.Line) {
          o.geometry.dispose();
          const materials = Array.isArray(o.material)
            ? o.material
            : [o.material];
          materials.forEach((m) => m.dispose());
        }
        if (o instanceof T.Sprite) {
          o.material.map?.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }
  ngOnDestroy() {
    this.dead = true;
    this.destroyScene?.();
  }
}
