package spsoftware.employeetracker.services;

import spsoftware.employeetracker.entities.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import spsoftware.employeetracker.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
//    private final UserRepository userRepo;
//    private final PasswordEncoder passwordEncoder;
//
//    public UserServiceImpl(UserRepository userRepo, PasswordEncoder passwordEncoder) {
//        this.userRepo = userRepo;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public Optional<User> userByEmail(String email) {
//        return userRepo.findByEmail(email);
//    }
//
//    @Override
//    public List<User> getAllUsers() {
//        return userRepo.findAll();
//    }
//
//    @Override
//    public User register(User user) {
//        // normalize email (optional but helpful)
//        String email = user.getEmail().trim().toLowerCase();
//
//        if (userRepo.existsByEmail(email)) {
//            throw new IllegalArgumentException("Email is already in use.");
//        }
//
//        // IMPORTANT: hash the raw password before saving
//        String rawPassword = user.getPassword();
//        user.setEmail(email);
//        user.setPassword(passwordEncoder.encode(rawPassword));
//
//        return userRepo.save(user);
//    }
//
//    @Override
//    public Optional<User> getUserById(Long id) {
//        return userRepo.findById(id);
//    }
//
//    @Override
//public Optional<User> updateUser(Long id, User user) {
//    return userRepo.findById(id).map(existing -> {
//        existing.setEmail(user.getEmail());
//        existing.setFirstName(user.getFirstName());
//        existing.setLastName(user.getLastName());
//        existing.setDepartment(user.getDepartment());
//        existing.setRole(user.getRole());
//        existing.setTitle(user.getTitle());
//        existing.setSalary(user.getSalary());
//        existing.setPhone(user.getPhone());
//
//        return userRepo.save(existing);
//    });
//}
//
//    @Override
//    public boolean deleteUser(Long id) {
//        try {
//            userRepo.deleteById(id);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return !userRepo.existsById(id);
//    }

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> userByEmail(String email) {
        return userRepo.findByEmail(normalizeEmail(email));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User register(User user) {
        String email = normalizeEmail(user.getEmail());

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        String rawPassword = user.getPassword();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));

        return userRepo.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    @Override
    public Optional<User> updateUser(Long id, User incoming) {
        return userRepo.findById(id).map(existing -> {
            // If you want to allow email change by ID, normalize + enforce uniqueness
            if (incoming.getEmail() != null && !incoming.getEmail().isBlank()) {
                String newEmail = normalizeEmail(incoming.getEmail());
                if (!newEmail.equals(existing.getEmail()) && userRepo.existsByEmail(newEmail)) {
                    throw new IllegalArgumentException("Email is already in use.");
                }
                existing.setEmail(newEmail);
            }

            existing.setFirstName(incoming.getFirstName());
            existing.setLastName(incoming.getLastName());
            existing.setDepartment(incoming.getDepartment());
            existing.setRole(incoming.getRole());
            existing.setTitle(incoming.getTitle());
            existing.setSalary(incoming.getSalary());
            existing.setPhone(incoming.getPhone());

            // do NOT change password here (make a dedicated change-password endpoint if needed)

            return userRepo.save(existing);
        });
    }

    @Override
    public Optional<User> updateMe(String emailFromToken, User incoming) {
        String email = normalizeEmail(emailFromToken);

        return userRepo.findByEmail(email).map(existing -> {
            // Usually: don't allow changing email/role for "me" (keep it simple + safe)
            existing.setFirstName(incoming.getFirstName());
            existing.setLastName(incoming.getLastName());
            existing.setDepartment(incoming.getDepartment());
            existing.setTitle(incoming.getTitle());
            existing.setSalary(incoming.getSalary());
            existing.setPhone(incoming.getPhone());

            // Optional: if you truly want users to edit their own role, uncomment:
            // existing.setRole(incoming.getRole());

            return userRepo.save(existing);
        });
    }

    @Override
    public boolean deleteUser(Long id) {
        if (!userRepo.existsById(id)) return false;
        userRepo.deleteById(id);
        return !userRepo.existsById(id);
    }

    @Override
    public boolean deleteMe(String emailFromToken) {
        String email = normalizeEmail(emailFromToken);

        return userRepo.findByEmail(email).map(u -> {
            userRepo.deleteById(u.getId());
            return !userRepo.existsById(u.getId());
        }).orElse(false);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
