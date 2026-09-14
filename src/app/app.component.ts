import {
  Component,
  inject,
  signal,
  HostListener,
  afterNextRender,
  OnDestroy,
  viewChild,
  ElementRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SystemService } from "./core/system.service";
import { projects, resume, technologies } from "./core/portfolio";
import { SceneComponent } from "./scene/scene.component";
import { PlaygroundComponent } from "./playground/playground.component";
import { AssistantComponent } from "./assistant/assistant.component";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    SceneComponent,
    PlaygroundComponent,
    AssistantComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnDestroy {
  s = inject(SystemService);
  readonly autoScene = innerWidth >= 1100 && !this.s.reduced();
  projects = projects;
  resume = resume;
  technologies = technologies;
  year = new Date().getFullYear();
  recruiter = signal(false);
  detail = signal("");
  palette = viewChild<ElementRef<HTMLDialogElement>>("palette");
  query = "";
  commandIndex = 0;
  terminal = signal(false);
  terminalInput = "";
  terminalLines = signal(["SHIVAM.DEV shell · type help"]);
  help = signal(false);
  contact = { name: "", email: "", company: "", message: "", website: "" };
  sending = signal(false);
  contactResult = signal("");
  private cleanup?: () => void;
  commands = [
    "About Shivam",
    "Experience",
    "Projects",
    "Skills",
    "Problems solved",
    "Architecture",
    "Enter play mode",
    "Send API request",
    "Break Redis",
    "Fix system",
    "Reset architecture",
    "Ask Shivam AI",
    "GitHub",
    "Resume",
    "Contact",
    "/terminal",
  ];
  constructor() {
    afterNextRender(async () => {
      if (this.s.reduced() || innerWidth < 900) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(".hero-copy > *", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
        });
        gsap.utils
          .toArray<HTMLElement>(".reveal")
          .forEach((el) =>
            gsap.from(el, {
              y: 24,
              duration: 0.7,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }),
          );
      });
      this.cleanup = () => ctx.revert();
    });
  }
  paletteKey(e: KeyboardEvent) {
    const list =
      this.palette()?.nativeElement.querySelectorAll<HTMLButtonElement>(
        ".command-list button",
      );
    if (!list?.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const current = Array.from(list).indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const next =
        e.key === "ArrowDown"
          ? (current + 1) % list.length
          : (current - 1 + list.length) % list.length;
      list[next].focus();
    }
  }
  filtered() {
    return this.commands.filter((c) =>
      c.toLowerCase().includes(this.query.toLowerCase()),
    );
  }
  openPalette() {
    this.query = "";
    this.commandIndex = 0;
    this.palette()?.nativeElement.showModal();
  }
  command(c: string) {
    this.palette()?.nativeElement.close();
    switch (c) {
      case "Enter play mode":
        this.enterPlay();
        break;
      case "Send API request":
        this.s.request();
        this.go("architecture");
        break;
      case "Break Redis":
        this.s.breakRedis();
        this.go("lab");
        break;
      case "Fix system":
        ["Rate limiting", "Request coalescing", "Cache recovery"].forEach((p) =>
          this.s.repair(p),
        );
        break;
      case "Reset architecture":
        this.s.reset();
        break;
      case "Resume":
        window.open(resume, "_blank", "noopener");
        break;
      case "GitHub":
        window.open(
          "https://github.com/seriouslynonserious",
          "_blank",
          "noopener",
        );
        break;
      case "/terminal":
        this.terminal.set(true);
        this.go("terminal");
        break;
      default:
        this.go(
          (
            {
              "About Shivam": "about",
              "Problems solved": "lab",
              "Ask Shivam AI": "assistant",
              Skills: "architecture",
            } as Record<string, string>
          )[c] || c.toLowerCase(),
        );
    }
  }
  go(id: string) {
    setTimeout(() =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: this.s.reduced() ? "instant" : "smooth" }),
    );
  }
  enterPlay() {
    this.recruiter.set(false);
    this.s.play.set(true);
    this.go("hero-system");
  }
  @HostListener("window:keydown", ["$event"]) key(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      this.openPalette();
      return;
    }
    if (e.key === "Escape") {
      this.s.play.set(false);
      this.s.selected.set("");
      this.help.set(false);
    }
    if (
      (e.target as HTMLElement).matches("input,textarea,select") ||
      this.palette()?.nativeElement.open
    )
      return;
    if (this.s.play()) {
      if (e.key.toLowerCase() === "r") this.s.reset();
      if (e.code === "Space") {
        e.preventDefault();
        this.s.request();
      }
      if (e.key.toLowerCase() === "h") this.help.update((v) => !v);
    }
  }
  node() {
    return technologies.find((t) => t.name === this.s.selected());
  }
  terminalRun() {
    const cmd = this.terminalInput.trim().toLowerCase();
    this.terminalInput = "";
    let response = "Unknown command. Type help.";
    const actions: Record<string, () => void> = {
      "send-request": () => this.s.request(),
      "break-redis": () => this.s.breakRedis(),
      "fix-system": () => this.command("Fix system"),
      exit: () => this.terminal.set(false),
    };
    if (actions[cmd]) {
      actions[cmd]();
      response = this.s.logs()[0];
    } else if (cmd === "help")
      response =
        "whoami · skills · experience · projects · architecture · send-request · break-redis · fix-system · status · clear · exit";
    else if (cmd === "clear") {
      this.terminalLines.set([]);
      return;
    } else if (cmd === "whoami")
      response = "Shivam Mishra — Full Stack Software Engineer";
    else if (cmd === "status") response = this.s.state() + " · simulation only";
    else if (cmd === "skills")
      response = technologies.map((t) => t.name).join(" / ");
    else if (["experience", "projects", "architecture"].includes(cmd)) {
      this.go(cmd);
      response = "Navigating to " + cmd;
    } else if (cmd === "sudo hire shivam") {
      this.recruiter.set(true);
      response = "Permission granted. Recruiter mode enabled.";
    } else if (cmd === "rm -rf /") response = "Nice try. System protected.";
    else if (cmd === "coffee") response = "☕ Build. Debug. Brew. Repeat.";
    this.terminalLines.update((v) => [...v, "> " + cmd, response].slice(-24));
  }
  async sendContact() {
    if (this.sending()) return;
    this.sending.set(true);
    this.contactResult.set("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.contact),
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok || !r.headers.get("content-type")?.includes("application/json"))
        throw Error();
      this.contactResult.set("Message delivered. Thank you for reaching out.");
      this.contact = {
        name: "",
        email: "",
        company: "",
        message: "",
        website: "",
      };
    } catch {
      this.contactResult.set(
        "Message could not be delivered. Please email shivaay251202@gmail.com directly.",
      );
    } finally {
      this.sending.set(false);
    }
  }
  toggleMotion() {
    this.s.reduced.update((v) => !v);
    if (this.s.reduced()) this.cleanup?.();
  }
  ngOnDestroy() {
    this.cleanup?.();
  }
}
