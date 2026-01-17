// package comite.demo.controller;

// import comite.demo.entity.User;

// import org.apache.tomcat.util.net.openssl.ciphers.Protocol;
// import org.springframework.mock.web.MockMultipartFile;

// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.Map;

// /**
//  * Classe utilitaire pour générer des données de test pour les APIs de protocole
//  */
// public class ProtocolApiTestData {

//     // Données de test pour les utilisateurs
//     public static class TestUsers {
//         public static User createResearcher() {
//             User researcher = new User();
//             researcher.setUsername("researcher_test");
//             researcher.setPassword("password123");
//             researcher.setEmail("researcher@test.com");
//             researcher.setFirstName("Jean");
//             researcher.setLastName("Dupont");
//             researcher.setRole(User.Role.RESEARCHER);
//             researcher.setActive(true);
//             researcher.setCreatedAt(LocalDateTime.now());
//             return researcher;
//         }

//         public static User createAdmin() {
//             User admin = new User();
//             admin.setUsername("admin_test");
//             admin.setPassword("admin123");
//             admin.setEmail("admin@test.com");
//             admin.setFirstName("Admin");
//             admin.setLastName("System");
//             admin.setRole(User.Role.ADMIN);
//             admin.setActive(true);
//             return admin;
//         }
//     }

//     // Données de test pour les protocoles
//     public static class TestProtocols {
//         public static Map<String, String> getCompleteProtocolData() {
//             Map<String, String> data = new HashMap<>();
//             data.put("title", "Étude clinique randomisée sur l'efficacité du traitement X");
//             data.put("description", "Étude multicentrique randomisée en double aveugle pour évaluer l'efficacité et la sécurité du traitement X chez les patients atteints de la maladie Y");
//             data.put("studyType", "CLINICAL_TRIAL");
//             data.put("principalInvestigator", "Dr. Marie Kaboré");
//             data.put("institution", "CHU Yalgado Ouédraogo");
//             data.put("duration", "24");
//             data.put("participants", "200");
//             data.put("ethicsConsiderations", "Respect des principes éthiques de la déclaration d'Helsinki. Consentement éclairé obligatoire.");
//             data.put("studyDurationMonths", "24");
//             data.put("participantCount", "200");
//             data.put("ethicalConsiderations", "Respect des principes éthiques de la déclaration d'Helsinki");
//             return data;
//         }

//         public static Map<String, String> getMinimalProtocolData() {
//             Map<String, String> data = new HashMap<>();
//             data.put("title", "Étude observationnelle simple");
//             data.put("description", "Description minimale pour test");
//             return data;
//         }

//         public static Map<String, String> getObservationalStudyData() {
//             Map<String, String> data = new HashMap<>();
//             data.put("title", "Étude observationnelle sur les habitudes alimentaires");
//             data.put("description", "Étude transversale pour analyser les habitudes alimentaires de la population urbaine");
//             data.put("studyType", "OBSERVATIONAL_STUDY");
//             data.put("principalInvestigator", "Dr. Fatou Traoré");
//             data.put("institution", "Université Joseph Ki-Zerbo");
//             data.put("duration", "12");
//             data.put("participants", "500");
//             data.put("ethicsConsiderations", "Anonymisation des données. Consentement verbal suffisant.");
//             return data;
//         }

//         public static Map<String, String> getSurveyStudyData() {
//             Map<String, String> data = new HashMap<>();
//             data.put("title", "Enquête sur la satisfaction des patients");
//             data.put("description", "Enquête par questionnaire sur la satisfaction des patients hospitalisés");
//             data.put("studyType", "SURVEY_STUDY");
//             data.put("principalInvestigator", "Dr. Amadou Sawadogo");
//             data.put("institution", "CHU Bogodogo");
//             data.put("duration", "6");
//             data.put("participants", "1000");
//             data.put("ethicsConsiderations", "Participation volontaire et anonyme");
//             return data;
//         }

//         public static Protocol createTestProtocol(User researcher) {
//             Protocol protocol = new Protocol();
//             protocol.setTitle("Protocole de test automatisé");
//             protocol.setDescription("Description générée pour les tests");
//             protocol.setStudyType(Protocol.StudyType.CLINICAL_TRIAL);
//             protocol.setPrincipalInvestigator("Dr. Test");
//             protocol.setInstitution("Institution Test");
//             protocol.setStudyDurationMonths(12);
//             protocol.setParticipantCount(100);
//             protocol.setEthicalConsiderations("Considérations éthiques de test");
//             protocol.setResearcher(researcher);
//             protocol.setStatus(Protocol.Status.SUBMITTED);
//             protocol.setSubmittedAt(LocalDateTime.now());
//             return protocol;
//         }
//     }

