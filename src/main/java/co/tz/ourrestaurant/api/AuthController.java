package co.tz.ourrestaurant.api;

import co.tz.ourrestaurant.model.AppUser;
import co.tz.ourrestaurant.model.UserRole;
import co.tz.ourrestaurant.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder passwords;
    @Value("${app.cookie-secure:false}") private boolean secureCookie;
    @Value("${app.session-hours:12}") private long sessionHours;

    public AuthController(UserRepository users, PasswordEncoder passwords) {
        this.users = users;
        this.passwords = passwords;
    }

    @PostMapping("/auth/register/customer")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registerCustomer(@Valid @RequestBody ApiDtos.CustomerRegistration request,
                                                 HttpServletResponse response) {
        AppUser user = new AppUser();
        user.setFullName(request.fullName().trim());
        user.setUsername(request.username().trim());
        user.setPhone(cleanPhone(request.phone()));
        user.setEmail(cleanEmail(request.email()));
        user.setPasswordHash(passwords.encode(request.password()));
        user.setRole(UserRole.CUSTOMER);
        user.setAddress(request.address());
        user.setLatitude(request.latitude());
        user.setLongitude(request.longitude());
        users.save(user);
        startSession(user, response);
        return Map.of("user", ApiMapper.user(user));
    }

    @PostMapping("/auth/register/delivery")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registerDelivery(@Valid @RequestBody ApiDtos.DeliveryRegistration request,
                                                 HttpServletResponse response) {
        AppUser user = new AppUser();
        user.setFullName(request.fullName().trim());
        user.setUsername(request.email().substring(0, request.email().indexOf('@')).trim().toLowerCase());
        user.setPhone(cleanPhone(request.phone()));
        user.setEmail(cleanEmail(request.email()));
        user.setPasswordHash(passwords.encode(request.password()));
        user.setRole(UserRole.DELIVERY);
        user.setAddress(request.address().trim());
        user.setVehicle(request.vehicle() == null || request.vehicle().isBlank() ? "Motorcycle" : request.vehicle().trim());
        user.setAvailability("Available");
        users.save(user);
        startSession(user, response);
        return Map.of("user", ApiMapper.user(user));
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@Valid @RequestBody ApiDtos.LoginRequest request, HttpServletResponse response) {
        String identifier = request.identifier().trim();
        AppUser user = users.findByUsernameIgnoreCase(identifier)
            .or(() -> users.findByEmailIgnoreCase(identifier))
            .or(() -> findByNormalizedPhone(identifier))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid login credentials."));
        if (!user.isActive() || !passwords.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid login credentials.");
        }
        UserRole requestedRole;
        try { requestedRole = UserRole.valueOf(request.role().toUpperCase()); }
        catch (IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown account role.");
        }
        if (requestedRole != user.getRole()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This account belongs to a different login portal.");
        }
        startSession(user, response);
        return Map.of("user", ApiMapper.user(user));
    }

    @PostMapping("/auth/logout")
    public Map<String, String> logout(@AuthenticationPrincipal AppUser user, HttpServletResponse response) {
        if (user != null) {
            user.setSessionToken(null);
            user.setSessionExpiresAt(null);
            users.save(user);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("", 0).toString());
        return Map.of("message", "Signed out.");
    }

    @GetMapping("/auth/me")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public Map<String, Object> currentUser(@AuthenticationPrincipal AppUser user) {
        return Map.of("user", ApiMapper.user(user));
    }

    @PatchMapping("/me")
    public Map<String, Object> updateProfile(@AuthenticationPrincipal AppUser user,
                                              @Valid @RequestBody ApiDtos.ProfileUpdate request) {
        if (user.getRole() != UserRole.CUSTOMER) throw new ApiException(HttpStatus.FORBIDDEN, "Only customers can edit this profile.");
        user.setFullName(request.fullName().trim());
        user.setUsername(request.username().trim());
        user.setPhone(cleanPhone(request.phone()));
        user.setEmail(cleanEmail(request.email()));
        user.setAvatarUrl(request.avatar());
        if (request.address() != null) user.setAddress(request.address());
        if (request.latitude() != null && request.longitude() != null) {
            user.setLatitude(request.latitude());
            user.setLongitude(request.longitude());
        }
        return Map.of("user", ApiMapper.user(users.save(user)), "message", "Profile updated successfully.");
    }

    @PatchMapping("/me/password")
    public Map<String, String> updatePassword(@AuthenticationPrincipal AppUser user,
                                               @Valid @RequestBody ApiDtos.PasswordUpdate request) {
        if (!passwords.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password does not match our records.");
        }
        user.setPasswordHash(passwords.encode(request.newPassword()));
        users.save(user);
        return Map.of("message", "Password changed. Please sign in again.");
    }

    private java.util.Optional<AppUser> findByNormalizedPhone(String phone) {
        String digits = phone.replaceAll("\\D", "");
        return users.findAll().stream().filter(user -> user.getPhone().replaceAll("\\D", "").equals(digits)).findFirst();
    }

    private void startSession(AppUser user, HttpServletResponse response) {
        user.setSessionToken(UUID.randomUUID().toString());
        user.setSessionExpiresAt(Instant.now().plus(sessionHours, ChronoUnit.HOURS));
        users.save(user);
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie(user.getSessionToken(), sessionHours * 3600).toString());
    }

    private ResponseCookie sessionCookie(String value, long maxAge) {
        return ResponseCookie.from("restaurant_session", value)
            .httpOnly(true).secure(secureCookie).sameSite("Lax").path("/").maxAge(maxAge).build();
    }

    private static String cleanPhone(String value) { return value.replaceAll("[\\s()-]", ""); }
    private static String cleanEmail(String value) { return value == null || value.isBlank() ? null : value.trim().toLowerCase(); }
}