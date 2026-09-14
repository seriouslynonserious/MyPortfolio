import { Component, signal, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "portfolio-assistant",
  standalone: true,
  imports: [FormsModule],
  template: `<p class="eyebrow">05 / ASK SHIVAM AI</p>
    <div class="assistant-layout">
      <div>
        <h2>The short answer.<br /><span>With the context.</span></h2>
        <p>
          Ask about my projects, experience, or engineering decisions. Answers
          are grounded in this portfolio.
        </p>
        <div class="repair">
          @for (q of questions; track q) {
            <button (click)="question = q; ask()" [disabled]="busy()">
              {{ q }} ↗
            </button>
          }
        </div>
      </div>
      <div class="chat">
        <span class="eyebrow">PORTFOLIO ASSISTANT</span>
        <div class="answer" aria-live="polite">
          {{ answer() || "What would you like to know about my work?" }}
        </div>
        <form (ngSubmit)="ask()">
          <label class="sr-only" for="question">Your question</label
          ><input
            id="question"
            name="question"
            [(ngModel)]="question"
            placeholder="Ask about my engineering experience…"
            maxlength="1000"
            required
          /><button
            type="submit"
            [disabled]="busy() || !question.trim()"
            aria-label="Send question (↗)"
          >
            {{ busy() ? "…" : "↗" }}
          </button>
        </form>
        @if (busy()) {
          <button class="text-button" (click)="cancel()">Stop response</button>
        }
        <small>AI can make mistakes. Verify details in the case studies.</small>
      </div>
    </div>`,
})
export class AssistantComponent implements OnDestroy {
  question = "";
  busy = signal(false);
  answer = signal("");
  questions = [
    "What is your Angular experience?",
    "Tell me about Onelap.",
    "How do you approach API performance?",
  ];
  private controller?: AbortController;
  async ask() {
    if (this.busy() || !this.question.trim()) return;
    this.busy.set(true);
    this.answer.set("");
    this.controller = new AbortController();
    const timeout = setTimeout(() => this.controller?.abort(), 45000);
    try {
      const res = await fetch("/api/ai/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: this.question }),
        signal: this.controller.signal,
      });
      if (
        !res.ok ||
        !res.headers.get("content-type")?.includes("text/event-stream")
      )
        throw Error("Assistant unavailable");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder
          .decode(value, { stream: true })
          .replace(/\r\n/g, "\n");
        let end;
        while ((end = buffer.indexOf("\n\n")) >= 0) {
          const event = buffer.slice(0, end);
          buffer = buffer.slice(end + 2);
          const data = event
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5).trim())
            .join("\n");
          if (!data) continue;
          const parsed = JSON.parse(data);
          if (parsed.error) throw Error(parsed.error);
          if (parsed.text) this.answer.update((a) => a + parsed.text);
        }
      }
      if (!this.answer()) throw Error("Empty response");
    } catch {
      this.answer.update((a) =>
        a
          ? a + "\n\n[Response interrupted]"
          : "The AI assistant is unavailable right now. You can still explore all experience and project details below, or contact me directly.",
      );
    } finally {
      clearTimeout(timeout);
      this.busy.set(false);
    }
  }
  cancel() {
    this.controller?.abort();
  }
  ngOnDestroy() {
    this.cancel();
  }
}
