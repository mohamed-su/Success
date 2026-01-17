package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserManagementController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", "Utilisateur non trouvé"));
        }

        User user = userOpt.get();
        
        if (data.containsKey("firstName")) user.setFirstName(String.valueOf(data.get("firstName")));
        if (data.containsKey("lastName")) user.setLastName(String.valueOf(data.get("lastName")));
        if (data.containsKey("email")) user.setEmail(String.valueOf(data.get("email")));
        if (data.containsKey("username")) user.setUsername(String.valueOf(data.get("username")));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Utilisateur modifié"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", "Utilisateur non trouvé"));
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Utilisateur supprimé"));
    }
}
