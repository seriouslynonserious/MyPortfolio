package dev.shivam.portfolio.ai;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.annotation.PreDestroy;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.HttpStatus;
import dev.shivam.portfolio.exception.ApiException;
import java.util.Map;
import java.util.concurrent.*;
@RestController
@RequestMapping("/api/ai")
public class AiController {
 private final AiService ai;private final ExecutorService executor=new ThreadPoolExecutor(2,4,30,TimeUnit.SECONDS,new ArrayBlockingQueue<>(8),new ThreadPoolExecutor.AbortPolicy());
 public AiController(AiService ai){this.ai=ai;}
 public record Chat(@NotBlank @Size(max=1000)String message){}
 @PostMapping("/chat") public Map<String,String> chat(@Valid @RequestBody Chat chat)throws Exception{return Map.of("answer",ai.chat(chat.message()));}
 @PostMapping(value="/chat/stream",produces="text/event-stream") public SseEmitter stream(@Valid @RequestBody Chat chat){ai.available();SseEmitter emitter=new SseEmitter(40000L);
 try{java.util.concurrent.Future<?> task=executor.submit(()->{try{ai.stream(chat.message(),text->{try{emitter.send(SseEmitter.event().name("token").data(Map.of("text",text)));}catch(Exception e){throw new RuntimeException(e);}});emitter.send(SseEmitter.event().name("done").data(Map.of("done",true)));emitter.complete();}catch(Exception e){try{emitter.send(SseEmitter.event().name("error").data(Map.of("error","AI response interrupted. Please try again.")));}catch(Exception ignored){}emitter.complete();}});emitter.onTimeout(()->{task.cancel(true);emitter.complete();});emitter.onError(e->task.cancel(true));}catch(RejectedExecutionException e){throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,"Assistant busy. Try again shortly.");}return emitter;}
 @PreDestroy public void stop(){executor.shutdownNow();}
}
