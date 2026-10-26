package de.tarifyol.backend.customer;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record CustomerResponse(UUID id, String fullName, String email, String phone,
                               ContactPreference preferredContact, LocalDate dateOfBirth,
                               String iban, String postalCode, String notes, boolean archived,
                               Instant createdAt, Instant updatedAt) {
    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(customer.getId(), customer.getFullName(), customer.getEmail(), customer.getPhone(),
                customer.getPreferredContact(), customer.getDateOfBirth(), customer.getIban(), customer.getPostalCode(),
                customer.getNotes(), customer.isArchived(), customer.getCreatedAt(), customer.getUpdatedAt());
    }
}
