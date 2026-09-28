package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.RestaurantOrder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<RestaurantOrder, String> {
    List<RestaurantOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<RestaurantOrder> findAllByOrderByCreatedAtDesc();
    List<RestaurantOrder> findDistinctByAssignmentStaffIdOrderByCreatedAtDesc(Long staffId);
    Optional<RestaurantOrder> findByIdAndCustomerId(String id, Long customerId);
    Optional<RestaurantOrder> findByIdAndAssignmentStaffId(String id, Long staffId);
}