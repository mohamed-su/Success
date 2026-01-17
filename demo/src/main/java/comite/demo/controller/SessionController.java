package comite.demo.controller;

import comite.demo.entity.CommitteeSession;
import comite.demo.entity.User;
import comite.demo.repository.CommitteeSessionRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SessionController {

    @Autowired
    private CommitteeSessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/members")
    public ResponseEntity<?> getCommitteeMembers() {
        try {
            // Récupérer tous les utilisateurs actifs (pas seulement COMMITTEE_MEMBER)
            List<User> allUsers = userRepository.findAll();
            System.out.println("Nombre total d'utilisateurs: " + allUsers.size());
            
            // Filtrer les membres du comité et autres rôles éligibles
            List<User> eligibleMembers = allUsers.stream()
                .filter(User::isActive)
                .filter(user -> user.getRole() == User.Role.COMMITTEE_MEMBER || 
                               user.getRole() == User.Role.RAPPORTEUR)
                .collect(Collectors.toList());
            
            System.out.println("Membres éligibles trouvés: " + eligibleMembers.size());
            
            List<Map<String, Object>> memberList = eligibleMembers.stream()
                .map(member -> {
                    Map<String, Object> memberInfo = new HashMap<>();
                    memberInfo.put("id", member.getId());
                    memberInfo.put("name", member.getFirstName() + " " + member.getLastName());
                    memberInfo.put("username", member.getUsername());
                    memberInfo.put("email", member.getEmail());
                    memberInfo.put("role", member.getRole().toString());
                    System.out.println("Membre: " + member.getUsername() + " - " + member.getRole());
                    return memberInfo;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "members", memberList,
                "count", memberList.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/designate-rapporteur")
    public ResponseEntity<?> designateRapporteur(@RequestBody Map<String, Object> request) {
        try {
            Long rapporteurId = Long.valueOf(request.get("rapporteurId").toString());
            String rapporteurName = (String) request.get("rapporteurName");
            Long presidentId = Long.valueOf(request.get("presidentId").toString());
            String presidentName = (String) request.get("presidentName");

            // Fermer la session active précédente s'il y en a une
            sessionRepository.findFirstByStatusOrderByCreatedAtDesc("ACTIVE")
                .ifPresent(session -> {
                    session.setStatus("COMPLETED");
                    sessionRepository.save(session);
                });

            // Créer nouvelle session avec rapporteur désigné
            CommitteeSession newSession = new CommitteeSession(
                rapporteurId, rapporteurName, presidentId, presidentName
            );
            
            CommitteeSession savedSession = sessionRepository.save(newSession);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Rapporteur désigné avec succès pour la session",
                "session", Map.of(
                    "id", savedSession.getId(),
                    "rapporteurName", savedSession.getRapporteurName(),
                    "sessionDate", savedSession.getSessionDate()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentSession() {
        try {
            CommitteeSession currentSession = sessionRepository
                .findFirstByStatusOrderByCreatedAtDesc("ACTIVE")
                .orElse(null);

            if (currentSession == null) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "hasActiveSession", false
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "hasActiveSession", true,
                "session", Map.of(
                    "id", currentSession.getId(),
                    "rapporteurId", currentSession.getRapporteurId(),
                    "rapporteurName", currentSession.getRapporteurName(),
                    "sessionDate", currentSession.getSessionDate(),
                    "designatedBy", currentSession.getDesignatedByName()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}