import { Injectable, signal, computed } from "@angular/core";
@Injectable({ providedIn: "root" })
export class SystemService {
  readonly play = signal(false);
  readonly failed = signal(false);
  readonly reduced = signal(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  readonly selected = signal("");
  readonly pulse = signal(0);
  readonly cameraReset = signal(0);
  readonly requests = signal(0);
  readonly load = signal(28);
  readonly traffic = signal(10000);
  readonly logs = signal(["SYSTEM READY — select a node or send a request."]);
  readonly protections = signal<string[]>([]);
  readonly state = computed(() =>
    this.failed()
      ? "REDIS OFFLINE"
      : this.play()
        ? "PLAY MODE ACTIVE"
        : "SYSTEM OPERATIONAL",
  );
  log(message: string) {
    this.logs.update((l) => [message, ...l].slice(0, 6));
  }
  request() {
    const n = this.requests() + 1;
    this.requests.set(n);
    this.pulse.update((v) => v + 1);
    const hit = n % 3 !== 0 && !this.failed();
    this.log(
      `#${String(n).padStart(3, "0")} GET /api/projects → ${this.failed() ? "CACHE BYPASS" : hit ? "CACHE HIT" : "CACHE MISS → MySQL → cache refill"} → ${this.failed() ? "820" : hit ? "48" : "230"}ms · 200 OK`,
    );
  }
  breakRedis() {
    this.failed.set(true);
    this.load.set(92);
    this.protections.set([]);
    this.log("Redis disconnected → direct database traffic · load 92%");
  }
  setTraffic(n: number) {
    this.traffic.set(n);
    if (this.failed()) this.load.set(Math.min(100, Math.round(70 + n / 15000)));
    this.log(
      `${n.toLocaleString()} simulated requests · database load ${this.load()}%`,
    );
  }
  repair(name: string) {
    if (this.protections().includes(name)) return;
    this.protections.update((v) => [...v, name]);
    this.load.update((v) => Math.max(28, v - 24));
    this.log(name + " enabled");
    if (this.protections().length === 3) {
      this.failed.set(false);
      this.load.set(28);
      this.log("SYSTEM STABLE ✓ · cache refilled, traffic controlled");
    }
  }
  reset() {
    this.cameraReset.update(v => v + 1);
    this.failed.set(false);
    this.selected.set("");
    this.load.set(28);
    this.traffic.set(10000);
    this.protections.set([]);
    this.pulse.update((v) => v + 1);
    this.log("System reset · all simulated services healthy");
  }
}
