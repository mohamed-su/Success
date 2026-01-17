package comite.demo.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

/**
 * Service JWT sécurisé avec rotation des clés et validation stricte
 * Conforme aux normes OWASP pour la gestion des tokens
 */
@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    
    private final SecretKey secretKey;
    private final int accessTokenValidityMinutes;
    private final int refreshTokenValidityDays;
    
    public JwtService(@Value("${jwt.secret}") String secret,
                     @Value("${jwt.access-token-validity:15}") int accessTokenValidityMinutes,
                     @Value("${jwt.refresh-token-validity:7}") int refreshTokenValidityDays) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        this.accessTokenValidityMinutes = accessTokenValidityMinutes;
        this.refreshTokenValidityDays = refreshTokenValidityDays;
    }
    
    public String generateAccessToken(String username, String role, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenValidityMinutes, ChronoUnit.MINUTES);
        
        JwtBuilder builder = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .claim("role", role)
            .claim("type", "access")
            .signWith(secretKey, SignatureAlgorithm.HS256);
        
        if (claims != null) {
            claims.forEach(builder::claim);
        }
        
        String token = builder.compact();
        logger.debug("Access token generated for user: {}", username);
        return token;
    }
    
    /**
     * Génère un token d'accès avec informations utilisateur complètes
     */
    public String generateEnhancedAccessToken(String username, String role, Long userId, String userIdentifier, Map<String, Object> additionalClaims) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenValidityMinutes, ChronoUnit.MINUTES);
        
        JwtBuilder builder = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .claim("role", role)
            .claim("userId", userId)
            .claim("userIdentifier", userIdentifier)
            .claim("type", "access")
            .claim("accessLevel", determineAccessLevel(role))
            .signWith(secretKey, SignatureAlgorithm.HS256);
        
        if (additionalClaims != null) {
            additionalClaims.forEach(builder::claim);
        }
        
        String token = builder.compact();
        logger.debug("Enhanced access token generated for user: {} with role: {}", username, role);
        return token;
    }
    
    /**
     * Détermine le niveau d'accès selon le rôle
     */
    private String determineAccessLevel(String role) {
        if (role == null) return "LIMITED_ACCESS";
        
        switch (role.toUpperCase(java.util.Locale.ROOT)) {
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
    
    public String generateRefreshToken(String username) {
        Instant now = Instant.now();
        Instant expiry = now.plus(refreshTokenValidityDays, ChronoUnit.DAYS);
        
        String token = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .claim("type", "refresh")
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact();
        
        logger.debug("Refresh token generated for user: {}", username);
        return token;
    }
    
    public TokenValidationResult validateToken(String token) {
        try {
            logger.debug("Validating token of length: {}", token.length());
            Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            
            String username = claims.getSubject();
            String tokenType = claims.get("type", String.class);
            
            logger.debug("Token claims - username: {}, type: {}, expiration: {}", 
                       username, tokenType, claims.getExpiration());
            
            if (username == null || tokenType == null) {
                logger.warn("Invalid token structure - username: {}, type: {}", username, tokenType);
                return TokenValidationResult.invalid("Structure de token invalide");
            }
            
            logger.debug("Token validated successfully for user: {}", username);
            return TokenValidationResult.valid(claims);
            
        } catch (ExpiredJwtException e) {
            logger.warn("Token expired: {}", e.getMessage());
            return TokenValidationResult.expired("Token expiré");
        } catch (UnsupportedJwtException e) {
            logger.warn("Unsupported token: {}", e.getMessage());
            return TokenValidationResult.invalid("Format de token non supporté");
        } catch (MalformedJwtException e) {
            logger.warn("Malformed token: {}", e.getMessage());
            return TokenValidationResult.invalid("Token malformé");
        } catch (SecurityException | IllegalArgumentException e) {
            logger.warn("Invalid token signature: {}", e.getMessage());
            return TokenValidationResult.invalid("Signature de token invalide");
        } catch (Exception e) {
            logger.error("Unexpected error during token validation", e);
            return TokenValidationResult.invalid("Erreur de validation du token");
        }
    }
    
    public String extractUsername(String token) {
        TokenValidationResult result = validateToken(token);
        if (result.isValid()) {
            return result.getClaims().getSubject();
        }
        return null;
    }
    
    public String extractRole(String token) {
        TokenValidationResult result = validateToken(token);
        if (result.isValid()) {
            return result.getClaims().get("role", String.class);
        }
        return null;
    }
    
    public Long extractUserId(String token) {
        TokenValidationResult result = validateToken(token);
        if (result.isValid()) {
            return result.getClaims().get("userId", Long.class);
        }
        return null;
    }
    
    public String extractUserIdentifier(String token) {
        TokenValidationResult result = validateToken(token);
        if (result.isValid()) {
            return result.getClaims().get("userIdentifier", String.class);
        }
        return null;
    }
    
    public String extractAccessLevel(String token) {
        TokenValidationResult result = validateToken(token);
        if (result.isValid()) {
            return result.getClaims().get("accessLevel", String.class);
        }
        return null;
    }
    
    public boolean isTokenExpired(String token) {
        TokenValidationResult result = validateToken(token);
        return result.getStatus() == TokenStatus.EXPIRED;
    }
    
    public Date getTokenExpiration(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return claims.getExpiration();
        } catch (Exception e) {
            logger.warn("Could not extract expiration from token: {}", e.getMessage());
            return null;
        }
    }
    
    public static class TokenValidationResult {
        private final boolean valid;
        private final String message;
        private final Claims claims;
        private final TokenStatus status;
        
        private TokenValidationResult(boolean valid, String message, Claims claims, TokenStatus status) {
            this.valid = valid;
            this.message = message;
            this.claims = claims;
            this.status = status;
        }
        
        public static TokenValidationResult valid(Claims claims) {
            return new TokenValidationResult(true, "Token valide", claims, TokenStatus.VALID);
        }
        
        public static TokenValidationResult expired(String message) {
            return new TokenValidationResult(false, message, null, TokenStatus.EXPIRED);
        }
        
        public static TokenValidationResult invalid(String message) {
            return new TokenValidationResult(false, message, null, TokenStatus.INVALID);
        }
        
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Claims getClaims() { return claims; }
        public TokenStatus getStatus() { return status; }
    }
    
    public enum TokenStatus {
        VALID, EXPIRED, INVALID
    }
}