package spsoftware.employeetracker.controllers;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import spsoftware.employeetracker.DTO.AuthResponse;
import spsoftware.employeetracker.DTO.LoginRequest;
import spsoftware.employeetracker.DTO.RegisterRequest;
import spsoftware.employeetracker.entities.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spsoftware.employeetracker.services.JwtService;
import spsoftware.employeetracker.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setEmail(request.email);
        user.setPassword(request.password);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);

        User created = userService.register(user);

        String token = jwtService.generateToken(created.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        // This line triggers:
        // - CustomUserDetailsService.loadUserByUsername(email)
        // - BCrypt password comparison using PasswordEncoder
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.password)
        );

        String token = jwtService.generateToken(request.getEmail().trim().toLowerCase());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
