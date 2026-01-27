package spsoftware.employeetracker.controllers;

import spsoftware.employeetracker.DTO.AuthResponse;
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
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
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
}
