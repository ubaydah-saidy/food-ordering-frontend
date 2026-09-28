package co.tz.ourrestaurant.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items", uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "menu_item_id"}))
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(optional = false)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private int quantity;

    public Long getId() { return id; }
    public Cart getCart() { return cart; }
    public void setCart(Cart value) { cart = value; }
    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem value) { menuItem = value; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int value) { quantity = value; }
}