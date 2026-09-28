package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "delivery_assignments", uniqueConstraints = @UniqueConstraint(columnNames = "order_id"))
public class DeliveryAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private RestaurantOrder order;
    @ManyToOne(optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private AppUser staff;
    @Column(nullable = false, updatable = false)
    private Instant assignedAt = Instant.now();

    public Long getId() { return id; }
    public RestaurantOrder getOrder() { return order; }
    public void setOrder(RestaurantOrder value) { order = value; }
    public AppUser getStaff() { return staff; }
    public void setStaff(AppUser value) { staff = value; }
    public Instant getAssignedAt() { return assignedAt; }
}