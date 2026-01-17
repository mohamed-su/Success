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
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service JWT optimisé avec cache et gestion d'erreurs améliorée
 */
@Service
public class OptimizedJwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(OptimizedJwtService.class);
    
    private final SecretKey secretKey;
    private final int accessTokenValidityMinutes;
    private final int refreshTokenValidityDays;
    private final SecurityAuditService auditService;
    
    // Cache pour éviter le parsing répétitif
    private final Map<String, TokenValidationResult> validationCache = new ConcurrentHashMap<>();
    private static final int CACHE_MAX_SIZE = 1000;
    
    public OptimizedJwtService(@Value("${jwt.secret}") String secret,
                              @Value("${jwt.access-token-validity:15}") int accessTokenValidityMinutes,
                              @Value("${jwt.refresh-token-validity:7}") int refreshTokenValidityDays,
                              SecurityAuditService auditService) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValidityMinutes = accessTokenValidityMinutes;
        this.refreshTokenValidityDays = refreshTokenValidityDays;
        this.auditService = auditService;
    }
    
    public String generateAccessToken(String username, String role, Map<String, Object> claims) {
        try {
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
            
        } catch (Exception e) {
            logger.error("Error generating access token for user: {}", username, e);
            throw new JwtException("Failed to generate access token", e);
        }
    }
    
    public String generateRefreshToken(String username) {
        try {
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
            
        } catch (Exception e) {
            logger.error("Error generating refresh token for user: {}", username, e);
            throw new JwtException("Failed to generate refresh token", e);
        }
    }
    
    public TokenValidationResult validateToken(String token) {
        // Vérifier le cache d'abord
        TokenValidationResult cached = validationCache.get(token);
        if (cached != null && !isExpired(cached)) {
            return cached;
        }
        
        try {
            // Vérifier si le token est révoqué
            if (auditService.isTokenRevoked(generateTokenHash(token))) {
                TokenValidationResult result = TokenValidationResult.revoked("Token has been revoked");
                cacheResult(token, result);
                return result;
            }
            
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            String username = claims.getSubject();
            String tokenType = claims.get("type", String.class);
            
            if (username == null || tokenType == null) {
                logger.warn("Invalid token structure - missing subject or type");
                TokenValidationResult result = TokenValidationResult.invalid("Invalid token structure");
                cacheResult(token, result);
                return result;
            }
            
            TokenValidationResult result = TokenValidationResult.valid(claims);
            cacheResult(token, result);
            logger.debug("Token validated successfully for user: {}", username);
            return result;
            
        } catch (ExpiredJwtException e) {
            logger.debug("Token expired for user: {}", e.getClaims().getSubject());
            TokenValidationResult result = TokenValidationResult.expired("Token expired");
            cacheResult(token, result);
            return result;
        } catch (UnsupportedJwtException e) {
            logger.warn("Unsupported token format", e);
            return TokenValidationResult.invalid("Unsupported token format");
        } catch (MalformedJwtException e) {
            logger.warn("Malformed token", e);
            return TokenValidationResult.invalid("Malformed token");
        } catch (SecurityException | IllegalArgumentException e) {
            logger.warn("Invalid token signature", e);
            return TokenValidationResult.invalid("Invalid token signature");
        } catch (Exception e) {
            logger.error("Unexpected error during token validation", e);
            return TokenValidationResult.invalid("Token validation failed");
        }
    }
    
    public TokenInfo extractTokenInfo(String token) {
        TokenValidationResult result = validateToken(token);
        if (!result.isValid()) {
            return new TokenInfo(null, null, null, result.getStatus());
        }
        
        Claims claims = result.getClaims();
        return new TokenInfo(
            claims.getSubject(),
            claims.get("role", String.class),
            claims.get("type", String.class),
            result.getStatus()
        );
    }
    
    public void revokeToken(String token, String username) {
        try {
            String tokenHash = generateTokenHash(token);
            TokenValidationResult validation = validateToken(token);
            
            if (validation.isValid()) {
                Date expiration = validation.getClaims().getExpiration();
                auditService.revokeToken(tokenHash, username, 
                    expiration.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            }
            
            // Supprimer du cache
            validationCache.remove(token);
            
            logger.info("Token revoked for user: {}", username);
            
        } catch (Exception e) {
            logger.error("Error revoking token for user: {}", username, e);
        }
    }
    
    private void cacheResult(String token, TokenValidationResult result) {
        if (validationCache.size() >= CACHE_MAX_SIZE) {
            // Simple LRU - supprimer 10% des entrées les plus anciennes
            validationCache.entrySet().removeIf(entry -> 
                validationCache.size() > CACHE_MAX_SIZE * 0.9);
        }
        validationCache.put(token, result);
    }
    
    private boolean isExpired(TokenValidationResult result) {
        if (!result.isValid() || result.getClaims() == null) {
            return true;
        }
        
        Date expiration = result.getClaims().getExpiration();
        return expiration != null && expiration.before(new Date());
    }
    
    private String generateTokenHash(String token) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(token.getBytes());
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            logger.error("Error generating token hash", e);
            return token.substring(0, Math.min(token.length(), 50)); // Fallback
        }
    }
    
    // Classes de résultat
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
            return new TokenValidationResult(true, "Token valid", claims, TokenStatus.VALID);
        }
        
        public static TokenValidationResult expired(String message) {
            return new TokenValidationResult(false, message, null, TokenStatus.EXPIRED);
        }
        
        public static TokenValidationResult invalid(String message) {
            return new TokenValidationResult(false, message, null, TokenStatus.INVALID);
        }
        
        public static TokenValidationResult revoked(String message) {
            return new TokenValidationResult(false, message, null, TokenStatus.REVOKED);
        }
        
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Claims getClaims() { return claims; }
        public TokenStatus getStatus() { return status; }
    }
    
    public record TokenInfo(String username, String role, String type, TokenStatus status) {}
    
    public enum TokenStatus {
        VALID, EXPIRED, INVALID, REVOKED
    }
    
    public static class JwtException extends RuntimeException {
        public JwtException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}