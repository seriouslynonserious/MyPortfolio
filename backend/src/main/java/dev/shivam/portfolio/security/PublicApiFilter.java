package dev.shivam.portfolio.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.*;
import java.util.*;
/** Instance-local bounded rate limiting. Deliberately ignores spoofable forwarding headers.
 * Configure Cloud Armor / gateway limits before increasing Cloud Run max instances. */
@Component
public class PublicApiFilter extends OncePerRequestFilter {
 private final Map<String,Window> windows=new HashMap<>();
 private record Window(long started,int count){}
 private synchronized boolean allow(String key,int max){long now=System.currentTimeMillis();windows.entrySet().removeIf(e->now-e.getValue().started()>60000);Window w=windows.get(key);if(w==null){if(windows.size()>=4096)return false;windows.put(key,new Window(now,1));return true;}if(w.count()>=max)return false;windows.put(key,new Window(w.started(),w.count()+1));return true;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws IOException,ServletException{
 res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("Cache-Control","no-store");
 if(!req.getRequestURI().startsWith("/api/")||!req.getMethod().equals("POST")){chain.doFilter(req,res);return;}
 if(!allow("global",60)||!allow(req.getRemoteAddr(),12)){res.setStatus(429);res.setHeader("Retry-After","60");res.setContentType("application/json");res.getWriter().write("{\"error\":\"Too many requests. Try again in one minute.\"}");return;}
 if(req.getContentLengthLong()>16384){reject(res);return;}
 byte[] body=req.getInputStream().readNBytes(16385);if(body.length>16384){reject(res);return;}
 HttpServletRequestWrapper wrapped=new HttpServletRequestWrapper(req){
 public ServletInputStream getInputStream(){ByteArrayInputStream in=new ByteArrayInputStream(body);return new ServletInputStream(){public int read(){return in.read();}public boolean isFinished(){return in.available()==0;}public boolean isReady(){return true;}public void setReadListener(ReadListener l){throw new UnsupportedOperationException();}};}
 public BufferedReader getReader(){return new BufferedReader(new InputStreamReader(getInputStream(),java.nio.charset.StandardCharsets.UTF_8));}};
 chain.doFilter(wrapped,res);
 }
 private void reject(HttpServletResponse res)throws IOException{res.setStatus(413);res.setContentType("application/json");res.getWriter().write("{\"error\":\"Request too large.\"}");}
}
