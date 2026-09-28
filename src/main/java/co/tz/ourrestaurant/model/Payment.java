package co.tz.ourrestaurant.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private RestaurantOrder order;

    @Column(nullable = false, length = 32)
    private String method;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private PaymentStatus status = PaymentStatus.PENDING;
    @Column(nullable = false)
    private Long amountTzs;
    @Column(unique = true, length = 160)
    private String providerReference;
    @Column(length = 40)
    private String maskedAccount;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public RestaurantOrder getOrder() { return order; }
    public void setOrder(RestaurantOrder value) { order = value; }
    public String getMethod() { return method; }
    public void setMethod(String value) { method = value; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus value) { status = value; }
    public Long getAmountTzs() { return amountTzs; }
    public void setAmountTzs(Long value) { amountTzs = value; }
    public String getProviderReference() { return providerReference; }
    public void setProviderReference(String value) { providerReference = value; }
    public String getMaskedAccount() { return maskedAccount; }
    public void setMaskedAccount(String value) { maskedAccount = value; }
    public Instant getCreatedAt() { return createdAt; }
}