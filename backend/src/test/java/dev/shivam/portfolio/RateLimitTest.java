package dev.shivam.portfolio;
import dev.shivam.portfolio.security.PublicApiFilter;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.*;
import static org.junit.jupiter.api.Assertions.*;
class RateLimitTest {
 @Test void throttlesAndIgnoresSpoofedHeaders()throws Exception{var filter=new PublicApiFilter();for(int i=0;i<13;i++){var req=new MockHttpServletRequest("POST","/api/ai/chat");req.setRemoteAddr("127.0.0.1");req.addHeader("X-Forwarded-For","1.2.3."+i);var res=new MockHttpServletResponse();filter.doFilter(req,res,new MockFilterChain());assertEquals(i<12?200:429,res.getStatus());}}
}
