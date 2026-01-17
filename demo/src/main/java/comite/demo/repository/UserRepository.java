package comite.demo.repository;

import comite.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByUserIdentifier(String userIdentifier);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndActiveTrue(User.Role role);
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.role = ?1 AND u.active = true")
    List<User> findActiveUsersByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.role IN ('COMMITTEE_MEMBER', 'RAPPORTEUR') AND u.active = true")
    List<User> findActiveCommitteeUsers();
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.role IN ('PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR') AND u.active = true")
    List<User> findCommitteeMembers();
    
    // Méthodes pour l'administration
    long countByActive(boolean active);
    long countByRole(User.Role role);
    boolean existsByRole(User.Role role);
}