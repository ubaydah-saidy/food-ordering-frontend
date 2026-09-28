package co.tz.ourrestaurant.config;

import co.tz.ourrestaurant.model.*;
import co.tz.ourrestaurant.repository.AnnouncementRepository;
import co.tz.ourrestaurant.repository.MenuItemRepository;
import co.tz.ourrestaurant.repository.UserRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initializeData(MenuItemRepository menu, AnnouncementRepository announcements,
                                     UserRepository users, PasswordEncoder passwords,
                                     @Value("${app.admin-username:}") String adminUsername,
                                     @Value("${app.admin-password:}") String adminPassword) {
        return args -> {
            if (menu.count() == 0) seedMenu(menu);
            if (announcements.count() == 0) seedAnnouncements(announcements);
            if (!adminUsername.isBlank() && !adminPassword.isBlank()) {
                AppUser admin = users.findByUsernameIgnoreCase(adminUsername.trim()).orElseGet(AppUser::new);
                admin.setUsername(adminUsername.trim());
                admin.setFullName("Restaurant Administrator");
                admin.setPhone("+255000000000");
                admin.setEmail(null);
                admin.setPasswordHash(passwords.encode(adminPassword));
                admin.setRole(UserRole.ADMIN);
                users.save(admin);
                logger.info("Demo administrator is configured.");
            } else {
                logger.info("No administrator bootstrap credentials configured.");
            }
        };
    }

    private void seedMenu(MenuItemRepository repository) {
        List<Object[]> entries = List.of(
            row("Special Chicken Biryani", MenuCategory.Foods, 12000, "Zanzibar chicken biryani with aromatic spices and kachumbari.", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"),
            row("Traditional Beef Pilau", MenuCategory.Foods, 10000, "Swahili spiced beef pilau with cardamom and cinnamon.", "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80"),
            row("Chips Mayai / Special Zege", MenuCategory.Foods, 5000, "Golden french fries pan-fried with eggs and kachumbari.", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80"),
            row("Coconut Fish Curry & Ugali", MenuCategory.Foods, 15000, "Fresh fish in spiced coconut cream, served with ugali.", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80"),
            row("Ugali & Roast Meat (Nyama Choma)", MenuCategory.Foods, 14000, "Flame-grilled meat with ugali, greens and kachumbari.", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"),
            row("Steamed Rice, Coconut Beans & Spinach", MenuCategory.Foods, 4500, "Basmati rice with coconut beans and garlic spinach.", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"),
            row("Classic Beef Burger & French Fries", MenuCategory.Foods, 9500, "Grilled beef burger with cheddar, vegetables and fries.", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"),
            row("Grilled Chicken Shawarma Wrap", MenuCategory.Foods, 7000, "Roasted chicken wrap with garlic sauce and pickles.", "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=80"),
            row("Crispy Beef Samosas (3 Pcs)", MenuCategory.Snacks, 3000, "Three golden pastries filled with savory minced beef.", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80"),
            row("Cardamom Sweet Mandazi (4 Pcs)", MenuCategory.Snacks, 2000, "Soft East African mandazi with cardamom and coconut milk.", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            row("Crispy Chickpea Bajias & Chutney", MenuCategory.Snacks, 2500, "Seasoned chickpea fritters with tamarind chutney.", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80"),
            row("Layered Chapati Egg Roll (Rolex)", MenuCategory.Snacks, 3500, "Flaky chapati rolled with egg, peppers and tomatoes.", "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=500&auto=format&fit=crop&q=80"),
            row("Coconut Rice Cakes / Vitumbua (4 Pcs)", MenuCategory.Snacks, 2000, "Four fluffy coconut rice cakes with golden crusts.", "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80"),
            row("Charcoal Grilled Beef Skewers (3 Pcs)", MenuCategory.Snacks, 6000, "Three marinated beef skewers grilled over charcoal.", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80"),
            row("Chilled Fresh Mango Juice", MenuCategory.Drinks, 3000, "Freshly pressed mango juice served chilled.", "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80"),
            row("Fresh Passion Fruit Juice", MenuCategory.Drinks, 3000, "Refreshing sweet-tangy passion fruit juice.", "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&auto=format&fit=crop&q=80"),
            row("Azam Energy Drink (Chilled)", MenuCategory.Drinks, 1500, "Ice-cold sparkling energy drink.", "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=80"),
            row("Spiced Milk Tea (Ginger Masala)", MenuCategory.Drinks, 2500, "Hot milk tea with ginger and cardamom.", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"),
            row("Canned Soda (Coca-Cola/Sprite/Fanta)", MenuCategory.Drinks, 1500, "Chilled 330ml soda can.", "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"),
            row("Kilimanjaro Mineral Water (1.5L)", MenuCategory.Drinks, 1500, "Chilled 1.5 litre mineral water.", "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80")
        );
        for (Object[] entry : entries) {
            MenuItem item = new MenuItem();
            item.setName((String) entry[0]);
            item.setCategory((MenuCategory) entry[1]);
            item.setPriceTzs((Long) entry[2]);
            item.setDescription((String) entry[3]);
            item.setImage((String) entry[4]);
            repository.save(item);
        }
    }

    private Object[] row(String name, MenuCategory category, long price, String description, String image) {
        return new Object[] { name, category, price, description, image };
    }

    private void seedAnnouncements(AnnouncementRepository repository) {
        Announcement offer = new Announcement();
        offer.setTitle("WEEKEND MEGA DISCOUNT!");
        offer.setMessage("Get special offers on selected meals. Ask our team for today's menu.");
        offer.setBadge("SPECIAL OFFER");
        repository.save(offer);
        Announcement tracking = new Announcement();
        tracking.setTitle("ORDER TRACKING");
        tracking.setMessage("Follow your order status from your customer dashboard.");
        tracking.setBadge("UPDATE");
        repository.save(tracking);
    }
}