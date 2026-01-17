package comite.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class ProtocolSubmissionIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Créer un utilisateur chercheur pour les tests
        User researcher = new User();
        researcher.setUsername("testresearcher");
        researcher.setPassword("password");
        researcher.setEmail("researcher@test.com");
        researcher.setFirstName("Test");
        researcher.setLastName("Researcher");
        researcher.setRole(User.Role.RESEARCHER);
        researcher.setActive(true);
        userRepository.save(researcher);
    }

    @Test
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    void testSubmitProtocol_WithValidData() throws Exception {
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
                .param("title", "Test Protocol Title")
                .param("description", "Detailed protocol description")
                .param("studyType", "CLINICAL_TRIAL")
                .param("principalInvestigator", "Dr. John Doe")
                .param("institution", "Test University")
                .param("duration", "12")
                .param("participants", "100")
                .param("ethicsConsiderations", "All ethical guidelines followed")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Protocole soumis avec succès"))
                .andExpect(jsonPath("$.protocolId").exists())
                .andExpect(jsonPath("$.status").value("SUBMITTED"));
    }

    @Test
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    void testSubmitProtocol_WithMissingFiles() throws Exception {
        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .param("title", "Test Protocol")
                .param("description", "Test description")
                .param("studyType", "CLINICAL_TRIAL")
                .param("principalInvestigator", "Dr. Test")
                .param("institution", "Test Uni")
                .param("duration", "6")
                .param("participants", "50")
                .param("ethicsConsiderations", "Ethics considered")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testSubmitProtocol_WithoutAuthentication() throws Exception {
        MockMultipartFile protocolFile = new MockMultipartFile(
                "protocolFile", "protocol.pdf", "application/pdf", "Content".getBytes());

        mockMvc.perform(multipart("/api/researcher/protocols/submit")
                .file(protocolFile)
                .param("title", "Test Protocol")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testresearcher", roles = {"RESEARCHER"})
    void testGetMyProtocols() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                .get("/api/researcher/protocols/my-protocols"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.protocols").isArray())
                .andExpect(jsonPath("$.count").isNumber());
    }
}