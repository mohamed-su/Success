package comite.demo.repository;

import comite.demo.entity.CommitteeSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommitteeSessionRepository extends JpaRepository<CommitteeSession, Long> {
    
    Optional<CommitteeSession> findByStatus(String status);
    
    Optional<CommitteeSession> findFirstByStatusOrderByCreatedAtDesc(String status);
}