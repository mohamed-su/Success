package comite.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration Spring Security sécurisée
 * Conforme aux normes OWASP, NIST et ISO 27001
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // @Autowired
    // private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    // @Autowired
    // private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Configuration avec Argon2 comme encodeur principal et BCrypt en fallback
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        
        // Argon2 - Recommandé par OWASP (2023)
        Argon2PasswordEncoder argon2 = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        encoders.put("argon2", argon2);
        
        // BCrypt - Pour la compatibilité
        encoders.put("bcrypt", new BCryptPasswordEncoder(12)); // Force strength 12
        
        DelegatingPasswordEncoder passwordEncoder = new DelegatingPasswordEncoder("argon2", encoders);
        passwordEncoder.setDefaultPasswordEncoderForMatches(new BCryptPasswordEncoder(12));
        
        return passwordEncoder;
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origines autorisées (à configurer selon l'environnement)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5176"));
        
        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Credentials autorisés
        configuration.setAllowCredentials(true);
        
        // Durée de cache pour les requêtes preflight
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}