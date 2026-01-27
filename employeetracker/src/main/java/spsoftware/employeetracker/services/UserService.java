package spsoftware.employeetracker.services;

import spsoftware.employeetracker.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> userByEmail(String email);
    List<User> getAllUsers();
    Optional<User> updateUser(Long id, User user);
    boolean deleteUser(Long id);
    User register(User user);
}
