package co.tz.ourrestaurant;

import static org.assertj.core.api.Assertions.assertThat;

import co.tz.ourrestaurant.api.ApiDtos;
import co.tz.ourrestaurant.model.AppUser;
import co.tz.ourrestaurant.model.MenuItem;
import co.tz.ourrestaurant.model.OrderStatus;
import co.tz.ourrestaurant.model.UserRole;
import co.tz.ourrestaurant.repository.MenuItemRepository;
import co.tz.ourrestaurant.repository.OrderRepository;
import co.tz.ourrestaurant.repository.UserRepository;
import co.tz.ourrestaurant.service.RestaurantService;
import java.util.List;
import java.util.Map;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class DatabaseIntegrationTests {
    @Autowired private MenuItemRepository menu;
    @Autowired private OrderRepository orders;
    @Autowired private UserRepository users;
    @Autowired private RestaurantService service;
    @Autowired private ObjectMapper objectMapper;
    @Value("${local.server.port}") private int port;

    @Test
    @Transactional
    void mysqlCompatibleSchemaSeedsMenuAndPersistsCheckout() {
        assertThat(menu.count()).isEqualTo(20);
        MenuItem item = menu.findAll().getFirst();
        AppUser customer = new AppUser();
        customer.setUsername("test_" + System.nanoTime());
        customer.setFullName("Test Customer");
        customer.setPhone("+255" + Math.abs(System.nanoTime() % 1_000_000_000L));
        customer.setPasswordHash("not-used-in-this-service-test");
        customer.setRole(UserRole.CUSTOMER);
        users.save(customer);

        var result = service.checkout(customer, new ApiDtos.CheckoutRequest(
            List.of(new ApiDtos.CheckoutLine(item.getId(), 2)),
            "Vodacom M-Pesa", "+255712345678", "Test delivery address",
            -6.8185, 39.2745, 25, java.time.Instant.now()));

        assertThat(result).containsEntry("demo", true);
        @SuppressWarnings("unchecked")
        Map<String, Object> orderResponse = (Map<String, Object>) result.get("order");
        var persisted = orders.findById((String) orderResponse.get("id")).orElseThrow();
        assertThat(persisted.getStatus()).isEqualTo(OrderStatus.PAID);
        assertThat(persisted.getItems()).hasSize(1);
    }

    @Test
    void provisionedAdminCanSignInAndAccessAdminDashboard() throws Exception {
        HttpResponse<String> login = send("POST", "/api/auth/login",
            Map.of("identifier", "test-admin", "password", "TestAdminPass123", "role", "admin"), null);
        assertThat(login.statusCode()).isEqualTo(200);
        String cookie = login.headers().firstValue("Set-Cookie").orElseThrow().split(";", 2)[0];
        HttpResponse<String> dashboard = send("GET", "/api/admin/dashboard/stats", null, cookie);
        assertThat(dashboard.statusCode()).isEqualTo(200);
    }

    @Test
    void authenticatedCustomerCanSyncCartAndCheckoutButCannotUseAdminRoutes() throws Exception {
        assertThat(send("GET", "/api/health", null, null).statusCode()).isEqualTo(200);
        String suffix = Long.toString(Math.abs(System.nanoTime()));
        Map<String, Object> registration = Map.of(
            "fullName", "HTTP Test Customer",
            "username", "http_customer_" + suffix,
            "phone", "+255" + suffix.substring(Math.max(0, suffix.length() - 9)),
            "email", "http_" + suffix + "@example.test",
            "password", "test-password-123"
        );
        HttpResponse<String> registered = send("POST", "/api/auth/register/customer", registration, null,
            "http://127.0.0.1:5173");
        assertThat(registered.statusCode()).isEqualTo(201);
        String setCookie = registered.headers().firstValue("Set-Cookie").orElseThrow();
        assertThat(setCookie).contains("HttpOnly").contains("SameSite=Lax");
        String cookie = setCookie.substring(0, setCookie.indexOf(';'));

        HttpResponse<String> menuResponse = send("GET", "/api/menu", null, null);
        List<Map<String, Object>> menuItems = objectMapper.readValue(menuResponse.body(), new TypeReference<>() {});
        String menuItemId = (String) menuItems.getFirst().get("id");
        assertThat(send("GET", "/api/orders/mine", null, null).statusCode()).isEqualTo(401);

        HttpResponse<String> cart = send("POST", "/api/cart/items",
            Map.of("menuItemId", menuItemId, "quantity", 1), cookie);
        assertThat(cart.statusCode()).isEqualTo(200);
        assertThat(objectMapper.readTree(cart.body()).get("totalCount").asInt()).isEqualTo(1);

        Map<String, Object> checkout = Map.of(
            "items", List.of(Map.of("menuItemId", menuItemId, "quantity", 1)),
            "paymentMethod", "Vodacom M-Pesa",
            "paymentPhone", "+255712345678",
            "deliveryAddress", "Test delivery address",
            "latitude", -6.8185,
            "longitude", 39.2745,
            "locationAccuracyM", 25,
            "locationCapturedAt", java.time.Instant.now().toString()
        );
        HttpResponse<String> created = send("POST", "/api/orders", checkout, cookie);
        assertThat(created.statusCode()).isEqualTo(201);
        assertThat(objectMapper.readTree(created.body()).get("demo").asBoolean()).isTrue();

        HttpResponse<String> adminData = send("GET", "/api/admin/customers", null, cookie);
        assertThat(adminData.statusCode()).isEqualTo(403);
    }

    private HttpResponse<String> send(String method, String path, Object body, String cookie) throws Exception {
        return send(method, path, body, cookie, null);
    }

    private HttpResponse<String> send(String method, String path, Object body, String cookie, String origin) throws Exception {
        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path));
        if (cookie != null) request.header("Cookie", cookie);
        if (origin != null) request.header("Origin", origin);
        if (body == null) request.method(method, HttpRequest.BodyPublishers.noBody());
        else request.header("Content-Type", "application/json")
            .method(method, HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)));
        return HttpClient.newHttpClient().send(request.build(), HttpResponse.BodyHandlers.ofString());
    }
}