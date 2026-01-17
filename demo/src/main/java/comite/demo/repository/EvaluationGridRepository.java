package comite.demo.repository;

import comite.demo.entity.EvaluationGrid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationGridRepository extends JpaRepository<EvaluationGrid, Long> {
    
    List<EvaluationGrid> findByProtocolId(Long protocolId);
    
    List<EvaluationGrid> findByMemberId(Long memberId);
    
    Optional<EvaluationGrid> findByProtocolIdAndMemberId(Long protocolId, Long memberId);
    
    List<EvaluationGrid> findByStatus(String status);
    
    List<EvaluationGrid> findByProtocolIdAndStatus(Long protocolId, String status);
}
