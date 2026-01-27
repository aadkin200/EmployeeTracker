package spsoftware.employeetracker.services;

import spsoftware.employeetracker.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> userByEmail(String email);

    List<User> getAllUsers();

    User register(User user);

    Optional<User> getUserById(Long id);

    Optional<User> updateUser(Long id, User user);

    Optional<User> updateMe(String emailFromToken, User incoming);

    boolean deleteUser(Long id);

    boolean deleteMe(String emailFromToken);
}
