package comite.demo.service;

import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProtocolValidationService {
    
    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean protocolExists(Long protocolId) {
        if (protocolId == null || protocolId <= 0) {
            return false;
        }
        return protocolRepository.existsById(protocolId);
    }
    
    public boolean userExists(Long userId) {
        if (userId == null || userId <= 0) {
            return false;
        }
        return userRepository.existsById(userId);
    }
    
    public void validateProtocolAssignment(Long protocolId, Long userId) {
        if (!protocolExists(protocolId)) {
            throw new IllegalArgumentException("Protocol with ID " + protocolId + " does not exist");
        }
        if (!userExists(userId)) {
            throw new IllegalArgumentException("User with ID " + userId + " does not exist");
        }
    }
}