package comite.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Configuration des headers de sécurité HTTP
 * Conforme aux recommandations OWASP
 */
@Configuration
public class SecurityHeadersConfig {

    @Bean
    public SecurityHeadersFilter securityHeadersFilter() {
        return new SecurityHeadersFilter();
    }

    public static class SecurityHeadersFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      FilterChain filterChain) throws ServletException, IOException {
            
            // Content Security Policy
            response.setHeader("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'none';"
            );
            
            // X-Frame-Options
            response.setHeader("X-Frame-Options", "DENY");
            
            // X-Content-Type-Options
            response.setHeader("X-Content-Type-Options", "nosniff");
            
            // X-XSS-Protection
            response.setHeader("X-XSS-Protection", "1; mode=block");
            
            // Referrer Policy
            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // Permissions Policy
            response.setHeader("Permissions-Policy", 
                "camera=(), microphone=(), geolocation=(), payment=()");
            
            // Strict Transport Security (HTTPS uniquement)
            if (request.isSecure()) {
                response.setHeader("Strict-Transport-Security", 
                    "max-age=31536000; includeSubDomains; preload");
            }
            
            filterChain.doFilter(request, response);
        }
    }
}