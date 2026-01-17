package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "protocol_id")
    private ProtocolSubmission protocol;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private Type type;

    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime readAt;

    public enum Type {
        PROTOCOL_SUBMITTED, PROTOCOL_VALIDATED, PROTOCOL_ASSIGNED, 
        PROTOCOL_REVIEWED, DEADLINE_REMINDER, STATUS_CHANGED
    }

    public Notification() {}

    public Notification(User user, ProtocolSubmission protocol, String title, String message, Type type) {
        this.user = user;
        this.protocol = protocol;
        this.title = title;
        this.message = message;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ProtocolSubmission getProtocol() { return protocol; }
    public void setProtocol(ProtocolSubmission protocol) { this.protocol = protocol; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}