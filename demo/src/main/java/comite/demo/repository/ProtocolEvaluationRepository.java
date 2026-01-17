package comite.demo.repository;

import comite.demo.entity.ProtocolEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProtocolEvaluationRepository extends JpaRepository<ProtocolEvaluation, Long> {
    
    List<ProtocolEvaluation> findByProtocolId(Long protocolId);
    
    List<ProtocolEvaluation> findByEvaluatorId(Long evaluatorId);
    
    Optional<ProtocolEvaluation> findByProtocolIdAndEvaluatorId(Long protocolId, Long evaluatorId);
    
    List<ProtocolEvaluation> findByIsFinalTrue();
    
    List<ProtocolEvaluation> findByProtocolIdAndIsFinalTrue(Long protocolId);
}