package comite.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProtocolSubmissionTestSuite {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private User testResearcher;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Créer un utilisateur chercheur pour les tests
        testResearcher = new User();
        testResearcher.setUsername("testresearcher");
        testResearcher.setPassword("password123");
        testResearcher.setEmail("researcher@test.com");
        testResearcher.setFirstName("Test");
        testResearcher.setLastName("Researcher");
        testResearcher.setRole(User.Role.RESEARCHER);
        testResearcher.setActive(true);
        testResearcher = userRepository.save(testResearcher);
    }

    @Test
    @Order(1)
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    @DisplayName("Test soumission protocole avec données complètes - ResearcherController")
    void testSubmitProtocol_ResearcherController_Complete() throws Exception {
        MockMultipartFile protocolFile = new MockMultipartFile(
                "protocolFile", "protocol.pdf", "application/pdf", "Protocol content".getBytes());
        MockMultipartFile consentForm = new MockMultipartFile(
                "consentForm", "consent.pdf", "application/pdf", "Consent form content".getBytes());
        MockMultipartFile cvFile = new MockMultipartFile(
                "cvFiles", "cv.pdf", "application/pdf", "CV content".getBytes());
        MockMultipartFile paymentReceipt = new MockMultipartFile(
                "paymentReceipt", "receipt.pdf", "application/pdf", "Receipt content".getBytes());

        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .file(protocolFile)
                .file(consentForm)
                .file(cvFile)
                .file(paymentReceipt)
                .param("title", "Étude clinique sur l'efficacité du traitement X")
                .param("description", "Description détaillée de l'étude clinique randomisée")
                .param("studyType", "CLINICAL_TRIAL")
                .param("principalInvestigator", "Dr. Jean Dupont")
                .param("institution", "CHU de Ouagadougou")
                .param("duration", "24")
                .param("participants", "200")
                .param("ethicsConsiderations", "Respect des principes éthiques de Helsinki")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Protocole soumis avec succès"))
                .andExpect(jsonPath("$.protocolId").exists())
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @Order(2)
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    @DisplayName("Test soumission protocole avec données minimales - ResearcherController")
    void testSubmitProtocol_ResearcherController_Minimal() throws Exception {
        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .param("title", "Étude observationnelle")
                .param("description", "Description minimale")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.protocolId").exists());
    }

    @Test
    @Order(3)
    @DisplayName("Test soumission protocole avec données complètes - ProtocolController")
    void testSubmitProtocol_ProtocolController_Complete() throws Exception {
        MockMultipartFile protocolFile = new MockMultipartFile(
                "protocolFile", "protocol.pdf", "application/pdf", "Protocol content".getBytes());
        MockMultipartFile consentForm = new MockMultipartFile(
                "consentFormFile", "consent.pdf", "application/pdf", "Consent form".getBytes());
        MockMultipartFile cvFile = new MockMultipartFile(
                "investigatorCvFiles", "cv.pdf", "application/pdf", "CV content".getBytes());
        MockMultipartFile paymentReceipt = new MockMultipartFile(
                "paymentReceiptFile", "receipt.pdf", "application/pdf", "Receipt".getBytes());

        mockMvc.perform(multipart("/api/protocols-old/submit")
                .file(protocolFile)
                .file(consentForm)
                .file(cvFile)
                .file(paymentReceipt)
                .param("title", "Étude interventionnelle sur le diabète")
                .param("studyType", "INTERVENTIONAL_STUDY")
                .param("principalInvestigator", "Dr. Marie Kaboré")
                .param("institution", "Université de Ouagadougou")
                .param("ethicalConsiderations", "Consentement éclairé obligatoire")
                .param("studyDurationMonths", "18")
                .param("participantCount", "150")
                .param("submitterId", testResearcher.getId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Étude interventionnelle sur le diabète"))
                .andExpect(jsonPath("$.studyType").value("INTERVENTIONAL_STUDY"));
    }

    @Test
    @Order(4)
    @DisplayName("Test récupération des types d'études")
    void testGetStudyTypes() throws Exception {
        mockMvc.perform(get("/api/protocols-old/study-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasItem("CLINICAL_TRIAL")))
                .andExpect(jsonPath("$", hasItem("OBSERVATIONAL_STUDY")))
                .andExpect(jsonPath("$", hasItem("INTERVENTIONAL_STUDY")));
    }

    @Test
    @Order(5)
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    @DisplayName("Test récupération des protocoles du chercheur")
    void testGetMyProtocols() throws Exception {
        // D'abord soumettre un protocole
        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .param("title", "Mon protocole de test")
                .param("description", "Description de test")
                .contentType(MediaType.MULTIPART_FORM_DATA));

        // Puis récupérer les protocoles
        mockMvc.perform(get("/api/researcher/protocols/my-protocols"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.protocols").isArray())
                .andExpect(jsonPath("$.count").isNumber())
                .andExpect(jsonPath("$.protocols[0].title").exists());
    }

    @Test
    @Order(6)
    @DisplayName("Test soumission sans authentification")
    void testSubmitProtocol_WithoutAuthentication() throws Exception {
        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .param("title", "Test sans auth")
                .param("description", "Test")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk()) // ResearcherController gère ce cas
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(7)
    @DisplayName("Test soumission avec utilisateur inexistant - ProtocolController")
    void testSubmitProtocol_InvalidUser() throws Exception {
        MockMultipartFile protocolFile = new MockMultipartFile(
                "protocolFile", "protocol.pdf", "application/pdf", "Content".getBytes());
        MockMultipartFile consentForm = new MockMultipartFile(
                "consentFormFile", "consent.pdf", "application/pdf", "Content".getBytes());
        MockMultipartFile cvFile = new MockMultipartFile(
                "investigatorCvFiles", "cv.pdf", "application/pdf", "Content".getBytes());
        MockMultipartFile paymentReceipt = new MockMultipartFile(
                "paymentReceiptFile", "receipt.pdf", "application/pdf", "Content".getBytes());

        mockMvc.perform(multipart("/api/protocols-old/submit")
                .file(protocolFile)
                .file(consentForm)
                .file(cvFile)
                .file(paymentReceipt)
                .param("title", "Test avec utilisateur inexistant")
                .param("studyType", "CLINICAL_TRIAL")
                .param("principalInvestigator", "Dr. Test")
                .param("institution", "Test Uni")
                .param("studyDurationMonths", "12")
                .param("participantCount", "100")
                .param("submitterId", "99999")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Utilisateur non trouvé"));
    }

    @Test
    @Order(8)
    @DisplayName("Test récupération de tous les protocoles")
    void testGetAllProtocols() throws Exception {
        mockMvc.perform(get("/api/protocols-old"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(9)
    @DisplayName("Test récupération d'un protocole par ID")
    void testGetProtocolById() throws Exception {
        // Créer un protocole de test
        ProtocolSubmission protocol = new ProtocolSubmission();
        protocol.setTitle("Protocole de test");
        protocol.setDescription("Description de test");
        protocol.setStatus("SUBMITTED");
        ProtocolSubmission savedProtocol = protocolRepository.save(protocol);

        mockMvc.perform(get("/api/protocols-old/" + savedProtocol.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedProtocol.getId()))
                .andExpect(jsonPath("$.title").value("Protocole de test"));
    }

    @Test
    @Order(10)
    @DisplayName("Test récupération d'un protocole inexistant")
    void testGetProtocolById_NotFound() throws Exception {
        mockMvc.perform(get("/api/protocols-old/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(11)
    @DisplayName("Test gestion des erreurs - données manquantes")
    void testSubmitProtocol_MissingRequiredData() throws Exception {
        MockMultipartFile protocolFile = new MockMultipartFile(
                "protocolFile", "protocol.pdf", "application/pdf", "Content".getBytes());

        mockMvc.perform(multipart("/api/protocols-old/submit")
                .file(protocolFile)
                .param("submitterId", testResearcher.getId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(12)
    @WithMockUser(username = "nonexistent", roles = {"RESEARCHER"})
    @DisplayName("Test récupération protocoles avec utilisateur inexistant")
    void testGetMyProtocols_UserNotFound() throws Exception {
        mockMvc.perform(get("/api/researcher/protocols/my-protocols"))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.error").value("INTERNAL_ERROR"));
    }
}