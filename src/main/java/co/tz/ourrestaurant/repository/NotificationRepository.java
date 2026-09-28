package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    @Query("select n from Notification n where n.recipient is null or n.recipient.id = :userId order by n.createdAt desc")
    List<Notification> findVisibleTo(@Param("userId") Long userId);
}