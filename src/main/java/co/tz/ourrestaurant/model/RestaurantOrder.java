package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class RestaurantOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private AppUser customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private OrderStatus status = OrderStatus.PAYMENT_PENDING;

    @Column(nullable = false)
    private Long subtotalTzs;
    @Column(nullable = false)
    private Long transactionFeeTzs;
    @Column(nullable = false)
    private Long totalTzs;

    @Column(nullable = false, length = 160)
    private String customerNameSnapshot;
    @Column(nullable = false, length = 32)
    private String customerPhoneSnapshot;
    @Column(length = 254)
    private String customerEmailSnapshot;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;
    @Column(nullable = false)
    private Double deliveryLatitude;
    @Column(nullable = false)
    private Double deliveryLongitude;
    private Integer locationAccuracyM;
    private Instant locationCapturedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Payment> payments = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private DeliveryAssignment assignment;

    @PreUpdate
    void updateTimestamp() { updatedAt = Instant.now(); }

    public String getId() { return id; }
    public AppUser getCustomer() { return customer; }
    public void setCustomer(AppUser value) { customer = value; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus value) { status = value; }
    public Long getSubtotalTzs() { return subtotalTzs; }
    public void setSubtotalTzs(Long value) { subtotalTzs = value; }
    public Long getTransactionFeeTzs() { return transactionFeeTzs; }
    public void setTransactionFeeTzs(Long value) { transactionFeeTzs = value; }
    public Long getTotalTzs() { return totalTzs; }
    public void setTotalTzs(Long value) { totalTzs = value; }
    public String getCustomerNameSnapshot() { return customerNameSnapshot; }
    public void setCustomerNameSnapshot(String value) { customerNameSnapshot = value; }
    public String getCustomerPhoneSnapshot() { return customerPhoneSnapshot; }
    public void setCustomerPhoneSnapshot(String value) { customerPhoneSnapshot = value; }
    public String getCustomerEmailSnapshot() { return customerEmailSnapshot; }
    public void setCustomerEmailSnapshot(String value) { customerEmailSnapshot = value; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String value) { deliveryAddress = value; }
    public Double getDeliveryLatitude() { return deliveryLatitude; }
    public void setDeliveryLatitude(Double value) { deliveryLatitude = value; }
    public Double getDeliveryLongitude() { return deliveryLongitude; }
    public void setDeliveryLongitude(Double value) { deliveryLongitude = value; }
    public Integer getLocationAccuracyM() { return locationAccuracyM; }
    public void setLocationAccuracyM(Integer value) { locationAccuracyM = value; }
    public Instant getLocationCapturedAt() { return locationCapturedAt; }
    public void setLocationCapturedAt(Instant value) { locationCapturedAt = value; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return items; }
    public List<Payment> getPayments() { return payments; }
    public DeliveryAssignment getAssignment() { return assignment; }
    public void setAssignment(DeliveryAssignment value) { assignment = value; }
}