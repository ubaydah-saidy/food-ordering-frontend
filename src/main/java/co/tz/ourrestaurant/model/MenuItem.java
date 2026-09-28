package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 160)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MenuCategory category;

    @Column(nullable = false)
    private Long priceTzs;

    @Column(columnDefinition = "TEXT")
    private String description = "";

    @Column(columnDefinition = "TEXT")
    private String image = "";

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String value) { name = value; }
    public MenuCategory getCategory() { return category; }
    public void setCategory(MenuCategory value) { category = value; }
    public Long getPriceTzs() { return priceTzs; }
    public void setPriceTzs(Long value) { priceTzs = value; }
    public String getDescription() { return description; }
    public void setDescription(String value) { description = value; }
    public String getImage() { return image; }
    public void setImage(String value) { image = value; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean value) { available = value; }
    public Instant getCreatedAt() { return createdAt; }
}