package spsoftware.employeetracker.entities;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import spsoftware.employeetracker.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    void canConnectToMySql_andQueryUsersTable() {
        // This forces a real DB call
        long count = userRepository.count();

        assertTrue(count >= 0, "Repo should be able to query the database");
    }

    @Test
    void userNameTest() {
        assertTrue(userRepository.findByEmail("johngoodman@gmail.com").isPresent(), "username found!");
    }
}
