package comite.demo.repository;

import comite.demo.entity.ProtocolSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProtocolSubmissionRepository extends JpaRepository<ProtocolSubmission, Long> {
    
    List<ProtocolSubmission> findBySubmitterNameOrderBySubmittedAtDesc(String submitterName);
    
    List<ProtocolSubmission> findByStatusOrderBySubmittedAtDesc(String status);
    
    List<ProtocolSubmission> findByStatus(String status);
    
    List<ProtocolSubmission> findByStatusOrderByIdAsc(String status);
    
    List<ProtocolSubmission> findAllByOrderByIdAsc();
    
    List<ProtocolSubmission> findBySubmitterIdentifierOrderByIdAsc(String submitterIdentifier);
    
    List<ProtocolSubmission> findBySubmitterNameOrderByIdAsc(String submitterName);
    
    // Méthodes pour la gestion des paiements
    List<ProtocolSubmission> findByPaymentStatus(String paymentStatus);
    long countByPaymentStatus(String paymentStatus);
    

}