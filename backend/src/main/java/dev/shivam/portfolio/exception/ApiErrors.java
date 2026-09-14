package dev.shivam.portfolio.exception;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.util.Map;
@RestControllerAdvice
public class ApiErrors {
 @ExceptionHandler(ApiException.class) public ResponseEntity<?> api(ApiException e){return ResponseEntity.status(e.status).body(Map.of("error",e.getMessage()));}
 @ExceptionHandler({MethodArgumentNotValidException.class,HttpMessageNotReadableException.class}) public ResponseEntity<?> invalid(Exception e){return ResponseEntity.badRequest().body(Map.of("error","Check the required fields and message length."));}
 @ExceptionHandler(Exception.class) public ResponseEntity<?> unknown(Exception e){return ResponseEntity.status(503).body(Map.of("error","Service temporarily unavailable. Please try again later."));}
}
