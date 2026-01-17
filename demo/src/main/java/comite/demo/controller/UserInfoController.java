package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserInfoController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/current/{userId}")
    public ResponseEntity<?> getCurrentUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Utilisateur non trouvé"
                ));
            }
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole().toString());
            userInfo.put("active", user.isActive());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", userInfo
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/all-active")
    public ResponseEntity<?> getAllActiveUsers() {
        try {
            var users = userRepository.findByActiveTrue();
            
            var userList = users.stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("firstName", user.getFirstName());
                    userInfo.put("lastName", user.getLastName());
                    userInfo.put("username", user.getUsername());
                    userInfo.put("role", user.getRole().toString());
                    userInfo.put("active", user.isActive());
                    return userInfo;
                })
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "users", userList,
                "count", userList.size()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}