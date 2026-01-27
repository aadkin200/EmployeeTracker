package spsoftware.employeetracker.services;

import spsoftware.employeetracker.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import spsoftware.employeetracker.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> userByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

//    @Override
//    public Optional<User> updateUser(User user) {
//        Optional<User> managedUser;
//        User flushUser;
//        try {
//            managedUser = userRepo.findById(user.getId());
//            if(user.getId() == managedUser.get().getId()) {
//                managedUser.get().setEmail(user.getEmail());
//                managedUser.get().setPassword(user.getPassword());
//                managedUser.get().setFirstName(user.getFirstName());
//                managedUser.get().setLastName(user.getLastName());
//                managedUser.get().setDepartment(user.getDepartment());
//                managedUser.get().setRole(user.getRole());
//                managedUser.get().setTitle(user.getTitle());
//                managedUser.get().setSalary(user.getSalary());
//                managedUser.get().setPhone(user.getPhone());
//            }
//            userRepo.saveAndFlush(managedUser.get());
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return Optional.empty();
//        }
//        return managedUser;
//    }

    @Override
    public User register(User user) {
        // normalize email (optional but helpful)
        String email = user.getEmail().trim().toLowerCase();

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // IMPORTANT: hash the raw password before saving
        String rawPassword = user.getPassword();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));

        return userRepo.save(user);
    }

@Override
public Optional<User> updateUser(Long id, User user) {
    return userRepo.findById(id).map(existing -> {
        existing.setEmail(user.getEmail());
        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setDepartment(user.getDepartment());
        existing.setRole(user.getRole());
        existing.setTitle(user.getTitle());
        existing.setSalary(user.getSalary());
        existing.setPhone(user.getPhone());

        return userRepo.save(existing);
    });
}

    @Override
    public boolean deleteUser(Long id) {
        try {
            userRepo.deleteById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return !userRepo.existsById(id);
    }
}
