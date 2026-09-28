package co.tz.ourrestaurant.api;

import co.tz.ourrestaurant.model.AppUser;
import co.tz.ourrestaurant.service.RestaurantService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RestaurantController {
    private final RestaurantService service;

    public RestaurantController(RestaurantService service) { this.service = service; }

    @GetMapping("/health")
    public Map<String, String> health() { return service.health(); }

    @GetMapping("/menu")
    public List<Map<String, Object>> menu(@RequestParam(required = false) String category,
                                          @RequestParam(required = false) String search) {
        return service.getMenu(category, search, false);
    }

    @GetMapping("/menu/{id}")
    public Map<String, Object> menuItem(@PathVariable String id) { return service.getMenuItem(id); }

    @PostMapping("/admin/menu")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> createMenuItem(@Valid @RequestBody ApiDtos.MenuItemRequest request) {
        return service.createMenuItem(request);
    }

    @GetMapping("/admin/menu")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> adminMenu() { return service.getMenu(null, null, true); }

    @PutMapping("/admin/menu/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> updateMenuItem(@PathVariable String id, @Valid @RequestBody ApiDtos.MenuItemRequest request) {
        return service.updateMenuItem(id, request);
    }

    @DeleteMapping("/admin/menu/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMenuItem(@PathVariable String id) { service.deleteMenuItem(id); }

    @GetMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> getCart(@AuthenticationPrincipal AppUser user) { return service.getCart(user); }

    @PutMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> syncCart(@AuthenticationPrincipal AppUser user, @Valid @RequestBody ApiDtos.CartSync request) {
        return service.syncCart(user, request);
    }

    @PostMapping("/cart/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> addCartItem(@AuthenticationPrincipal AppUser user, @Valid @RequestBody ApiDtos.CartLine request) {
        return service.addCartItem(user, request);
    }

    @PatchMapping("/cart/items/{menuItemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> updateCartItem(@AuthenticationPrincipal AppUser user, @PathVariable String menuItemId,
                                               @RequestBody Map<String, Integer> request) {
        Integer quantity = request.get("quantity");
        if (quantity == null || quantity < 0 || quantity > 99) throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity must be between 0 and 99.");
        return service.updateCartItem(user, menuItemId, quantity);
    }

    @DeleteMapping("/cart/items/{menuItemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> removeCartItem(@AuthenticationPrincipal AppUser user, @PathVariable String menuItemId) {
        return service.removeCartItem(user, menuItemId);
    }

    @DeleteMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> clearCart(@AuthenticationPrincipal AppUser user) { return service.clearCart(user); }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String, Object> checkout(@AuthenticationPrincipal AppUser user, @Valid @RequestBody ApiDtos.CheckoutRequest request) {
        return service.checkout(user, request);
    }

    @GetMapping("/orders/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Map<String, Object>> customerOrders(@AuthenticationPrincipal AppUser user) { return service.customerOrders(user); }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public Map<String, Object> customerOrder(@AuthenticationPrincipal AppUser user, @PathVariable String id) {
        if (user.getRole().name().equals("ADMIN")) return service.adminOrder(id);
        return service.customerOrder(user, id);
    }

    @GetMapping("/orders/{id}/payments")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<Map<String, Object>> orderPayments(@AuthenticationPrincipal AppUser user, @PathVariable String id) {
        return service.orderPayments(user, id);
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> allOrders() { return service.allOrders(); }

    @PostMapping("/admin/orders/{id}/assignment")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> assignOrder(@PathVariable String id, @Valid @RequestBody ApiDtos.AssignmentRequest request) {
        return service.assignOrder(id, request.staffId());
    }

    @GetMapping("/delivery/orders")
    @PreAuthorize("hasRole('DELIVERY')")
    public List<Map<String, Object>> staffOrders(@AuthenticationPrincipal AppUser user) { return service.staffOrders(user); }

    @GetMapping("/delivery/orders/{id}")
    @PreAuthorize("hasRole('DELIVERY')")
    public Map<String, Object> staffOrder(@AuthenticationPrincipal AppUser user, @PathVariable String id) {
        return service.staffOrder(user, id);
    }

    @PatchMapping("/delivery/orders/{id}/status")
    @PreAuthorize("hasRole('DELIVERY')")
    public Map<String, Object> updateDeliveryStatus(@AuthenticationPrincipal AppUser user, @PathVariable String id,
                                                    @Valid @RequestBody ApiDtos.StatusRequest request) {
        return service.updateDeliveryStatus(user, id, request.status());
    }

    @GetMapping("/admin/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> customers() { return service.customers(); }

    @GetMapping("/admin/delivery-staff")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> deliveryStaff() { return service.deliveryStaff(); }

    @PostMapping("/admin/delivery-staff")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> createDeliveryStaff(@Valid @RequestBody ApiDtos.DeliveryRegistration request) {
        return service.createDeliveryStaff(request);
    }

    @PatchMapping("/admin/delivery-staff/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> toggleStaffStatus(@PathVariable Long id) { return service.toggleStaffStatus(id); }

    @DeleteMapping("/admin/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) { service.deleteUser(id); }

    @GetMapping("/admin/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> adminPayments() { return service.adminPayments(); }

    @GetMapping("/admin/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> dashboardStats() { return service.dashboardStats(); }

    @GetMapping("/announcements")
    public List<Map<String, Object>> announcements() { return service.announcements(); }

    @PostMapping("/admin/announcements")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> addAnnouncement(@Valid @RequestBody ApiDtos.AnnouncementRequest request) {
        return service.addAnnouncement(request);
    }

    @PutMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> updateAnnouncement(@PathVariable String id, @Valid @RequestBody ApiDtos.AnnouncementRequest request) {
        return service.updateAnnouncement(id, request);
    }

    @DeleteMapping("/admin/announcements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAnnouncement(@PathVariable String id) { service.deleteAnnouncement(id); }

    @GetMapping("/notifications")
    public List<Map<String, Object>> notifications(@AuthenticationPrincipal AppUser user) { return service.userNotifications(user); }

    @PatchMapping("/notifications/{id}/read")
    public Map<String, String> markNotificationRead(@AuthenticationPrincipal AppUser user, @PathVariable String id) {
        service.markNotificationRead(user, id);
        return Map.of("message", "Notification marked as read.");
    }
}