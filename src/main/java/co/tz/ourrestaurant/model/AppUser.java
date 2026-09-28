package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_username", columnNames = "username"),
    @UniqueConstraint(name = "uk_user_phone", columnNames = "phone"),
    @UniqueConstraint(name = "uk_user_email", columnNames = "email")
})
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String username;

    @Column(nullable = false, length = 32)
    private String phone;

    @Column(length = 254)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 160)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UserRole role = UserRole.CUSTOMER;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String address;

    private Double latitude;
    private Double longitude;

    @Column(length = 120)
    private String vehicle;

    @Column(nullable = false, length = 32)
    private String availability = "Available";

    private boolean active = true;
    @Column(length = 36)
    private String sessionToken;
    private Instant sessionExpiresAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String value) { username = value; }
    public String getPhone() { return phone; }
    public void setPhone(String value) { phone = value; }
    public String getEmail() { return email; }
    public void setEmail(String value) { email = value; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String value) { passwordHash = value; }
    public String getFullName() { return fullName; }
    public void setFullName(String value) { fullName = value; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole value) { role = value; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String value) { avatarUrl = value; }
    public String getAddress() { return address; }
    public void setAddress(String value) { address = value; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double value) { latitude = value; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double value) { longitude = value; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String value) { vehicle = value; }
    public String getAvailability() { return availability; }
    public void setAvailability(String value) { availability = value; }
    public boolean isActive() { return active; }
    public void setActive(boolean value) { active = value; }
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String value) { sessionToken = value; }
    public Instant getSessionExpiresAt() { return sessionExpiresAt; }
    public void setSessionExpiresAt(Instant value) { sessionExpiresAt = value; }
    public Instant getCreatedAt() { return createdAt; }
}