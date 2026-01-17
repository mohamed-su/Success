package comite.demo.repository;

import comite.demo.entity.ProtocolMemberAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProtocolMemberAssignmentRepository extends JpaRepository<ProtocolMemberAssignment, Long> {
    
    List<ProtocolMemberAssignment> findByMemberId(Long memberId);
    
    List<ProtocolMemberAssignment> findByProtocolId(Long protocolId);
    
    @Query("SELECT p.memberName as memberName, COUNT(p) as count FROM ProtocolMemberAssignment p GROUP BY p.memberName")
    List<Object[]> countAssignmentsByMember();
    
    @Query("SELECT p FROM ProtocolMemberAssignment p WHERE p.memberId = :memberId AND p.status = 'ASSIGNED'")
    List<ProtocolMemberAssignment> findActiveAssignmentsByMember(@Param("memberId") Long memberId);
}