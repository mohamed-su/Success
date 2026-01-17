package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/protocols")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProtocolViewController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadProtocol(@PathVariable Long id, HttpServletRequest request) {
        try {
            String sql = "SELECT title, submitter_name, institution FROM protocol_submissions WHERE id = ?";
            var results = jdbcTemplate.queryForList(sql, id);
            
            if (results.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            Map<String, Object> protocol = results.get(0);
            String title = (String) protocol.get("title");
            String submitterName = (String) protocol.get("submitter_name");
            String institution = (String) protocol.get("institution");
            
            ResponseEntity<String> pdfResponse = generateDemoProtocolPdf(id, title, submitterName, institution);
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Protocole_PROT-" + id + ".html\"")
                .body(pdfResponse.getBody());
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/{id}/documents")
    public ResponseEntity<?> viewAllDocuments(@PathVariable Long id) {
        try {
            String sql = "SELECT title, submitter_name, institution, protocol_file_name, consent_form_file_name, cv_files_names, payment_receipt_file_name FROM protocol_submissions WHERE id = ?";
            var results = jdbcTemplate.queryForList(sql, id);
            
            if (results.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            var p = results.get(0);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol", Map.of(
                    "id", id,
                    "title", p.get("title"),
                    "submitter_name", p.get("submitter_name"),
                    "institution", p.get("institution"),
                    "documents", Map.of(
                        "protocol", p.get("protocol_file_name"),
                        "consent", p.get("consent_form_file_name"),
                        "cv", p.get("cv_files_names"),
                        "receipt", p.get("payment_receipt_file_name")
                    )
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<?> viewProtocol(@PathVariable Long id, HttpServletRequest request) {
        try {
            String sql = "SELECT title, submitter_name, institution FROM protocol_submissions WHERE id = ?";
            var results = jdbcTemplate.queryForList(sql, id);
            
            if (results.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            Map<String, Object> protocol = results.get(0);
            String title = (String) protocol.get("title");
            String submitterName = (String) protocol.get("submitter_name");
            String institution = (String) protocol.get("institution");
            
            return generateDemoProtocolPdf(id, title, submitterName, institution);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private boolean hasAccessToProtocol(Long userId, Long protocolId, String userRole) {
        try {
            // Vérifier si l'utilisateur est assigné à ce protocole
            String assignmentSql = "SELECT COUNT(*) FROM protocol_member_assignments WHERE protocol_id = ? AND member_id = ? AND status = 'ASSIGNED'";
            Integer assignmentCount = jdbcTemplate.queryForObject(assignmentSql, Integer.class, protocolId, userId);
            
            if (assignmentCount != null && assignmentCount > 0) {
                return true;
            }
            
            // Vérifier si c'est le président ou un admin
            if ("president".equalsIgnoreCase(userRole) || "admin".equalsIgnoreCase(userRole)) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private ResponseEntity<String> generateDemoProtocolPdf(Long id, String title, String submitterName, String institution) {
        // Générer un contenu HTML simple pour démonstration
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Protocole PROT-%d</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .content { margin-top: 30px; line-height: 1.6; }
                    .section { margin-bottom: 25px; }
                    .section h3 { color: #2c5aa0; border-bottom: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>PROTOCOLE DE RECHERCHE</h1>
                    <h2>PROT-%d</h2>
                    <p><strong>%s</strong></p>
                    <p>Chercheur principal: %s</p>
                    <p>Institution: %s</p>
                </div>
                <div class="content">
                    <div class="section">
                        <h3>1. RÉSUMÉ DU PROJET</h3>
                        <p>Ce protocole de recherche présente une étude visant à améliorer la compréhension des phénomènes de santé publique au Burkina Faso.</p>
                    </div>
                    <div class="section">
                        <h3>2. OBJECTIFS</h3>
                        <p><strong>Objectif général :</strong> Contribuer à l'amélioration de la santé des populations.</p>
                    </div>
                    <div class="section">
                        <h3>3. MÉTHODOLOGIE</h3>
                        <p>La méthodologie proposée comprend une approche mixte combinant des méthodes quantitatives et qualitatives.</p>
                    </div>
                    <div class="section">
                        <h3>4. CONSIDÉRATIONS ÉTHIQUES</h3>
                        <p>Cette recherche respecte les principes éthiques fondamentaux du respect de la personne, de la bienfaisance et de la justice.</p>
                    </div>
                    <div class="section">
                        <h3>5. CONSENTEMENT ÉCLAIRÉ</h3>
                        <p>Le processus de consentement éclairé sera mis en œuvre conformément aux directives du CERS.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(id, id, title != null ? title : "Titre du protocole", 
                         submitterName != null ? submitterName : "Non spécifié",
                         institution != null ? institution : "Non spécifiée");

        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_HTML)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
            .body(htmlContent);
    }
    
    private ResponseEntity<String> generateDocumentsPage(Long id, String title, String submitterName, String institution, String protocolFile, String consentFile, String cvFiles, String paymentFile) {
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Documents - Protocole PROT-%d</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
                    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 3px solid #2c5aa0; padding-bottom: 20px; margin-bottom: 30px; }
                    .document-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
                    .document-card { border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fafafa; }
                    .document-title { font-weight: bold; color: #2c5aa0; margin-bottom: 10px; font-size: 16px; }
                    .document-info { color: #666; font-size: 14px; margin-bottom: 15px; }
                    .btn { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-size: 12px; }
                    .btn-primary { background: #2c5aa0; color: white; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .status-available { background: #d4edda; color: #155724; }
                    .status-missing { background: #f8d7da; color: #721c24; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>DOCUMENTS SOUMIS</h1>
                        <h2>Protocole PROT-%d</h2>
                        <p><strong>%s</strong></p>
                        <p>Chercheur: %s | Institution: %s</p>
                    </div>
                    
                    <div class="document-grid">
                        <div class="document-card">
                            <div class="document-title">📄 Protocole Complet</div>
                            <div class="document-info">Fichier: %s</div>
                            <span class="status-badge %s">%s</span>
                            <div style="margin-top: 15px;">
                                <a href="/api/files/view-by-protocol/%d/protocol" target="_blank" class="btn btn-primary">Ouvrir</a>
                            </div>
                        </div>
                        
                        <div class="document-card">
                            <div class="document-title">📝 Formulaire de Consentement</div>
                            <div class="document-info">Fichier: %s</div>
                            <span class="status-badge %s">%s</span>
                            <div style="margin-top: 15px;">
                                <a href="/api/files/view-by-protocol/%d/consent" target="_blank" class="btn btn-primary">Ouvrir</a>
                            </div>
                        </div>
                        
                        <div class="document-card">
                            <div class="document-title">👨🎓 CVs des Investigateurs</div>
                            <div class="document-info">Fichier: %s</div>
                            <span class="status-badge %s">%s</span>
                            <div style="margin-top: 15px;">
                                <a href="/api/files/view-by-protocol/%d/cv" target="_blank" class="btn btn-primary">Ouvrir</a>
                            </div>
                        </div>
                        
                        <div class="document-card">
                            <div class="document-title">💰 Reçu de Paiement DAF</div>
                            <div class="document-info">Fichier: %s</div>
                            <span class="status-badge %s">%s</span>
                            <div style="margin-top: 15px;">
                                <a href="/api/files/view-by-protocol/%d/receipt" target="_blank" class="btn btn-primary">Ouvrir</a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                id, id, title, submitterName, institution,
                protocolFile, 
                !"Aucun".equals(protocolFile) ? "status-available" : "status-missing",
                !"Aucun".equals(protocolFile) ? "Disponible" : "Non fourni",
                id,
                consentFile,
                !"Aucun".equals(consentFile) ? "status-available" : "status-missing",
                !"Aucun".equals(consentFile) ? "Disponible" : "Non fourni",
                id,
                cvFiles,
                !"Aucun".equals(cvFiles) ? "status-available" : "status-missing",
                !"Aucun".equals(cvFiles) ? "Disponible" : "Non fourni",
                id,
                paymentFile,
                !"Aucun".equals(paymentFile) ? "status-available" : "status-missing",
                !"Aucun".equals(paymentFile) ? "Disponible" : "Non fourni",
                id
            );

        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_HTML)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
            .body(htmlContent);
    }
}