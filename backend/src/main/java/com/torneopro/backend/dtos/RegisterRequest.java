package com.torneopro.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 80) String nombre,
        @NotBlank @Size(max = 80) String apellido,
        @NotBlank @Pattern(regexp = "[0-9+() -]{7,25}", message = "El celular no tiene un formato válido") String celular,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 72) String password
) {}
