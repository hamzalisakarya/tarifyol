package de.tarifyol.backend.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CustomerRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Email @Size(max = 254) String email,
        @Size(max = 40) String phone,
        ContactPreference preferredContact,
        LocalDate dateOfBirth,
        @Pattern(regexp = "^$|^[A-Za-z]{2}[0-9A-Za-z ]{13,32}$", message = "IBAN format is invalid") String iban,
        @Pattern(regexp = "^$|^[0-9]{5}$", message = "Postal code must contain 5 digits") String postalCode,
        @Size(max = 2000) String notes) { }
