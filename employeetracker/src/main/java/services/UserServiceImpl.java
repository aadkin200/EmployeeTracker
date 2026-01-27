package services;

import entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepo;


    @Override
    public Optional<User> userByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public Optional<User> updateUser(User user) {
        Optional<User> managedUser;
        User flushUser;
        try {
            managedUser = userRepo.findByEmail(user.getEmail());
            if(user.getId() == managedUser.get().getId()) {
                managedUser.get().setEmail(user.getEmail());
                managedUser.get().setPassword(user.getPassword());
                managedUser.get().setFirstName(user.getFirstName());
                managedUser.get().setLastName(user.getLastName());
                managedUser.get().setDepartment(user.getDepartment());
                managedUser.get().setRole(user.getRole());
                managedUser.get().setTitle(user.getTitle());
                managedUser.get().setSalary(user.getSalary());
                managedUser.get().setPhone(user.getPhone());
            }
            userRepo.saveAndFlush(managedUser.get());

        } catch (Exception e) {
            e.printStackTrace();
            managedUser = null;
        }
        return managedUser;
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }
}
