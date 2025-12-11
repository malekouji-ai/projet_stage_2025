package com.esprit.tn.hkeyitna.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserDto {
    @NotBlank
    public String username;

    @Email @NotBlank
    public String email;

    @Pattern(regexp = "admin|user")
    public String role;

    // Optionnel pour update; requis pour create
    public String password;
}

