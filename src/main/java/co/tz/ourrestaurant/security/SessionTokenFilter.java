package co.tz.ourrestaurant.security;

import co.tz.ourrestaurant.model.AppUser;
import co.tz.ourrestaurant.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SessionTokenFilter extends OncePerRequestFilter {
    private final UserRepository users;

    public SessionTokenFilter(UserRepository users) { this.users = users; }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = null;
        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                .filter(cookie -> "restaurant_session".equals(cookie.getName()))
                .map(Cookie::getValue).findFirst().orElse(null);
        }
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            users.findBySessionTokenAndSessionExpiresAtAfter(token, Instant.now())
                .filter(AppUser::isActive)
                .ifPresent(user -> {
                    var auth = new UsernamePasswordAuthenticationToken(
                        user, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
        }
        chain.doFilter(request, response);
    }
}