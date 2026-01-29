package spsoftware.employeetracker.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    public String email;

    @NotBlank
    public String password;

    public String firstName;
    public String lastName;
    public String department;
    public String role;
    public String title;
    public String salary;
    public String phone;
}
