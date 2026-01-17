package comite.demo.repository;

import comite.demo.entity.MemberEvaluationGrid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberEvaluationGridRepository extends JpaRepository<MemberEvaluationGrid, Long> {
    
    // Trouver toutes les grilles d'évaluation pour un protocole
    List<MemberEvaluationGrid> findByProtocolId(Long protocolId);
    
    // Trouver les grilles d'évaluation d'un membre
    List<MemberEvaluationGrid> findByMemberId(Long memberId);
    
    // Trouver une grille spécifique pour un protocole et un membre
    Optional<MemberEvaluationGrid> findByProtocolIdAndMemberId(Long protocolId, Long memberId);
    
    // Trouver les grilles par statut
    List<MemberEvaluationGrid> findByStatus(String status);
    
    // Trouver les grilles soumises pour un protocole
    List<MemberEvaluationGrid> findByProtocolIdAndStatus(Long protocolId, String status);
    
    // Compter les grilles soumises pour un protocole
    @Query("SELECT COUNT(g) FROM MemberEvaluationGrid g WHERE g.protocolId = ?1 AND g.status = 'SUBMITTED'")
    Long countSubmittedGridsByProtocolId(Long protocolId);
    
    // Vérifier si un membre a déjà une grille pour un protocole
    boolean existsByProtocolIdAndMemberId(Long protocolId, Long memberId);
}