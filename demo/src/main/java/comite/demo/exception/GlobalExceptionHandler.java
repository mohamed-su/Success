package comite.demo.exception;

import comite.demo.service.SecurityAuditService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Gestionnaire global d'exceptions avec audit de sécurité
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    private final SecurityAuditService auditService;
    
    public GlobalExceptionHandler(SecurityAuditService auditService) {
        this.auditService = auditService;
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logger.warn("Validation error on {}: {}", request.getRequestURI(), errors);
        
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(
                "VALIDATION_ERROR",
                "Validation failed",
                Map.of("errors", errors),
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        
        String clientIp = getClientIp(request);
        try {
            auditService.logSecurityViolation("anonymous", clientIp, 
                "AUTHENTICATION_FAILED", ex.getMessage());
        } catch (Exception e) {
            logger.debug("Audit service not available: {}", e.getMessage());
        }
        
        logger.warn("Authentication failed from IP {}: {}", clientIp, ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(
                "AUTHENTICATION_FAILED",
                "Authentication failed",
                null,
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        
        String clientIp = getClientIp(request);
        try {
            auditService.logSecurityViolation("unknown", clientIp, 
                "ACCESS_DENIED", request.getRequestURI());
        } catch (Exception e) {
            logger.debug("Audit service not available: {}", e.getMessage());
        }
        
        logger.warn("Access denied from IP {} to {}: {}", clientIp, request.getRequestURI(), ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse(
                "ACCESS_DENIED",
                "Access denied",
                null,
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex, HttpServletRequest request) {
        
        logger.warn("File upload size exceeded from IP {}: {}", getClientIp(request), ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(
                "FILE_TOO_LARGE",
                "Le fichier dépasse la taille maximale autorisée (5MB)",
                Map.of("maxSize", "5MB"),
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {
        
        logger.warn("Validation error on {}: {}", request.getRequestURI(), ex.getMessage());
        
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(
                "VALIDATION_ERROR",
                ex.getMessage(),
                null,
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, HttpServletRequest request) {
        
        logger.warn("Business error on {}: {}", request.getRequestURI(), ex.getMessage());
        
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(
                "BUSINESS_ERROR",
                ex.getMessage(),
                null,
                request.getRequestURI()
            ));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        
        String errorId = UUID.randomUUID().toString();
        logger.error("Unexpected error [{}] on {}: {}", errorId, request.getRequestURI(), ex.getMessage(), ex);
        
        // Ne pas logger comme violation de sécurité pour les erreurs système normales
        // Seulement pour les vraies violations de sécurité
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                Map.of("errorId", errorId),
                request.getRequestURI()
            ));
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            String[] ips = xForwardedFor.split(",");
            if (ips.length > 0) {
                return ips[0].trim();
            }
        }
        return request.getRemoteAddr();
    }
    
    public static class ErrorResponse {
        private final String errorCode;
        private final String message;
        private final Map<String, Object> details;
        private final String path;
        private final LocalDateTime timestamp;
        
        public ErrorResponse(String errorCode, String message, Map<String, Object> details, String path) {
            this.errorCode = errorCode;
            this.message = message;
            this.details = details;
            this.path = path;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getErrorCode() { return errorCode; }
        public String getMessage() { return message; }
        public Map<String, Object> getDetails() { return details; }
        public String getPath() { return path; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}