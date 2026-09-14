package dev.shivam.portfolio.contact;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import dev.shivam.portfolio.exception.ApiException;
import java.util.Map;
@RestController
public class ContactController {
 private final JavaMailSender sender;private final boolean enabled;private final String to,from;
 public ContactController(JavaMailSender sender,@Value("${portfolio.contact.enabled}")boolean enabled,@Value("${portfolio.contact.to}")String to,@Value("${portfolio.contact.from}")String from){this.sender=sender;this.enabled=enabled;this.to=to;this.from=from;}
 public record Contact(@NotBlank @Size(min=2,max=80)String name,@NotBlank @Email @Size(max=254)String email,@Size(max=120)String company,@NotBlank @Size(min=10,max=3000)String message,@Size(max=0)String website){}
 @PostMapping("/api/contact") public Map<String,String> contact(@Valid @RequestBody Contact contact){if(!enabled||from.isBlank())throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"Contact delivery is not configured. Please email Shivam directly.");
 SimpleMailMessage mail=new SimpleMailMessage();mail.setFrom(from);mail.setTo(to);mail.setReplyTo(clean(contact.email()));mail.setSubject("Portfolio inquiry from "+clean(contact.name()));mail.setText("Name: "+clean(contact.name())+"\nCompany: "+clean(contact.company())+"\n\n"+contact.message().replace("\u0000",""));sender.send(mail);return Map.of("status","delivered");}
 private String clean(String text){return text==null?"":text.replaceAll("[\\r\\n\\p{Cntrl}]"," ").trim();}
}
