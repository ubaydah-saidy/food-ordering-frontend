package co.tz.ourrestaurant.api;

import co.tz.ourrestaurant.model.MenuCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}

    public record LoginRequest(@NotBlank String identifier, @NotBlank String password, @NotBlank String role) {}
    public record CustomerRegistration(
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Size(max = 80) String username,
        @NotBlank @Size(max = 32) String phone,
        @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        String address, Double latitude, Double longitude
    ) {}
    public record DeliveryRegistration(
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Size(max = 32) String phone,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank String address,
        @Size(max = 120) String vehicle
    ) {}
    public record ProfileUpdate(
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Size(max = 80) String username,
        @NotBlank @Size(max = 32) String phone,
        @Email @Size(max = 254) String email,
        String avatar,
        String address, Double latitude, Double longitude
    ) {}
    public record PasswordUpdate(@NotBlank String oldPassword, @NotBlank @Size(min = 8, max = 100) String newPassword) {}
    public record MenuItemRequest(
        @NotBlank @Size(max = 160) String name,
        @NotNull MenuCategory category,
        @NotNull @PositiveOrZero @Max(100_000_000) Long price,
        String description, String image,
        Boolean available
    ) {}
    public record CartLine(@NotBlank String menuItemId, @Min(1) @Max(99) int quantity) {}
    public record CartSync(@NotNull List<@Valid CartLine> items) {}
    public record CheckoutLine(@NotBlank String menuItemId, @Min(1) @Max(99) int quantity) {}
    public record CheckoutRequest(
        @NotEmpty @Size(max = 100) List<@Valid CheckoutLine> items,
        @NotBlank String paymentMethod,
        @Size(max = 32) String paymentPhone,
        @NotBlank String deliveryAddress,
        @NotNull @DecimalMin("-90") @DecimalMax("90") Double latitude,
        @NotNull @DecimalMin("-180") @DecimalMax("180") Double longitude,
        @PositiveOrZero Integer locationAccuracyM,
        Instant locationCapturedAt
    ) {}
    public record AssignmentRequest(@NotNull Long staffId) {}
    public record StatusRequest(@NotBlank String status) {}
    public record AnnouncementRequest(@NotBlank @Size(max = 160) String title, @NotBlank String message, @Size(max = 60) String badge) {}
}