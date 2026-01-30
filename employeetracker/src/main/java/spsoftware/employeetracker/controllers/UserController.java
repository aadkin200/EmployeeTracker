package spsoftware.employeetracker.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import spsoftware.employeetracker.entities.User;
import spsoftware.employeetracker.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userServ;

    public UserController(UserService userServ) {
        this.userServ = userServ;
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication auth) {
        return userServ.userByEmail(auth.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userServ.getAllUsers());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody User incoming, Authentication auth) {
        return userServ.updateMe(auth.getName(), incoming)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(Authentication auth) {
        boolean deleted = userServ.deleteMe(auth.getName());
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userServ.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User incoming) {
        return userServ.updateUser(id, incoming)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        boolean deleted = userServ.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> search(@RequestParam String q, Authentication auth) {
        // Only ADMIN / MANAGER should be here because /user/** is protected and your UI routes gate it,
        // but you can add stricter role checks later.
        return ResponseEntity.ok(userServ.searchUsers(q, auth.getName()));
    }

}
