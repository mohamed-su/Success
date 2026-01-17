package comite.demo.repository;

import comite.demo.entity.SimpleProtocolAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SimpleAssignmentRepository extends JpaRepository<SimpleProtocolAssignment, Long> {
    List<SimpleProtocolAssignment> findByAssignedMemberId(Long memberId);
    List<SimpleProtocolAssignment> findByProtocolId(Long protocolId);
    Optional<SimpleProtocolAssignment> findByProtocolIdAndAssignedMemberId(Long protocolId, Long memberId);
    List<SimpleProtocolAssignment> findByAssignedAtBetween(LocalDateTime start, LocalDateTime end);
    boolean existsByProtocolId(Long protocolId);
    boolean existsByProtocolIdAndAssignedMemberId(Long protocolId, Long memberId);
}