package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "carts", uniqueConstraints = @UniqueConstraint(columnNames = "customer_id"))
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private AppUser customer;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public Long getId() { return id; }
    public AppUser getCustomer() { return customer; }
    public void setCustomer(AppUser value) { customer = value; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant value) { updatedAt = value; }
}