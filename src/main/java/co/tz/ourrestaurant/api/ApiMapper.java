package co.tz.ourrestaurant.api;

import co.tz.ourrestaurant.model.*;
import java.util.LinkedHashMap;
import java.util.Map;

public final class ApiMapper {
    private ApiMapper() {}

    public static Map<String, Object> user(AppUser user) {
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("id", user.getId().toString());
        value.put("username", user.getUsername());
        value.put("fullName", user.getFullName());
        value.put("role", user.getRole().name().toLowerCase());
        value.put("phone", user.getPhone());
        value.put("email", user.getEmail() == null ? "" : user.getEmail());
        value.put("avatar", user.getAvatarUrl() == null ? "" : user.getAvatarUrl());
        value.put("address", user.getAddress() == null ? "" : user.getAddress());
        value.put("coords", user.getLatitude() == null ? null : Map.of("lat", user.getLatitude(), "lng", user.getLongitude()));
        if (user.getRole() == UserRole.DELIVERY) {
            value.put("vehicle", user.getVehicle());
            value.put("status", user.getAvailability());
        }
        return value;
    }

    public static Map<String, Object> menuItem(MenuItem item) {
        return Map.of("id", item.getId(), "name", item.getName(), "category", item.getCategory().name(),
            "price", item.getPriceTzs(), "description", item.getDescription(), "image", item.getImage(),
            "available", item.isAvailable());
    }

    public static Map<String, Object> orderItem(OrderItem item) {
        return Map.of("id", item.getMenuItem() == null ? "removed" : item.getMenuItem().getId(),
            "name", item.getNameSnapshot(), "category", item.getCategorySnapshot().name(),
            "price", item.getUnitPriceTzs(), "quantity", item.getQuantity());
    }

    public static Map<String, Object> order(RestaurantOrder order) {
        Map<String, Object> customer = new LinkedHashMap<>();
        customer.put("id", order.getCustomer().getId().toString());
        customer.put("username", order.getCustomer().getUsername());
        customer.put("fullName", order.getCustomerNameSnapshot());
        customer.put("phone", order.getCustomerPhoneSnapshot());
        customer.put("email", order.getCustomerEmailSnapshot() == null ? "" : order.getCustomerEmailSnapshot());
        customer.put("address", order.getDeliveryAddress());
        customer.put("coords", Map.of("lat", order.getDeliveryLatitude(), "lng", order.getDeliveryLongitude()));
        customer.put("activeLocation", Map.of("address", order.getDeliveryAddress(), "coords",
            Map.of("lat", order.getDeliveryLatitude(), "lng", order.getDeliveryLongitude()), "isLiveActive", false));

        Payment payment = order.getPayments().isEmpty() ? null : order.getPayments().get(order.getPayments().size() - 1);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", order.getId());
        result.put("customer", customer);
        result.put("items", order.getItems().stream().map(ApiMapper::orderItem).toList());
        result.put("billAmount", order.getSubtotalTzs());
        result.put("transactionFee", order.getTransactionFeeTzs());
        result.put("totalAmount", order.getTotalTzs());
        result.put("paymentMethod", payment == null ? "" : payment.getMethod());
        result.put("paymentPhoneOrCard", payment == null || payment.getMaskedAccount() == null ? "" : payment.getMaskedAccount());
        result.put("paymentStatus", payment == null ? "Pending" : payment.getStatus().name());
        result.put("orderStatus", displayStatus(order.getStatus()));
        result.put("assignedStaff", order.getAssignment() == null ? null : Map.of(
            "id", order.getAssignment().getStaff().getId().toString(),
            "fullName", order.getAssignment().getStaff().getFullName(),
            "phone", order.getAssignment().getStaff().getPhone(),
            "vehicle", order.getAssignment().getStaff().getVehicle() == null ? "Delivery Motorcycle" : order.getAssignment().getStaff().getVehicle()));
        result.put("date", order.getCreatedAt().toString().substring(0, 10));
        result.put("time", order.getCreatedAt().toString().substring(11, 16));
        result.put("createdAt", order.getCreatedAt().toString());
        return result;
    }

    public static String displayStatus(OrderStatus status) {
        return switch (status) {
            case PAYMENT_PENDING -> "Payment Pending";
            case IN_PREPARATION -> "In Preparation";
            case OUT_FOR_DELIVERY -> "Out for Delivery";
            default -> status.name().charAt(0) + status.name().substring(1).toLowerCase();
        };
    }
}