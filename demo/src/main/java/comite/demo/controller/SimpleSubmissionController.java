package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.repository.ProtocolSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/researcher")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SimpleSubmissionController {

    @Autowired
    private ProtocolSubmissionRepository repository;
    
    @Autowired
    private comite.demo.repository.SimpleAssignmentRepository assignmentRepository;
    
    @Autowired
    private comite.demo.service.EmailService emailService;
    
    @Autowired
    private comite.demo.repository.UserRepository userRepository;

    @PostMapping("/protocols/save-draft")
    public ResponseEntity<?> saveDraft(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "studyType", required = false) String studyType,
            @RequestParam(value = "principalInvestigator", required = false) String principalInvestigator,
            @RequestParam(value = "institution", required = false) String institution,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "participants", required = false) Integer participants,
            @RequestParam(value = "ethicsConsiderations", required = false) String ethicsConsiderations,
            @RequestParam(value = "protocolFile", required = false) MultipartFile protocolFile,
            @RequestParam(value = "consentForm", required = false) MultipartFile consentForm,
            @RequestParam(value = "cvFiles", required = false) MultipartFile[] cvFiles,
            @RequestParam(value = "paymentReceipt", required = false) MultipartFile paymentReceipt,
            @RequestParam(value = "presidentLetter", required = false) MultipartFile presidentLetter,
            @RequestParam(value = "informationNotice", required = false) MultipartFile informationNotice,
            @RequestParam(value = "informedConsent", required = false) MultipartFile informedConsent,
            @RequestParam(value = "chronogram", required = false) MultipartFile chronogram,
            @RequestParam(value = "detailedBudget", required = false) MultipartFile detailedBudget,
            @RequestParam(value = "evaluationReport", required = false) MultipartFile evaluationReport) {

        return saveProtocol(title, description, studyType, principalInvestigator, institution, 
                          duration, participants, ethicsConsiderations, protocolFile, consentForm, 
                          cvFiles, paymentReceipt, presidentLetter, informationNotice, informedConsent,
                          chronogram, detailedBudget, evaluationReport, null, "DRAFT");
    }

    @PostMapping("/protocols/submit")
    public ResponseEntity<?> submit(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "studyType", required = false) String studyType,
            @RequestParam(value = "principalInvestigator", required = false) String principalInvestigator,
            @RequestParam(value = "institution", required = false) String institution,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "participants", required = false) Integer participants,
            @RequestParam(value = "ethicsConsiderations", required = false) String ethicsConsiderations,
            @RequestParam(value = "protocolFile", required = false) MultipartFile protocolFile,
            @RequestParam(value = "consentForm", required = false) MultipartFile consentForm,
            @RequestParam(value = "cvFiles", required = false) MultipartFile[] cvFiles,
            @RequestParam(value = "paymentReceipt", required = false) MultipartFile paymentReceipt,
            @RequestParam(value = "presidentLetter", required = false) MultipartFile presidentLetter,
            @RequestParam(value = "informationNotice", required = false) MultipartFile informationNotice,
            @RequestParam(value = "informedConsent", required = false) MultipartFile informedConsent,
            @RequestParam(value = "chronogram", required = false) MultipartFile chronogram,
            @RequestParam(value = "detailedBudget", required = false) MultipartFile detailedBudget,
            @RequestParam(value = "evaluationReport", required = false) MultipartFile evaluationReport,
            @RequestParam(value = "submitterIdentifier", required = false) String submitterIdentifier) {

        System.out.println("Soumission reçue avec submitterIdentifier: " + submitterIdentifier);
        
        return saveProtocol(title, description, studyType, principalInvestigator, institution, 
                          duration, participants, ethicsConsiderations, protocolFile, consentForm, 
                          cvFiles, paymentReceipt, presidentLetter, informationNotice, informedConsent,
                          chronogram, detailedBudget, evaluationReport, submitterIdentifier, "SUBMITTED");
    }

    @GetMapping("/protocols/my-protocols")
    public ResponseEntity<?> getMyProtocols(@RequestParam String userIdentifier) {
        try {
            if (userIdentifier == null || userIdentifier.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Identifiant utilisateur requis"
                ));
            }
            
            System.out.println("Recherche protocoles pour utilisateur: " + userIdentifier);
            List<ProtocolSubmission> protocols = repository.findBySubmitterIdentifierOrderByIdAsc(userIdentifier);
            System.out.println("Protocoles trouvés: " + protocols.size());
            
            // Debug: afficher les identifiants des protocoles trouvés
            protocols.forEach(p -> System.out.println("Protocole ID: " + p.getId() + ", Soumis par: " + p.getSubmitterIdentifier()));
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "userIdentifier", userIdentifier
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{id}")
    public ResponseEntity<?> getProtocolDetails(@PathVariable Long id, @RequestParam String userIdentifier) {
        try {
            ProtocolSubmission protocol = repository.findById(id).orElse(null);
            if (protocol == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            // Vérifier que l'utilisateur peut accéder à ce protocole
            if (!userIdentifier.equals(protocol.getSubmitterIdentifier())) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Accès non autorisé à ce protocole"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol", protocol
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{id}/files")
    public ResponseEntity<?> getProtocolFiles(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "files", Map.of(
                    "protocolFile", "/api/files/view-by-protocol/" + id + "/protocol",
                    "consentForm", "/api/files/view-by-protocol/" + id + "/consent",
                    "cvFiles", "/api/files/view-by-protocol/" + id + "/cv",
                    "paymentReceipt", "/api/files/view-by-protocol/" + id + "/receipt"
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/validate")
    public ResponseEntity<?> validateProtocol(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            var protocol = repository.findById(id);
            if (protocol.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ProtocolSubmission p = protocol.get();
            String action = request.get("action");

            if ("approve".equals(action)) {
                p.setStatus("VALIDATED");
            } else if ("reject".equals(action)) {
                p.setStatus("REJECTED");
            }

            repository.save(p);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole " + ("approve".equals(action) ? "validé" : "rejeté") + " avec succès",
                "status", p.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/update")
    public ResponseEntity<?> updateProtocol(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "studyType", required = false) String studyType,
            @RequestParam(value = "principalInvestigator", required = false) String principalInvestigator,
            @RequestParam(value = "institution", required = false) String institution,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "participants", required = false) Integer participants,
            @RequestParam(value = "ethicsConsiderations", required = false) String ethicsConsiderations,
            @RequestParam(value = "protocolFile", required = false) MultipartFile protocolFile,
            @RequestParam(value = "consentForm", required = false) MultipartFile consentForm,
            @RequestParam(value = "cvFiles", required = false) MultipartFile[] cvFiles,
            @RequestParam(value = "paymentReceipt", required = false) MultipartFile paymentReceipt,
            @RequestParam(value = "userIdentifier", required = false) String userIdentifier) {
        
        try {
            var protocolOpt = repository.findById(id);
            if (protocolOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            ProtocolSubmission protocol = protocolOpt.get();
            
            // Vérifier que l'utilisateur peut modifier ce protocole
            if (userIdentifier != null && !userIdentifier.equals(protocol.getSubmitterIdentifier())) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Accès non autorisé à ce protocole"
                ));
            }
            
            // Vérifier que le protocole peut être modifié (statut rejeté ou brouillon)
            if (!"VERIFICATION_REJECTED".equals(protocol.getStatus()) && 
                !"REJECTED".equals(protocol.getStatus()) && 
                !"DRAFT".equals(protocol.getStatus())) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Ce protocole ne peut plus être modifié"
                ));
            }
            
            // Mettre à jour les champs fournis
            if (title != null) protocol.setTitle(title);
            if (description != null) protocol.setDescription(description);
            if (studyType != null) protocol.setStudyType(studyType);
            if (principalInvestigator != null) protocol.setPrincipalInvestigator(principalInvestigator);
            if (institution != null) protocol.setInstitution(institution);
            if (duration != null) protocol.setDuration(duration);
            if (participants != null) protocol.setParticipants(participants);
            if (ethicsConsiderations != null) protocol.setEthicsConsiderations(ethicsConsiderations);
            
            // Mettre à jour les fichiers si fournis
            if (protocolFile != null && !protocolFile.isEmpty()) {
                protocol.setProtocolFileName(saveFile(protocolFile, "protocol"));
            }
            if (consentForm != null && !consentForm.isEmpty()) {
                protocol.setConsentFormFileName(saveFile(consentForm, "consent"));
            }
            if (cvFiles != null && cvFiles.length > 0 && !cvFiles[0].isEmpty()) {
                protocol.setCvFilesNames(saveFile(cvFiles[0], "cv"));
            }
            if (paymentReceipt != null && !paymentReceipt.isEmpty()) {
                protocol.setPaymentReceiptFileName(saveFile(paymentReceipt, "receipt"));
            }
            
            // Remettre le statut à SUBMITTED si c'était rejeté
            if ("VERIFICATION_REJECTED".equals(protocol.getStatus()) || "REJECTED".equals(protocol.getStatus())) {
                protocol.setStatus("SUBMITTED");
                protocol.setSubmittedAt(LocalDateTime.now());
                protocol.setVerificationComments(null); // Effacer les anciens commentaires
            }
            
            ProtocolSubmission saved = repository.save(protocol);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole mis à jour et resoumis avec succès",
                "protocol", saved
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/statistics")
    public ResponseEntity<?> getProtocolStatistics(@RequestParam(required = false) String userIdentifier) {
        try {
            List<ProtocolSubmission> protocols;
            
            if (userIdentifier != null && !userIdentifier.isEmpty()) {
                protocols = repository.findBySubmitterIdentifierOrderByIdAsc(userIdentifier);
            } else {
                protocols = repository.findAllByOrderByIdAsc();
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", protocols.size());
            stats.put("submitted", protocols.stream().filter(p -> "SUBMITTED".equals(p.getStatus())).count());
            stats.put("verified", protocols.stream().filter(p -> "VERIFIED".equals(p.getStatus())).count());
            stats.put("rejected", protocols.stream().filter(p -> "VERIFICATION_REJECTED".equals(p.getStatus())).count());
            stats.put("approved", protocols.stream().filter(p -> "APPROVED".equals(p.getStatus())).count());
            stats.put("pendingReview", protocols.stream().filter(p -> 
                "SUBMITTED".equals(p.getStatus()) || "VERIFIED".equals(p.getStatus())).count());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "statistics", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/search")
    public ResponseEntity<?> searchProtocols(
            @RequestParam(required = false) String userIdentifier,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String status) {
        try {
            List<ProtocolSubmission> protocols;
            
            if (userIdentifier != null && !userIdentifier.isEmpty()) {
                protocols = repository.findBySubmitterIdentifierOrderByIdAsc(userIdentifier);
            } else {
                protocols = repository.findAllByOrderByIdAsc();
            }
            
            // Filtrage par année
            if (year != null && !year.isEmpty()) {
                int yearInt = Integer.parseInt(year);
                protocols = protocols.stream()
                    .filter(p -> p.getSubmittedAt().getYear() == yearInt)
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // Filtrage par mois
            if (month != null && !month.isEmpty()) {
                int monthInt = Integer.parseInt(month);
                protocols = protocols.stream()
                    .filter(p -> p.getSubmittedAt().getMonthValue() == monthInt)
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // Filtrage par statut
            if (status != null && !status.isEmpty() && !"all".equals(status)) {
                protocols = protocols.stream()
                    .filter(p -> status.equalsIgnoreCase(p.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "API fonctionnelle");
        
        // Test d'envoi d'email
        try {
            String email = "ouedraogomohamedamine98@gmail.com";
            System.out.println("=== TEST EMAIL ===");
            System.out.println("Tentative d'envoi vers: " + email);
            
            if (emailService != null) {
                emailService.sendProtocolSubmissionConfirmation(email, "Test User", "Test Protocol", 999L);
                response.put("email_test", "Email envoyé vers " + email);
                System.out.println("Email envoyé avec succès");
            } else {
                response.put("email_test", "EmailService est null");
                System.out.println("EmailService est null");
            }
        } catch (Exception e) {
            response.put("email_error", e.getMessage());
            System.out.println("Erreur email: " + e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody(required = false) Map<String, String> request) {
        try {
            String email = "ouedraogomohamedamine98@gmail.com"; // Email par défaut
            
            if (request != null && request.get("email") != null && !request.get("email").isEmpty()) {
                email = request.get("email");
            }
            
            System.out.println("Test d'envoi d'email vers: " + email);
            emailService.sendProtocolSubmissionConfirmation(email, "Test User", "Test Protocol", 999L);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de test envoyé à " + email,
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.err.println("Erreur test email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }
    
    @GetMapping("/test-email-simple")
    public ResponseEntity<?> testEmailSimple() {
        try {
            String email = "ouedraogomohamedamine98@gmail.com";
            System.out.println("Test d'envoi d'email vers: " + email);
            emailService.sendProtocolSubmissionConfirmation(email, "Test User", "Test Protocol", 999L);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de test envoyé à " + email,
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.err.println("Erreur test email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }
    
    @GetMapping("/debug/all-protocols")
    public ResponseEntity<?> debugAllProtocols() {
        try {
            List<ProtocolSubmission> allProtocols = repository.findAll();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "total", allProtocols.size(),
                "protocols", allProtocols
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/rapporteur/assigned/{userId}")
    public ResponseEntity<?> getRapporteurProtocols(@PathVariable Long userId) {
        try {
            List<ProtocolSubmission> protocols = repository.findAll();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/rapporteur-protocols")
    public ResponseEntity<?> getRapporteurProtocolsSimple(@RequestParam(required = false) Long userId) {
        try {
            // Si aucun userId fourni, retourner une liste vide
            if (userId == null) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "protocols", List.of(),
                    "count", 0,
                    "message", "Aucun utilisateur spécifié"
                ));
            }
            
            // Utiliser le contrôleur CommitteeMember pour récupérer les protocoles assignés
            return getAssignedProtocolsForUser(userId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private ResponseEntity<?> getAssignedProtocolsForUser(Long userId) {
        try {
            List<comite.demo.entity.SimpleProtocolAssignment> assignments = assignmentRepository.findByAssignedMemberId(userId);
            
            System.out.println("Recherche assignations pour userId: " + userId);
            System.out.println("Assignations trouvées: " + assignments.size());
            
            List<Map<String, Object>> protocols = assignments.stream()
                .map(assignment -> {
                    ProtocolSubmission protocol = repository.findById(assignment.getProtocolId()).orElse(null);
                    if (protocol != null) {
                        Map<String, Object> protocolInfo = new HashMap<>();
                        protocolInfo.put("id", protocol.getId());
                        protocolInfo.put("title", protocol.getTitle());
                        protocolInfo.put("description", protocol.getDescription());
                        protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
                        protocolInfo.put("institution", protocol.getInstitution());
                        protocolInfo.put("participants", protocol.getParticipants());
                        protocolInfo.put("duration", protocol.getDuration());
                        protocolInfo.put("status", protocol.getStatus());
                        protocolInfo.put("submittedAt", protocol.getSubmittedAt());
                        protocolInfo.put("assignedAt", assignment.getAssignedAt());
                        protocolInfo.put("canEdit", assignment.getCanEdit());
                        protocolInfo.put("downloaded", assignment.getDownloaded());
                        protocolInfo.put("protocolCode", "PROT-" + protocol.getId());
                        protocolInfo.put("ethicalConsiderations", protocol.getEthicalConsiderations());
                        return protocolInfo;
                    }
                    return null;
                })
                .filter(p -> p != null)
                .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/fix-protocol-ownership")
    public ResponseEntity<?> fixProtocolOwnership(@RequestBody Map<String, String> request) {
        try {
            String userIdentifier = request.get("userIdentifier");
            if (userIdentifier == null || userIdentifier.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Identifiant utilisateur requis"
                ));
            }
            
            // Trouver les protocoles sans identifiant ou avec 'default_user'
            List<ProtocolSubmission> protocolsToFix = repository.findAll().stream()
                .filter(p -> p.getSubmitterIdentifier() == null || 
                           p.getSubmitterIdentifier().equals("default_user") ||
                           p.getSubmitterIdentifier().isEmpty())
                .toList();
            
            System.out.println("Protocoles à corriger: " + protocolsToFix.size());
            
            for (ProtocolSubmission protocol : protocolsToFix) {
                protocol.setSubmitterIdentifier(userIdentifier);
                repository.save(protocol);
                System.out.println("Protocole " + protocol.getId() + " assigné à " + userIdentifier);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "fixed", protocolsToFix.size(),
                "userIdentifier", userIdentifier
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private ResponseEntity<?> saveProtocol(String title, String description, String studyType,
                                         String principalInvestigator, String institution, 
                                         Integer duration, Integer participants, String ethicsConsiderations,
                                         MultipartFile protocolFile, MultipartFile consentForm, 
                                         MultipartFile[] cvFiles, MultipartFile paymentReceipt,
                                         MultipartFile presidentLetter, MultipartFile informationNotice,
                                         MultipartFile informedConsent, MultipartFile chronogram,
                                         MultipartFile detailedBudget, MultipartFile evaluationReport,
                                         String submitterIdentifier, String status) {
        try {
            Path uploadsDir = Paths.get("uploads/protocols");
            if (!Files.exists(uploadsDir)) {
                Files.createDirectories(uploadsDir);
            }

            ProtocolSubmission protocol = new ProtocolSubmission();
            protocol.setTitle(title);
            protocol.setDescription(description);
            protocol.setStudyType(studyType);
            protocol.setPrincipalInvestigator(principalInvestigator != null ? principalInvestigator : "Non spécifié");
            protocol.setInstitution(institution != null ? institution : "Non spécifié");
            protocol.setDuration(duration != null ? duration : 12);
            protocol.setParticipants(participants != null ? participants : 50);
            
            // Fichiers existants
            protocol.setProtocolFileName(saveFile(protocolFile, "protocol"));
            protocol.setConsentFormFileName(saveFile(consentForm, "consent"));
            protocol.setPaymentReceiptFileName(saveFile(paymentReceipt, "receipt"));
            protocol.setCvFilesNames(cvFiles != null && cvFiles.length > 0 ? saveFile(cvFiles[0], "cv") : "Aucun");
            
            // Nouveaux fichiers requis
            protocol.setPresidentLetterFileName(saveFile(presidentLetter, "president_letter"));
            protocol.setInformationNoticeFileName(saveFile(informationNotice, "information_notice"));
            protocol.setInformedConsentFileName(saveFile(informedConsent, "informed_consent"));
            protocol.setChronogramFileName(saveFile(chronogram, "chronogram"));
            protocol.setDetailedBudgetFileName(saveFile(detailedBudget, "detailed_budget"));
            protocol.setEvaluationReportFileName(saveFile(evaluationReport, "evaluation_report"));
            
            protocol.setStatus(status != null ? status.toUpperCase() : "SUBMITTED");
            protocol.setSubmittedAt(LocalDateTime.now());
            protocol.setSubmitterName("Chercheur");
            // S'assurer qu'un identifiant est toujours défini
            String finalIdentifier = (submitterIdentifier != null && !submitterIdentifier.isEmpty()) 
                ? submitterIdentifier : "default_user";
            protocol.setSubmitterIdentifier(finalIdentifier);
            System.out.println("Protocole sauvegardé avec identifiant: " + finalIdentifier);
            protocol.setPaymentStatus("PENDING");

            ProtocolSubmission saved = repository.save(protocol);
            
            // Envoyer email de confirmation si soumission (pas brouillon)
            if ("SUBMITTED".equals(status) && finalIdentifier != null && !"default_user".equals(finalIdentifier)) {
                try {
                    var user = userRepository.findByUsername(finalIdentifier);
                    if (user.isPresent()) {
                        String userEmail = user.get().getEmail();
                        String userName = user.get().getFirstName() + " " + user.get().getLastName();
                        emailService.sendProtocolSubmissionConfirmation(userEmail, userName, title, saved.getId());
                        System.out.println("Email de confirmation envoyé à: " + userEmail);
                    }
                } catch (Exception e) {
                    System.err.println("Erreur envoi email: " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", status.equals("DRAFT") ? "Brouillon sauvegardé" : "Protocole soumis avec succès");
            response.put("protocolId", "PROT-" + saved.getId());
            response.put("id", saved.getId());
            response.put("status", saved.getStatus());
            response.put("workflow", getNextWorkflowSteps(status));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private String saveFile(MultipartFile file, String fileType) throws IOException {
        if (file == null || file.isEmpty()) {
            return "Aucun";
        }
        
        String uniqueId = UUID.randomUUID().toString();
        String originalFilename = file.getOriginalFilename();
        String savedFileName = fileType + "_" + uniqueId + "_" + originalFilename;
        
        Path filePath = Paths.get("uploads/protocols/" + savedFileName);
        Files.write(filePath, file.getBytes());
        
        return originalFilename;
    }
    
    private String[] getNextWorkflowSteps(String currentStatus) {
        switch (currentStatus) {
            case "SUBMITTED":
                return new String[]{
                    "1. Vérification par le secrétariat",
                    "2. Attribution à un rapporteur",
                    "3. Évaluation du protocole",
                    "4. Décision du comité CERS"
                };
            case "VALIDATED":
                return new String[]{
                    "1. Attribution à un rapporteur",
                    "2. Évaluation du protocole",
                    "3. Décision du comité CERS"
                };
            case "ASSIGNED":
                return new String[]{
                    "1. Évaluation par le rapporteur",
                    "2. Décision du comité CERS"
                };
            case "REVIEWED":
                return new String[]{
                    "1. Décision finale du comité CERS"
                };
            default:
                return new String[]{"Workflow terminé"};
        }
    }
}