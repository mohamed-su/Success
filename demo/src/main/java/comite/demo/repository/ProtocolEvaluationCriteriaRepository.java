package comite.demo.repository;

import comite.demo.entity.ProtocolEvaluationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProtocolEvaluationCriteriaRepository extends JpaRepository<ProtocolEvaluationCriteria, Long> {
    
    List<ProtocolEvaluationCriteria> findByProtocolId(Long protocolId);
    
    List<ProtocolEvaluationCriteria> findByProtocolIdAndStatus(Long protocolId, String status);
    
    Optional<ProtocolEvaluationCriteria> findByProtocolIdAndEvaluatorId(Long protocolId, Long evaluatorId);
    
    List<ProtocolEvaluationCriteria> findByEvaluatorId(Long evaluatorId);
    
    List<ProtocolEvaluationCriteria> findByEvaluatorRole(String evaluatorRole);
    
    boolean existsByProtocolIdAndEvaluatorId(Long protocolId, Long evaluatorId);
}