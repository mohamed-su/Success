package comite.demo.dto;

import comite.demo.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateUserDto {
    
    @NotBlank(message = "Le nom d'utilisateur est requis")
    private String username;
    
    @NotBlank(message = "Le mot de passe est requis")
    private String password;
    
    @Email(message = "Format d'email invalide")
    @NotBlank(message = "L'email est requis")
    private String email;
    
    @NotBlank(message = "Le prénom est requis")
    private String firstName;
    
    @NotBlank(message = "Le nom est requis")
    private String lastName;
    
    @NotNull(message = "Le rôle est requis")
    private User.Role role;
    
    private String phoneNumber;
    
    public CreateUserDto() {}
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}