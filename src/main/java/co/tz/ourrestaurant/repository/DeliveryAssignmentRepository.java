package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.DeliveryAssignment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {
    Optional<DeliveryAssignment> findByOrderId(String orderId);
}