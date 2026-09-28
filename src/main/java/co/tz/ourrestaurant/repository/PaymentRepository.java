package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.Payment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByOrderIdOrderByCreatedAtDesc(String orderId);
    List<Payment> findAllByOrderByCreatedAtDesc();
}