package comite.demo.config;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.ProtocolMemberAssignment;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.ProtocolMemberAssignmentRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// @Component - Données gérées par PostgreSQL
public class TestDataInitializer implements CommandLineRunner {

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private ProtocolMemberAssignmentRepository assignmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Créer des protocoles de test s'ils n'existent pas
        if (protocolRepository.count() == 0) {
            createTestProtocols();
        }
        
        // Créer des assignations de test
        if (assignmentRepository.count() == 0) {
            createTestAssignments();
        }
    }

    private void createTestProtocols() {
        ProtocolSubmission protocol1 = new ProtocolSubmission();
        protocol1.setTitle("Étude sur l'efficacité des traitements");
        protocol1.setDescription("Recherche comparative sur les nouveaux traitements");
        protocol1.setPrincipalInvestigator("Dr. Martin Dupont");
        protocol1.setInstitution("CHU de Ouagadougou");
        protocol1.setParticipants(100);
        protocol1.setDuration(12);
        protocol1.setStatus("ASSIGNED_TO_MEMBER");
        protocol1.setSubmittedAt(LocalDateTime.now().minusDays(5));
        protocol1.setSubmitterName("Dr. Martin Dupont");
        protocol1.setPaymentStatus("PAID");
        protocolRepository.save(protocol1);

        ProtocolSubmission protocol2 = new ProtocolSubmission();
        protocol2.setTitle("Impact des nouvelles thérapies");
        protocol2.setDescription("Analyse de l'impact des thérapies innovantes");
        protocol2.setPrincipalInvestigator("Dr. Sarah Ouedraogo");
        protocol2.setInstitution("Université de Ouagadougou");
        protocol2.setParticipants(50);
        protocol2.setDuration(8);
        protocol2.setStatus("ASSIGNED_TO_MEMBER");
        protocol2.setSubmittedAt(LocalDateTime.now().minusDays(3));
        protocol2.setSubmitterName("Dr. Sarah Ouedraogo");
        protocol2.setPaymentStatus("PAID");
        protocolRepository.save(protocol2);

        ProtocolSubmission protocol3 = new ProtocolSubmission();
        protocol3.setTitle("Étude clinique randomisée");
        protocol3.setDescription("Essai clinique sur de nouveaux médicaments");
        protocol3.setPrincipalInvestigator("Dr. Jean Kaboré");
        protocol3.setInstitution("IRSS Ouagadougou");
        protocol3.setParticipants(200);
        protocol3.setDuration(18);
        protocol3.setStatus("ASSIGNED_TO_MEMBER");
        protocol3.setSubmittedAt(LocalDateTime.now().minusDays(7));
        protocol3.setSubmitterName("Dr. Jean Kaboré");
        protocol3.setPaymentStatus("PAID");
        protocolRepository.save(protocol3);

        ProtocolSubmission protocol4 = new ProtocolSubmission();
        protocol4.setTitle("Recherche en santé publique");
        protocol4.setDescription("Étude épidémiologique sur les maladies tropicales");
        protocol4.setPrincipalInvestigator("Dr. Marie Sawadogo");
        protocol4.setInstitution("Institut de Recherche");
        protocol4.setParticipants(300);
        protocol4.setDuration(24);
        protocol4.setStatus("ASSIGNED_TO_MEMBER");
        protocol4.setSubmittedAt(LocalDateTime.now().minusDays(10));
        protocol4.setSubmitterName("Dr. Marie Sawadogo");
        protocol4.setPaymentStatus("PAID");
        protocolRepository.save(protocol4);

        ProtocolSubmission protocol5 = new ProtocolSubmission();
        protocol5.setTitle("Innovation thérapeutique");
        protocol5.setDescription("Développement de nouvelles approches thérapeutiques");
        protocol5.setPrincipalInvestigator("Dr. Paul Traoré");
        protocol5.setInstitution("Centre de Recherche Médicale");
        protocol5.setParticipants(150);
        protocol5.setDuration(15);
        protocol5.setStatus("ASSIGNED_TO_MEMBER");
        protocol5.setSubmittedAt(LocalDateTime.now().minusDays(2));
        protocol5.setSubmitterName("Dr. Paul Traoré");
        protocol5.setPaymentStatus("PAID");
        protocolRepository.save(protocol5);
    }

    private void createTestAssignments() {
        // Récupérer l'utilisateur président (ID 4)
        User president = userRepository.findById(4L).orElse(null);
        if (president == null) return;

        // Assigner tous les protocoles au président
        for (long protocolId = 1L; protocolId <= 5L; protocolId++) {
            ProtocolSubmission protocol = protocolRepository.findById(protocolId).orElse(null);
            if (protocol != null) {
                ProtocolMemberAssignment assignment = new ProtocolMemberAssignment(
                    protocol.getId(), 
                    president.getId(), 
                    president.getFirstName() + " " + president.getLastName(),
                    1L, 
                    "Admin System"
                );
                assignmentRepository.save(assignment);
            }
        }
    }
}