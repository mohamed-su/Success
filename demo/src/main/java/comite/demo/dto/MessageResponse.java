package comite.demo.dto;

public class MessageResponse {
    private boolean success;
    private String message;
    private Object data;
    
    public MessageResponse() {}
    
    public MessageResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public static MessageResponse success(String message) {
        return new MessageResponse(true, message, null);
    }
    
    public static MessageResponse success(String message, Object data) {
        return new MessageResponse(true, message, data);
    }
    
    public static MessageResponse error(String message) {
        return new MessageResponse(false, message, null);
    }
    
    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}