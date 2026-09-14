import { Component, inject, signal } from "@angular/core";
import { SystemService } from "../core/system.service";
@Component({
  selector: "engineering-lab",
  standalone: true,
  template: ` <div class="section-top">
      <div>
        <p class="eyebrow">03 / THE ENGINEERING LAB</p>
        <h2>
          Good systems break.<br /><span>Great engineers investigate.</span>
        </h2>
      </div>
      <span class="tag">INTERACTIVE SIMULATIONS</span>
    </div>
    <div class="lab-tabs" role="tablist" aria-label="Engineering simulations">
      @for (t of tabs; track t; let i = $index) {
        <button
          role="tab"
          [attr.aria-selected]="tab() === i"
          (click)="tab.set(i)"
        >
          {{ "0" + (i + 1) }} / {{ t }}
        </button>
      }
    </div>
    <div class="lab-panel">
      <div>
        <p class="eyebrow">{{ tabs[tab()] }} / SANDBOX</p>
        @if (tab() === 0) {
          <h3>What happens after<br />you hit send?</h3>
          <p>
            Trace a request through the application. Every third request misses
            the cache and takes the database path.
          </p>
          <button class="primary" (click)="s.request()">
            Send API request ↗
          </button>
        }
        @if (tab() === 1) {
          <h3>A cache goes down.<br />Traffic keeps coming.</h3>
          <p>
            Take Redis offline, increase traffic, then apply three defenses to
            restore stability.
          </p>
          <button class="primary" (click)="s.breakRedis()">
            Break Redis ↗
          </button>
          <div class="chips">
            @for (n of [10000, 50000, 100000, 500000, 1000000]; track n) {
              <button [disabled]="!s.failed()" (click)="s.setTraffic(n)">
                {{ n / 1000 }}K
              </button>
            }
          </div>
          <div class="repair">
            @for (
              p of ["Rate limiting", "Request coalescing", "Cache recovery"];
              track p
            ) {
              <button
                [disabled]="!s.failed() || s.protections().includes(p)"
                (click)="s.repair(p)"
              >
                {{ s.protections().includes(p) ? "✓" : "+" }} {{ p }}
              </button>
            }
          </div>
        }
        @if (tab() === 2) {
          <h3>Five seconds.<br />Find the bottleneck.</h3>
          <p>
            Inspect the timings before choosing a fix. Which component dominates
            the response time?
          </p>
          <div class="chips">
            @for (m of metrics; track m.name) {
              <button (click)="inspect.set(m.name)">{{ m.name }}</button>
            }
          </div>
          @if (inspect()) {
            <p class="result">{{ inspect() }}: {{ timing() }}</p>
            @if (inspect() === "Database") {
              <button class="primary" (click)="optimized.set(true)">
                {{
                  optimized()
                    ? "System restored ✓"
                    : "Optimize query → add index"
                }}
              </button>
            } @else {
              <p>
                This is a small part of the latency. Keep tracing downstream.
              </p>
            }
          }
        }
        @if (tab() === 3) {
          <h3>Ship less.<br />Render sooner.</h3>
          <p>
            Heavy assets and eager code compete with the first useful screen.
            Choose a strategy to see its effect.
          </p>
          <div class="repair">
            @for (
              p of [
                "Compress assets",
                "Lazy-load WebGL",
                "Defer noncritical code",
              ];
              track p
            ) {
              <button
                (click)="optimize(p)"
                [disabled]="strategies().includes(p)"
              >
                {{ strategies().includes(p) ? "✓" : "+" }} {{ p }}
              </button>
            }
          </div>
          <p class="result">
            Illustrative transfer: {{ 2400 - strategies().length * 600 }} KB
          </p>
        }
        @if (tab() === 4) {
          <h3>One order.<br />Two different totals.</h3>
          <p>
            Trace a checkout mismatch between client-calculated pricing and the
            server order.
          </p>
          <div class="repair">
            <button (click)="orderStep.set(1)">Inspect payload</button
            ><button (click)="orderStep.set(2)">Inspect server pricing</button
            ><button (click)="orderStep.set(3)">
              Use server-authoritative totals
            </button>
          </div>
          <p class="result">
            {{
              orderStep() === 0
                ? "Begin with the request boundary."
                : orderStep() === 1
                  ? "Client total: ₹1,200 · stale discount applied"
                  : orderStep() === 2
                    ? "Server total: ₹1,400 · discount expired"
                    : "Totals reconciled ✓ · validate price and use an idempotency key"
            }}
          </p>
        }
      </div>
      <div class="console">
        <div class="console-head">
          <span><i></i><i></i><i></i></span><span>system.trace</span
          ><span>SIMULATED</span>
        </div>
        <div class="flow">
          @for (
            n of [
              "Angular",
              "Spring Boot",
              s.failed() ? "Redis ×" : "Redis",
              "MySQL",
            ];
            track n
          ) {
            <span [class.offline]="n === 'Redis ×'">{{ n }}</span>
            @if (!$last) {
              <b>↓</b>
            }
          }
        </div>
        <div class="load">
          <span>DATABASE LOAD</span><strong>{{ s.load() }}%</strong
          ><meter min="0" max="100" [value]="s.load()">{{ s.load() }}%</meter>
        </div>
        @if (s.load() === 100) {
          <p class="error">DATABASE OVERLOAD — apply defenses</p>
        }
        @if (tab() === 2 && optimized()) {
          <p class="result">
            SQL 4.2s → 180ms<br />Total API 5s → 310ms · SYSTEM RESTORED
          </p>
        }
        <div class="logs" aria-live="polite">
          @for (log of s.logs(); track $index) {
            <p><span>›</span> {{ log }}</p>
          }
        </div>
      </div>
    </div>`,
  styles: [],
})
export class PlaygroundComponent {
  s = inject(SystemService);
  tab = signal(0);
  tabs = [
    "Request flow",
    "Cache failure",
    "Latency incident",
    "Page performance",
    "Order tracing",
  ];
  inspect = signal("");
  optimized = signal(false);
  strategies = signal<string[]>([]);
  orderStep = signal(0);
  metrics = [
    { name: "Frontend", ms: "42ms" },
    { name: "Gateway", ms: "18ms" },
    { name: "Spring Boot", ms: "120ms" },
    { name: "Redis", ms: "24ms" },
    { name: "Database", ms: "4.2 seconds · missing index" },
  ];
  timing() {
    return this.optimized() && this.inspect() === "Database"
      ? "180ms"
      : this.metrics.find((m) => m.name === this.inspect())?.ms;
  }
  optimize(p: string) {
    this.strategies.update((v) => [...v, p]);
  }
}
