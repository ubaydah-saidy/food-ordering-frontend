package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private AppUser recipient;
    @Column(nullable = false, length = 160)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    private Instant readAt;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public AppUser getRecipient() { return recipient; }
    public void setRecipient(AppUser value) { recipient = value; }
    public String getTitle() { return title; }
    public void setTitle(String value) { title = value; }
    public String getMessage() { return message; }
    public void setMessage(String value) { message = value; }
    public Instant getReadAt() { return readAt; }
    public void setReadAt(Instant value) { readAt = value; }
    public Instant getCreatedAt() { return createdAt; }
}