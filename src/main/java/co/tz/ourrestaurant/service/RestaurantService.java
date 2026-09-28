package co.tz.ourrestaurant.service;

import co.tz.ourrestaurant.api.ApiDtos;
import co.tz.ourrestaurant.api.ApiException;
import co.tz.ourrestaurant.api.ApiMapper;
import co.tz.ourrestaurant.model.*;
import co.tz.ourrestaurant.repository.*;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RestaurantService {
    private final UserRepository users;
    private final MenuItemRepository menu;
    private final CartRepository carts;
    private final CartItemRepository cartItems;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final DeliveryAssignmentRepository assignments;
    private final AnnouncementRepository announcements;
    private final NotificationRepository notifications;
    private final PasswordEncoder passwords;
    @Value("${app.payments-mode:demo}") private String paymentsMode;

    public RestaurantService(UserRepository users, MenuItemRepository menu, CartRepository carts,
            CartItemRepository cartItems, OrderRepository orders, PaymentRepository payments,
            DeliveryAssignmentRepository assignments, AnnouncementRepository announcements,
            NotificationRepository notifications, PasswordEncoder passwords) {
        this.users = users;
        this.menu = menu;
        this.carts = carts;
        this.cartItems = cartItems;
        this.orders = orders;
        this.payments = payments;
        this.assignments = assignments;
        this.announcements = announcements;
        this.notifications = notifications;
        this.passwords = passwords;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMenu(String category, String search, boolean includeUnavailable) {
        return menu.findAll().stream()
            .filter(item -> includeUnavailable || item.isAvailable())
            .filter(item -> category == null || category.isBlank() || "all".equalsIgnoreCase(category)
                || item.getCategory().name().equalsIgnoreCase(category))
            .filter(item -> search == null || search.isBlank()
                || item.getName().toLowerCase().contains(search.toLowerCase())
                || (item.getDescription() != null && item.getDescription().toLowerCase().contains(search.toLowerCase())))
            .map(ApiMapper::menuItem).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, String> health() {
        menu.count();
        return Map.of("status", "ok", "database", "connected");
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMenuItem(String id) {
        return ApiMapper.menuItem(menu.findById(id).orElseThrow(() -> notFound("Menu item not found.")));
    }

    @Transactional
    public Map<String, Object> createMenuItem(ApiDtos.MenuItemRequest request) {
        MenuItem item = new MenuItem();
        updateMenuItem(item, request);
        return ApiMapper.menuItem(menu.save(item));
    }

    @Transactional
    public Map<String, Object> updateMenuItem(String id, ApiDtos.MenuItemRequest request) {
        MenuItem item = menu.findById(id).orElseThrow(() -> notFound("Menu item not found."));
        updateMenuItem(item, request);
        return ApiMapper.menuItem(menu.save(item));
    }

    @Transactional
    public void deleteMenuItem(String id) {
        MenuItem item = menu.findById(id).orElseThrow(() -> notFound("Menu item not found."));
        item.setAvailable(false);
        menu.save(item);
    }

    private void updateMenuItem(MenuItem item, ApiDtos.MenuItemRequest request) {
        item.setName(request.name().trim());
        item.setCategory(request.category());
        item.setPriceTzs(request.price());
        item.setDescription(request.description() == null ? "" : request.description().trim());
        item.setImage(request.image() == null || request.image().isBlank()
            ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
            : request.image().trim());
        item.setAvailable(request.available() == null || request.available());
    }

    @Transactional
    public Map<String, Object> getCart(AppUser customer) {
        Cart cart = getOrCreateCart(customer);
        return cartResponse(cart);
    }

    @Transactional
    public Map<String, Object> syncCart(AppUser customer, ApiDtos.CartSync request) {
        Cart cart = getOrCreateCart(customer);
        cartItems.deleteByCartId(cart.getId());
        for (ApiDtos.CartLine line : request.items()) {
            MenuItem item = availableMenuItem(line.menuItemId());
            CartItem entry = new CartItem();
            entry.setCart(cart);
            entry.setMenuItem(item);
            entry.setQuantity(line.quantity());
            cartItems.save(entry);
        }
        return cartResponse(cart);
    }

    @Transactional
    public Map<String, Object> addCartItem(AppUser customer, ApiDtos.CartLine line) {
        Cart cart = getOrCreateCart(customer);
        MenuItem item = availableMenuItem(line.menuItemId());
        CartItem entry = cartItems.findByCartIdAndMenuItemId(cart.getId(), item.getId()).orElseGet(() -> {
            CartItem created = new CartItem();
            created.setCart(cart);
            created.setMenuItem(item);
            created.setQuantity(0);
            return created;
        });
        if (entry.getQuantity() + line.quantity() > 99) throw badRequest("Maximum quantity per item is 99.");
        entry.setQuantity(entry.getQuantity() + line.quantity());
        cartItems.save(entry);
        return cartResponse(cart);
    }

    @Transactional
    public Map<String, Object> updateCartItem(AppUser customer, String itemId, int quantity) {
        Cart cart = getOrCreateCart(customer);
        CartItem entry = cartItems.findByCartIdAndMenuItemId(cart.getId(), itemId)
            .orElseThrow(() -> notFound("Cart item not found."));
        if (quantity == 0) cartItems.delete(entry);
        else { entry.setQuantity(quantity); cartItems.save(entry); }
        return cartResponse(cart);
    }

    @Transactional
    public Map<String, Object> removeCartItem(AppUser customer, String itemId) {
        Cart cart = getOrCreateCart(customer);
        cartItems.findByCartIdAndMenuItemId(cart.getId(), itemId).ifPresent(cartItems::delete);
        return cartResponse(cart);
    }

    @Transactional
    public Map<String, Object> clearCart(AppUser customer) {
        carts.findByCustomerId(customer.getId()).ifPresent(cart -> cartItems.deleteByCartId(cart.getId()));
        return getCart(customer);
    }

    private Cart getOrCreateCart(AppUser customer) {
        return carts.findByCustomerId(customer.getId()).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setCustomer(customer);
            return carts.save(cart);
        });
    }

    private Map<String, Object> cartResponse(Cart cart) {
        List<CartItem> entries = cartItems.findByCartId(cart.getId());
        List<Map<String, Object>> values = entries.stream().map(entry -> {
            Map<String, Object> value = new LinkedHashMap<>(ApiMapper.menuItem(entry.getMenuItem()));
            value.put("quantity", entry.getQuantity());
            return value;
        }).toList();
        long total = entries.stream().mapToLong(entry -> entry.getMenuItem().getPriceTzs() * entry.getQuantity()).sum();
        int count = entries.stream().mapToInt(CartItem::getQuantity).sum();
        return Map.of("items", values, "totalAmount", total, "totalCount", count);
    }

    @Transactional
    public Map<String, Object> checkout(AppUser customer, ApiDtos.CheckoutRequest request) {
        if (!"demo".equalsIgnoreCase(paymentsMode)) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "A real payment provider has not been configured. No payment was taken.");
        }
        List<MenuItem> selected = new ArrayList<>();
        long subtotal = 0;
        for (ApiDtos.CheckoutLine line : request.items()) {
            MenuItem item = availableMenuItem(line.menuItemId());
            selected.add(item);
            subtotal += item.getPriceTzs() * line.quantity();
        }
        String method = normalizePaymentMethod(request.paymentMethod());
        long fee = PaymentPricing.transactionFee(method, subtotal);
        RestaurantOrder order = new RestaurantOrder();
        order.setCustomer(customer);
        order.setSubtotalTzs(subtotal);
        order.setTransactionFeeTzs(fee);
        order.setTotalTzs(subtotal + fee);
        order.setCustomerNameSnapshot(customer.getFullName());
        order.setCustomerPhoneSnapshot(customer.getPhone());
        order.setCustomerEmailSnapshot(customer.getEmail());
        order.setDeliveryAddress(request.deliveryAddress().trim());
        order.setDeliveryLatitude(request.latitude());
        order.setDeliveryLongitude(request.longitude());
        order.setLocationAccuracyM(request.locationAccuracyM());
        order.setLocationCapturedAt(request.locationCapturedAt());
        order.setStatus(OrderStatus.PAID);

        for (int i = 0; i < selected.size(); i++) {
            MenuItem item = selected.get(i);
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(item);
            orderItem.setNameSnapshot(item.getName());
            orderItem.setCategorySnapshot(item.getCategory());
            orderItem.setUnitPriceTzs(item.getPriceTzs());
            orderItem.setQuantity(request.items().get(i).quantity());
            order.getItems().add(orderItem);
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(method);
        payment.setStatus(PaymentStatus.DEMO_SUCCEEDED);
        payment.setAmountTzs(subtotal + fee);
        payment.setProviderReference("DEMO-" + UUID.randomUUID());
        payment.setMaskedAccount(maskAccount(request.paymentPhone(), method));
        order.getPayments().add(payment);
        orders.save(order);

        AppUser admin = users.findByRoleOrderByCreatedAtDesc(UserRole.ADMIN).stream().findFirst().orElse(null);
        if (admin != null) addNotification(admin, "New demo order received", "Order #" + order.getId()
            + " was created using the demo payment adapter. Connect a payment provider before production.");
        addNotification(customer, "Order received (demo payment)", "Your order #" + order.getId()
            + " is recorded. The payment result is simulated and no money was charged.");
        carts.findByCustomerId(customer.getId()).ifPresent(cart -> cartItems.deleteByCartId(cart.getId()));
        return Map.of("order", ApiMapper.order(order), "payment", paymentResponse(payment), "demo", true);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> customerOrders(AppUser customer) {
        return orders.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream().map(ApiMapper::order).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> customerOrder(AppUser customer, String id) {
        return ApiMapper.order(orders.findByIdAndCustomerId(id, customer.getId())
            .orElseThrow(() -> notFound("Order not found.")));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> adminOrder(String id) {
        return ApiMapper.order(orders.findById(id).orElseThrow(() -> notFound("Order not found.")));
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> allOrders() {
        return orders.findAllByOrderByCreatedAtDesc().stream().map(ApiMapper::order).toList();
    }

    @Transactional
    public Map<String, Object> assignOrder(String orderId, Long staffId) {
        RestaurantOrder order = orders.findById(orderId).orElseThrow(() -> notFound("Order not found."));
        if (order.getStatus() != OrderStatus.PAID) throw badRequest("Only paid, unassigned orders can be assigned.");
        AppUser staff = users.findById(staffId).filter(AppUser::isActive)
            .filter(user -> user.getRole() == UserRole.DELIVERY)
            .orElseThrow(() -> notFound("Delivery staff not found."));
        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setOrder(order);
        assignment.setStaff(staff);
        order.setAssignment(assignment);
        order.setStatus(OrderStatus.ASSIGNED);
        staff.setAvailability("Busy / On Delivery");
        addNotification(order.getCustomer(), "Driver assigned to your order", "Order #" + order.getId()
            + " has been assigned to " + staff.getFullName() + " (" + staff.getPhone() + ").");
        addNotification(staff, "New delivery assigned", "Deliver order #" + order.getId() + " to "
            + order.getCustomerNameSnapshot() + " at " + order.getDeliveryAddress() + ".");
        return ApiMapper.order(orders.save(order));
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> staffOrders(AppUser staff) {
        return orders.findDistinctByAssignmentStaffIdOrderByCreatedAtDesc(staff.getId()).stream().map(ApiMapper::order).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> staffOrder(AppUser staff, String id) {
        return ApiMapper.order(orders.findByIdAndAssignmentStaffId(id, staff.getId())
            .orElseThrow(() -> notFound("Assigned order not found.")));
    }

    @Transactional
    public Map<String, Object> updateDeliveryStatus(AppUser staff, String orderId, String requestedStatus) {
        RestaurantOrder order = orders.findByIdAndAssignmentStaffId(orderId, staff.getId())
            .orElseThrow(() -> notFound("Assigned order not found."));
        OrderStatus next;
        try { next = OrderStatus.valueOf(requestedStatus.toUpperCase().replace(' ', '_')); }
        catch (IllegalArgumentException exception) { throw badRequest("Unknown order status."); }
        if (!OrderTransitions.canTransition(order.getStatus(), next)) throw badRequest("That status transition is not allowed.");
        order.setStatus(next);
        addNotification(order.getCustomer(), "Order status updated", "Your order #" + order.getId()
            + " is now " + ApiMapper.displayStatus(next) + ".");
        if (next == OrderStatus.DELIVERED) staff.setAvailability("Available");
        return ApiMapper.order(orders.save(order));
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> customers() {
        return users.findByRoleOrderByCreatedAtDesc(UserRole.CUSTOMER).stream().filter(AppUser::isActive).map(ApiMapper::user).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> deliveryStaff() {
        return users.findByRoleOrderByCreatedAtDesc(UserRole.DELIVERY).stream().filter(AppUser::isActive).map(ApiMapper::user).toList();
    }

    @Transactional
    public Map<String, Object> createDeliveryStaff(ApiDtos.DeliveryRegistration request) {
        AppUser staff = new AppUser();
        staff.setFullName(request.fullName().trim());
        staff.setUsername(request.email().substring(0, request.email().indexOf('@')).trim().toLowerCase());
        staff.setPhone(request.phone().replaceAll("[\\s()-]", ""));
        staff.setEmail(request.email().trim().toLowerCase());
        staff.setPasswordHash(passwords.encode(request.password()));
        staff.setRole(UserRole.DELIVERY);
        staff.setAddress(request.address().trim());
        staff.setVehicle(request.vehicle() == null || request.vehicle().isBlank() ? "Motorcycle" : request.vehicle().trim());
        staff.setAvailability("Available");
        return ApiMapper.user(users.save(staff));
    }

    @Transactional
    public void deleteUser(Long id) {
        AppUser user = users.findById(id).orElseThrow(() -> notFound("User account not found."));
        if (user.getRole() == UserRole.ADMIN) throw new ApiException(HttpStatus.FORBIDDEN, "Admin accounts cannot be deleted here.");
        user.setActive(false);
        user.setSessionToken(null);
        user.setSessionExpiresAt(null);
        users.save(user);
    }

    @Transactional
    public Map<String, Object> toggleStaffStatus(Long id) {
        AppUser staff = users.findById(id).filter(user -> user.getRole() == UserRole.DELIVERY)
            .orElseThrow(() -> notFound("Delivery staff not found."));
        staff.setAvailability("Available".equals(staff.getAvailability()) ? "Busy / On Delivery" : "Available");
        users.save(staff);
        return ApiMapper.user(staff);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> announcements() {
        return announcements.findAllByOrderByCreatedAtDesc().stream().map(this::announcementResponse).toList();
    }

    @Transactional
    public Map<String, Object> addAnnouncement(ApiDtos.AnnouncementRequest request) {
        Announcement item = new Announcement();
        item.setTitle(request.title().trim());
        item.setMessage(request.message().trim());
        item.setBadge(request.badge() == null || request.badge().isBlank() ? "ANNOUNCEMENT" : request.badge().trim().toUpperCase());
        return announcementResponse(announcements.save(item));
    }

    @Transactional
    public Map<String, Object> updateAnnouncement(String id, ApiDtos.AnnouncementRequest request) {
        Announcement item = announcements.findById(id).orElseThrow(() -> notFound("Announcement not found."));
        item.setTitle(request.title().trim());
        item.setMessage(request.message().trim());
        if (request.badge() != null && !request.badge().isBlank()) item.setBadge(request.badge().trim().toUpperCase());
        return announcementResponse(announcements.save(item));
    }

    @Transactional
    public void deleteAnnouncement(String id) {
        Announcement item = announcements.findById(id).orElseThrow(() -> notFound("Announcement not found."));
        announcements.delete(item);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> userNotifications(AppUser user) {
        return notifications.findVisibleTo(user.getId()).stream().map(this::notificationResponse).toList();
    }

    @Transactional
    public void markNotificationRead(AppUser user, String id) {
        Notification item = notifications.findById(id).orElseThrow(() -> notFound("Notification not found."));
        if (item.getRecipient() != null && !item.getRecipient().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot change this notification.");
        }
        item.setReadAt(Instant.now());
        notifications.save(item);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> adminPayments() {
        return payments.findAllByOrderByCreatedAtDesc().stream().map(this::paymentResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> orderPayments(AppUser user, String orderId) {
        RestaurantOrder order = orders.findById(orderId).orElseThrow(() -> notFound("Order not found."));
        if (user.getRole() == UserRole.CUSTOMER && !order.getCustomer().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot view this payment.");
        }
        return payments.findByOrderIdOrderByCreatedAtDesc(orderId).stream().map(this::paymentResponse).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> dashboardStats() {
        List<RestaurantOrder> allOrders = orders.findAll();
        long totalSales = payments.findAll().stream().filter(payment -> payment.getStatus() == PaymentStatus.SUCCEEDED)
            .mapToLong(Payment::getAmountTzs).sum();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalSales", totalSales);
        stats.put("totalOrders", allOrders.size());
        stats.put("pendingAssignment", allOrders.stream().filter(order -> order.getStatus() == OrderStatus.PAID).count());
        stats.put("activeDeliveries", allOrders.stream().filter(order -> order.getStatus() == OrderStatus.ASSIGNED
            || order.getStatus() == OrderStatus.IN_PREPARATION || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY).count());
        stats.put("deliveredCount", allOrders.stream().filter(order -> order.getStatus() == OrderStatus.DELIVERED).count());
        stats.put("totalCustomers", users.findByRoleOrderByCreatedAtDesc(UserRole.CUSTOMER).stream().filter(AppUser::isActive).count());
        stats.put("totalStaff", users.findByRoleOrderByCreatedAtDesc(UserRole.DELIVERY).stream().filter(AppUser::isActive).count());
        stats.put("totalFoods", menu.count());
        return stats;
    }

    private Map<String, Object> announcementResponse(Announcement item) {
        return Map.of("id", item.getId(), "title", item.getTitle(), "message", item.getMessage(),
            "badge", item.getBadge(), "date", item.getCreatedAt().toString().substring(0, 10),
            "createdAt", item.getCreatedAt().toString());
    }

    private Map<String, Object> notificationResponse(Notification item) {
        return Map.of("id", item.getId(), "userId", item.getRecipient() == null ? "all" : item.getRecipient().getId().toString(),
            "title", item.getTitle(), "message", item.getMessage(), "read", item.getReadAt() != null,
            "date", item.getCreatedAt().toString());
    }

    private Map<String, Object> paymentResponse(Payment payment) {
        return Map.of("id", payment.getId(), "orderId", payment.getOrder().getId(), "method", payment.getMethod(),
            "status", payment.getStatus().name(), "amount", payment.getAmountTzs(),
            "providerReference", payment.getProviderReference() == null ? "" : payment.getProviderReference(),
            "maskedAccount", payment.getMaskedAccount() == null ? "" : payment.getMaskedAccount(),
            "createdAt", payment.getCreatedAt().toString());
    }

    private void addNotification(AppUser recipient, String title, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notifications.save(notification);
    }

    private MenuItem availableMenuItem(String id) {
        MenuItem item = menu.findById(id).orElseThrow(() -> notFound("Menu item not found."));
        if (!item.isAvailable()) throw badRequest("This menu item is currently unavailable.");
        return item;
    }

    private String normalizePaymentMethod(String method) {
        return switch (method.trim().toLowerCase()) {
            case "vodacom m-pesa", "vodacom m-pesa (lipa kwa simu)" -> "Vodacom M-Pesa";
            case "tigopesa" -> "TigoPesa";
            case "airtel money" -> "Airtel Money";
            case "halopesa" -> "Halopesa";
            case "visa/mastercard", "visa / mastercard (kadi ya benki)", "visa / mastercard" -> "Visa/Mastercard";
            default -> throw badRequest("Unsupported payment method.");
        };
    }

    private String maskAccount(String phone, String method) {
        if ("Visa/Mastercard".equals(method)) return "Card payment (demo; card data not collected)";
        if (phone == null || phone.isBlank()) return "";
        String digits = phone.replaceAll("\\D", "");
        return digits.length() < 4 ? "••••" : "••••" + digits.substring(digits.length() - 4);
    }

    private static ApiException notFound(String message) { return new ApiException(HttpStatus.NOT_FOUND, message); }
    private static ApiException badRequest(String message) { return new ApiException(HttpStatus.BAD_REQUEST, message); }
}