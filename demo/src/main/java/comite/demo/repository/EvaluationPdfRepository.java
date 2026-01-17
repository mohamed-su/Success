package comite.demo.repository;

import comite.demo.entity.EvaluationPdf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationPdfRepository extends JpaRepository<EvaluationPdf, Long> {
    
    List<EvaluationPdf> findByProtocolId(Long protocolId);
    
    List<EvaluationPdf> findByProtocolIdOrderByCreatedAtDesc(Long protocolId);
    
    Optional<EvaluationPdf> findByProtocolIdAndEvaluatorId(Long protocolId, Long evaluatorId);
    
    List<EvaluationPdf> findByEvaluatorId(Long evaluatorId);
    
    Optional<EvaluationPdf> findByCriteriaId(Long criteriaId);
    
    List<EvaluationPdf> findByStatus(String status);
}