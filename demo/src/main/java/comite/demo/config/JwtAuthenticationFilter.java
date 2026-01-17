package comite.demo.config;

import comite.demo.service.JwtService;
import comite.demo.repository.UserRepository;
import comite.demo.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");
        
        logger.debug("Processing request: {} {}", request.getMethod(), requestURI);
        logger.debug("Authorization header: {}", (authHeader != null ? "Present" : "Missing"));

        // Vérifier si l'en-tête Authorization existe et commence par "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found, continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        // Extraire le token JWT
        final String jwt = authHeader.substring(7);
        logger.debug("JWT token extracted, length: {}", jwt.length());
        
        try {
            // Valider le token et extraire le nom d'utilisateur
            JwtService.TokenValidationResult validationResult = jwtService.validateToken(jwt);
            logger.debug("Token validation result: valid={}", validationResult.isValid());
            
            if (validationResult.isValid()) {
                final String username = validationResult.getClaims().getSubject();
                logger.debug("Token validation successful for user: [REDACTED]");
                
                // Si l'utilisateur n'est pas déjà authentifié
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // Récupérer l'utilisateur de la base de données
                    Optional<User> userOpt = userRepository.findByUsername(username);
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        logger.debug("User found with role: {}, Active: {}", user.getRole(), user.isActive());
                        
                        // Vérifier que l'utilisateur est actif
                        if (user.isActive()) {
                            
                            // Créer l'objet Authentication
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                            );
                            
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            // Définir l'authentification dans le contexte de sécurité
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                            logger.debug("Authentication set with role: ROLE_{}", user.getRole().name());
                        } else {
                            logger.warn("User authentication failed: inactive account");
                        }
                    } else {
                        logger.warn("User authentication failed: user not found");
                    }
                }
            } else {
                logger.warn("Token validation failed");
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la validation du token JWT", e);
        }

        filterChain.doFilter(request, response);
    }
}