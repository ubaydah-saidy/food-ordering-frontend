package co.tz.ourrestaurant.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private RestaurantOrder order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @Column(nullable = false, length = 160)
    private String nameSnapshot;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MenuCategory categorySnapshot;
    @Column(nullable = false)
    private Long unitPriceTzs;
    @Column(nullable = false)
    private int quantity;

    public Long getId() { return id; }
    public RestaurantOrder getOrder() { return order; }
    public void setOrder(RestaurantOrder value) { order = value; }
    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem value) { menuItem = value; }
    public String getNameSnapshot() { return nameSnapshot; }
    public void setNameSnapshot(String value) { nameSnapshot = value; }
    public MenuCategory getCategorySnapshot() { return categorySnapshot; }
    public void setCategorySnapshot(MenuCategory value) { categorySnapshot = value; }
    public Long getUnitPriceTzs() { return unitPriceTzs; }
    public void setUnitPriceTzs(Long value) { unitPriceTzs = value; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int value) { quantity = value; }
}