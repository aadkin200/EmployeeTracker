package spsoftware.employeetracker.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
    @NotBlank @Email
    public String email;

    @NotBlank
    public String password;

    public String firstName;
    public String lastName;
}
