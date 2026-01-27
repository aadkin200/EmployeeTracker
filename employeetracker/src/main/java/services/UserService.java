package services;

import entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> userByEmail(String email);
    List<User> getAllUsers();
    Optional<User> updateUser(User user);
    void deleteUser(Long id);
}
