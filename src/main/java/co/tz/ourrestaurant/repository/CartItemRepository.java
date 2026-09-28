package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);
    Optional<CartItem> findByCartIdAndMenuItemId(Long cartId, String menuItemId);
    void deleteByCartId(Long cartId);
}