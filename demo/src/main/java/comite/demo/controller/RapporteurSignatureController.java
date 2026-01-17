package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rapporteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RapporteurSignatureController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/upload-signature")
    public ResponseEntity<Map<String, Object>> uploadSignature(
            @RequestParam("signature") MultipartFile file,
            @RequestParam("rapporteurId") Long rapporteurId) {
        
        try {
            if (file.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Aucun fichier sélectionné");
                return ResponseEntity.badRequest().body(response);
            }

            // Vérifier la taille du fichier (max 2MB)
            if (file.getSize() > 2 * 1024 * 1024) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "La taille du fichier ne doit pas dépasser 2MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Vérifier le type de fichier
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Seuls les fichiers image sont acceptés");
                return ResponseEntity.badRequest().body(response);
            }

            // Convertir en Base64
            byte[] fileBytes = file.getBytes();
            String base64Image = "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(fileBytes);

            // Désactiver l'ancienne signature
            String deactivateOldSql = "UPDATE rapporteur_signatures SET is_active = FALSE WHERE rapporteur_id = ?";
            jdbcTemplate.update(deactivateOldSql, rapporteurId);

            // Insérer la nouvelle signature
            String insertSql = "INSERT INTO rapporteur_signatures (rapporteur_id, signature_image, is_active) VALUES (?, ?, TRUE)";
            jdbcTemplate.update(insertSql, rapporteurId, base64Image);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signature uploadée avec succès");
            response.put("signatureImage", base64Image);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de l'upload: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/signature/{rapporteurId}")
    public ResponseEntity<Map<String, Object>> getSignature(@PathVariable Long rapporteurId) {
        try {
            String sql = "SELECT signature_image FROM rapporteur_signatures WHERE rapporteur_id = ? AND is_active = TRUE ORDER BY uploaded_at DESC LIMIT 1";
            
            String signatureImage = jdbcTemplate.queryForObject(sql, String.class, rapporteurId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("signatureImage", signatureImage);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Aucune signature trouvée");
            return ResponseEntity.ok(response);
        }
    }
}