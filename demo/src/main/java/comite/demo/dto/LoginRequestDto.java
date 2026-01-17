package comite.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {
    
    @NotBlank(message = "Le nom d'utilisateur est requis")
    private String username;
    
    @NotBlank(message = "Le mot de passe est requis")
    private String password;
    
    private String twoFactorCode;
    
    public LoginRequestDto() {}
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getTwoFactorCode() { return twoFactorCode; }
    public void setTwoFactorCode(String twoFactorCode) { this.twoFactorCode = twoFactorCode; }
}