//     // Fichiers de test
//     public static class TestFiles {
//         public static MockMultipartFile createProtocolFile() {
//             return new MockMultipartFile(
//                 "protocolFile", 
//                 "protocole_recherche.pdf", 
//                 "application/pdf", 
//                 "Contenu du protocole de recherche en PDF".getBytes()
//             );
//         }

//         public static MockMultipartFile createConsentForm() {
//             return new MockMultipartFile(
//                 "consentForm", 
//                 "formulaire_consentement.pdf", 
//                 "application/pdf", 
//                 "Formulaire de consentement éclairé".getBytes()
//             );
//         }

//         public static MockMultipartFile createConsentFormFile() {
//             return new MockMultipartFile(
//                 "consentFormFile", 
//                 "formulaire_consentement.pdf", 
//                 "application/pdf", 
//                 "Formulaire de consentement éclairé".getBytes()
//             );
//         }

//         public static MockMultipartFile createCvFile() {
//             return new MockMultipartFile(
//                 "cvFiles", 
//                 "cv_investigateur.pdf", 
//                 "application/pdf", 
//                 "CV de l'investigateur principal".getBytes()
//             );
//         }

//         public static MockMultipartFile createInvestigatorCvFiles() {
//             return new MockMultipartFile(
//                 "investigatorCvFiles", 
//                 "cv_investigateur.pdf", 
//                 "application/pdf", 
//                 "CV de l'investigateur principal".getBytes()
//             );
//         }

//         public static MockMultipartFile createPaymentReceipt() {
//             return new MockMultipartFile(
//                 "paymentReceipt", 
//                 "recu_paiement.pdf", 
//                 "application/pdf", 
//                 "Reçu de paiement des frais d'évaluation".getBytes()
//             );
//         }

//         public static MockMultipartFile createPaymentReceiptFile() {
//             return new MockMultipartFile(
//                 "paymentReceiptFile", 
//                 "recu_paiement.pdf", 
//                 "application/pdf", 
//                 "Reçu de paiement des frais d'évaluation".getBytes()
//             );
//         }

//         public static MockMultipartFile createInvalidFile() {
//             return new MockMultipartFile(
//                 "invalidFile", 
//                 "fichier_invalide.txt", 
//                 "text/plain", 
//                 "Contenu de fichier non autorisé".getBytes()
//             );
//         }

//         public static MockMultipartFile createLargeFile() {
//             byte[] largeContent = new byte[10 * 1024 * 1024]; // 10MB
//             return new MockMultipartFile(
//                 "largeFile", 
//                 "gros_fichier.pdf", 
//                 "application/pdf", 
//                 largeContent
//             );
//         }
//     }

//     // Scénarios de test
//     public static class TestScenarios {
//         public static final String COMPLETE_SUBMISSION = "Soumission complète avec tous les fichiers";
//         public static final String MINIMAL_SUBMISSION = "Soumission minimale";
//         public static final String MISSING_FILES = "Soumission avec fichiers manquants";
//         public static final String INVALID_USER = "Soumission avec utilisateur invalide";
//         public static final String UNAUTHORIZED_ACCESS = "Accès non autorisé";
//         public static final String INVALID_DATA = "Données invalides";
//         public static final String LARGE_FILES = "Fichiers volumineux";
//         public static final String DUPLICATE_SUBMISSION = "Soumission en double";
//     }

//     // Messages d'erreur attendus
//     public static class ExpectedMessages {
//         public static final String SUCCESS_SUBMISSION = "Protocole soumis avec succès";
//         public static final String USER_NOT_FOUND = "Utilisateur non trouvé";
//         public static final String AUTHENTICATION_REQUIRED = "Authentification requise";
//         public static final String INVALID_FILE_TYPE = "Type de fichier non autorisé";
//         public static final String FILE_TOO_LARGE = "Fichier trop volumineux";
//         public static final String MISSING_REQUIRED_FIELD = "Champ obligatoire manquant";
//         public static final String INTERNAL_ERROR = "Erreur interne du serveur";
//     }

//     // Codes de statut HTTP attendus
//     public static class ExpectedStatus {
//         public static final int SUCCESS = 200;
//         public static final int BAD_REQUEST = 400;
//         public static final int UNAUTHORIZED = 401;
//         public static final int FORBIDDEN = 403;
//         public static final int NOT_FOUND = 404;
//         public static final int INTERNAL_SERVER_ERROR = 500;
//     }
// }