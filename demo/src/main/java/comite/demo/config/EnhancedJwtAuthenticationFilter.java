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

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * Filtre JWT amélioré avec injection d'informations utilisateur dans les headers
 * Permet l'accès personnalisé aux protocoles selon le rôle
 */
@Component
public class EnhancedJwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");
        
        logger.debug("Processing request: " + request.getMethod() + " " + requestURI);

        // Vérifier si l'en-tête Authorization existe et commence par "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found, continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        // Extraire le token JWT
        final String jwt = authHeader.substring(7);
        logger.debug("JWT token extracted, length: " + jwt.length());
        
        try {
            // Valider le token et extraire les informations
            JwtService.TokenValidationResult validationResult = jwtService.validateToken(jwt);
            logger.debug("Token validation result: valid=" + validationResult.isValid());
            
            if (validationResult.isValid()) {
                final String username = validationResult.getClaims().getSubject();
                logger.debug("Token validation successful for user: " + username);
                
                // Si l'utilisateur n'est pas déjà authentifié
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // Récupérer l'utilisateur de la base de données
                    Optional<User> userOpt = userRepository.findByUsername(username);
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        logger.debug("User found: " + username + ", Role: " + user.getRole() + ", Active: " + user.isActive());
                        
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
                            
                            // NOUVEAU: Injecter les informations utilisateur dans les headers de réponse
                            // pour l'accès personnalisé aux protocoles
                            injectUserHeaders(request, response, user, jwt);
                            
                            logger.debug("Authentication set for user: " + username + " with enhanced headers");
                        } else {
                            logger.warn("User " + username + " is inactive or locked");
                        }
                    } else {
                        logger.warn("User " + username + " not found in database");
                    }
                }
            } else {
                logger.warn("Token validation failed: " + validationResult.getMessage());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la validation du token JWT", e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Injecte les informations utilisateur dans les headers pour l'accès personnalisé
     */
    private void injectUserHeaders(HttpServletRequest request, HttpServletResponse response, User user, String token) {
        try {
            // Headers sécurisés pour l'identification utilisateur
            response.setHeader("X-User-ID", user.getId().toString());
            response.setHeader("X-User-Role", user.getRole().name());
            response.setHeader("X-User-Identifier", user.getUserIdentifier());
            response.setHeader("X-User-Name", user.getFirstName() + " " + user.getLastName());
            
            // Header pour la validation côté client
            response.setHeader("X-Auth-Status", "authenticated");
            response.setHeader("X-Access-Level", determineAccessLevel(user.getRole().name()));
            
            // Headers pour la personnalisation de l'interface
            response.setHeader("X-Dashboard-Type", getDashboardType(user.getRole().name()));
            response.setHeader("X-Permissions", getPermissions(user.getRole().name()));
            
            logger.debug("User headers injected for: " + user.getUsername());
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'injection des headers utilisateur", e);
        }
    }

    /**
     * Détermine le niveau d'accès selon le rôle
     */
    private String determineAccessLevel(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "FULL_ACCESS";
            case "PRESIDENT":
                return "SUPERVISION_ACCESS";
            case "SECRETARY":
                return "VALIDATION_ACCESS";
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return "EVALUATION_ACCESS";
            case "RESEARCHER":
                return "SUBMISSION_ACCESS";
            default:
                return "LIMITED_ACCESS";
        }
    }

    /**
     * Détermine le type de tableau de bord selon le rôle
     */
    private String getDashboardType(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "admin";
            case "PRESIDENT":
                return "president";
            case "SECRETARY":
                return "secretary";
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return "member";
            case "RESEARCHER":
                return "researcher";
            default:
                return "basic";
        }
    }

    /**
     * Génère la liste des permissions selon le rôle
     */
    private String getPermissions(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "manage_users,assign_protocols,view_all,generate_reports,system_settings";
            case "PRESIDENT":
                return "assign_protocols,supervise_protocols,approve_protocols,view_assigned";
            case "SECRETARY":
                return "validate_protocols,generate_reports,manage_sessions,view_pending";
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return "evaluate_protocols,download_files,view_assigned";
            case "RESEARCHER":
                return "submit_protocols,edit_own,view_own,upload_files";
            default:
                return "view_basic";
        }
    }

    /**
     * Vérifie si la requête nécessite une authentification
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Endpoints publics qui ne nécessitent pas d'authentification
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/") ||
               path.equals("/api/health") ||
               path.startsWith("/swagger-") ||
               path.startsWith("/v3/api-docs");
    }
}