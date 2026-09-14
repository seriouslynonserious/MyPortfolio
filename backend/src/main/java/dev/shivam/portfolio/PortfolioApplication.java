package dev.shivam.portfolio;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@SpringBootApplication
@RestController
public class PortfolioApplication {
 public static void main(String[] args){SpringApplication.run(PortfolioApplication.class,args);}
 @GetMapping("/api/health") public Map<String,String> health(){return Map.of("status","ok");}
}
