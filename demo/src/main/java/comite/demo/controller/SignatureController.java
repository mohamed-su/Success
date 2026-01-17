package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/signatures")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SignatureController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String SIGNATURE_DIR = "uploads/signatures/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadSignature(@RequestParam("file") MultipartFile file,
                                            @RequestParam("userId") Long userId,
                                            @RequestParam("userRole") String userRole) {
        try {
            // Validation du fichier
            if (file.isEmpty() || file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Fichier invalide ou trop volumineux"
                ));
            }

            Path uploadDir = Paths.get(SIGNATURE_DIR).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String fileName = userId + "_" + UUID.randomUUID() + "_" + sanitizeFileName(file.getOriginalFilename());
            Path filePath = uploadDir.resolve(fileName).normalize();
            
            // Vérification de traversée de chemin
            if (!filePath.startsWith(uploadDir)) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Chemin de fichier invalide"
                ));
            }

            Files.write(filePath, file.getBytes());

            String sql = """
                INSERT INTO user_signatures (user_id, signature_file_path, uploaded_at)
                VALUES (?, ?, NOW())
                ON CONFLICT (user_id) DO UPDATE SET signature_file_path = ?, uploaded_at = NOW()
            """;
            jdbcTemplate.update(sql, userId, fileName, fileName);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Signature enregistrée",
                "fileName", fileName
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'enregistrement"
            ));
        }
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unknown";
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    @PostMapping("/draw")
    public ResponseEntity<?> saveDrawnSignature(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            String signatureData = (String) request.get("signatureData");

            if (!signatureData.startsWith("data:image/png;base64,")) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Format de signature invalide"
                ));
            }

            String base64Data = signatureData.split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            Path uploadDir = Paths.get(SIGNATURE_DIR).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String fileName = userId + "_" + UUID.randomUUID() + "_signature.png";
            Path filePath = uploadDir.resolve(fileName).normalize();
            
            if (!filePath.startsWith(uploadDir)) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Chemin de fichier invalide"
                ));
            }

            Files.write(filePath, imageBytes);

            String sql = """
                INSERT INTO user_signatures (user_id, signature_file_path, uploaded_at)
                VALUES (?, ?, NOW())
                ON CONFLICT (user_id) DO UPDATE SET signature_file_path = ?, uploaded_at = NOW()
            """;
            jdbcTemplate.update(sql, userId, fileName, fileName);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Signature dessinée enregistrée",
                "fileName", fileName
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSignature(@PathVariable Long userId) {
        try {
            String sql = "SELECT signature_file_path FROM user_signatures WHERE user_id = ?";
            var result = jdbcTemplate.queryForList(sql, userId);
            
            if (result.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "hasSignature", false
                ));
            }

            String fileName = (String) result.get(0).get("signature_file_path");
            Path filePath = Paths.get(SIGNATURE_DIR + fileName);
            
            if (Files.exists(filePath)) {
                byte[] imageBytes = Files.readAllBytes(filePath);
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "hasSignature", true,
                    "signatureData", "data:image/png;base64," + base64Image
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "hasSignature", false
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocol/{protocolId}/sign")
    public ResponseEntity<?> signProtocol(@PathVariable Long protocolId,
                                         @RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            String userRole = (String) request.get("userRole");
            String signatureType = (String) request.get("signatureType");

            String getUserSql = "SELECT first_name, last_name FROM users WHERE id = ?";
            var userInfo = jdbcTemplate.queryForList(getUserSql, userId);
            String userName = userInfo.get(0).get("first_name") + " " + userInfo.get(0).get("last_name");

            String getSignatureSql = "SELECT signature_file_path FROM user_signatures WHERE user_id = ?";
            var signatureResult = jdbcTemplate.queryForList(getSignatureSql, userId);
            
            if (signatureResult.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Aucune signature enregistrée pour cet utilisateur"
                ));
            }

            String signatureFile = (String) signatureResult.get(0).get("signature_file_path");

            String insertSql = """
                INSERT INTO protocol_signatures 
                (protocol_id, user_id, user_name, user_role, signature_file_path, signature_type, signed_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            """;
            jdbcTemplate.update(insertSql, protocolId, userId, userName, userRole, signatureFile, signatureType);

            if ("president".equalsIgnoreCase(userRole)) {
                String updateSql = "UPDATE protocol_evaluations SET president_signature_date = NOW(), president_name = ? WHERE protocol_id = ?";
                jdbcTemplate.update(updateSql, userName, protocolId);
            } else if ("secretary".equalsIgnoreCase(userRole)) {
                String updateSql = "UPDATE protocol_evaluations SET secretary_stamp_date = NOW(), secretary_name = ?, status = 'FINALIZED' WHERE protocol_id = ?";
                jdbcTemplate.update(updateSql, userName, protocolId);
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Document signé avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}")
    public ResponseEntity<?> getProtocolSignatures(@PathVariable Long protocolId) {
        try {
            String sql = "SELECT * FROM protocol_signatures WHERE protocol_id = ? ORDER BY signed_at";
            var signatures = jdbcTemplate.queryForList(sql, protocolId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "signatures", signatures
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
