package dev.shivam.portfolio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(properties={"portfolio.gemini.key=","portfolio.contact.enabled=false"})
@AutoConfigureMockMvc
class ApiTest {
 @Autowired MockMvc mvc;
 @Test void health()throws Exception{mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ok"));}
 @Test void rejectsEmptyQuestion()throws Exception{mvc.perform(post("/api/ai/chat").contentType("application/json").content("{\"message\":\"\"}")).andExpect(status().isBadRequest());}
 @Test void unconfiguredAiFailsHonestly()throws Exception{mvc.perform(post("/api/ai/chat/stream").contentType("application/json").content("{\"message\":\"Tell me about Shivam\"}")).andExpect(status().isServiceUnavailable());}
 @Test void validatesContact()throws Exception{mvc.perform(post("/api/contact").contentType("application/json").content("{\"name\":\"A\",\"email\":\"bad\",\"message\":\"short\"}")).andExpect(status().isBadRequest());}
 @Test void contactNeverPretendsDelivery()throws Exception{mvc.perform(post("/api/contact").contentType("application/json").content("{\"name\":\"Recruiter\",\"email\":\"test@example.com\",\"message\":\"A valid message about a role\",\"website\":\"\"}")).andExpect(status().isServiceUnavailable());}
 @Test void honeypotRejected()throws Exception{mvc.perform(post("/api/contact").contentType("application/json").content("{\"name\":\"Recruiter\",\"email\":\"test@example.com\",\"message\":\"A valid message about a role\",\"website\":\"spam\"}")).andExpect(status().isBadRequest());}
 @Test void bodyBounded()throws Exception{mvc.perform(post("/api/ai/chat").contentType("application/json").content("x".repeat(17000))).andExpect(status().isPayloadTooLarge());}
}
