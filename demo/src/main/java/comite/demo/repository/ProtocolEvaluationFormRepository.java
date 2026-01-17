package comite.demo.repository;

import comite.demo.entity.ProtocolEvaluationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProtocolEvaluationFormRepository extends JpaRepository<ProtocolEvaluationForm, Long> {
    List<ProtocolEvaluationForm> findByProtocolId(Long protocolId);
    List<ProtocolEvaluationForm> findByMemberId(Long memberId);
    List<ProtocolEvaluationForm> findByResearcherId(Long researcherId);
    Optional<ProtocolEvaluationForm> findByProtocolIdAndMemberId(Long protocolId, Long memberId);
}
