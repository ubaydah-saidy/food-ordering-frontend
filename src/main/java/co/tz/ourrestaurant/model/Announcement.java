package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false, length = 160)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    @Column(nullable = false, length = 60)
    private String badge = "ANNOUNCEMENT";
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String value) { title = value; }
    public String getMessage() { return message; }
    public void setMessage(String value) { message = value; }
    public String getBadge() { return badge; }
    public void setBadge(String value) { badge = value; }
    public Instant getCreatedAt() { return createdAt; }
}