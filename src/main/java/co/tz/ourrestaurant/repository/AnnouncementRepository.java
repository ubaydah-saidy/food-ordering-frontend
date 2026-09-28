package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.Announcement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
}