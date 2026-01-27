package spsoftware.employeetracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import spsoftware.employeetracker.entities.User;
import spsoftware.employeetracker.repositories.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication auth) {
        String email = auth.getName();
        Optional<User> user = userRepo.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userRepo.findAll();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody User incoming, Authentication auth) {
        String emailFromToken = auth.getName();

        return userRepo.findByEmail(emailFromToken)
                .map(existing -> {
                    existing.setFirstName(incoming.getFirstName());
                    existing.setLastName(incoming.getLastName());
                    existing.setDepartment(incoming.getDepartment());
                    existing.setRole(incoming.getRole());
                    existing.setTitle(incoming.getTitle());
                    existing.setSalary(incoming.getSalary());
                    existing.setPhone(incoming.getPhone());

                    User saved = userRepo.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
