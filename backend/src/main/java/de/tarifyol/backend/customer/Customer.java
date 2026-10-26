package de.tarifyol.backend.customer;

import de.tarifyol.backend.security.SensitiveStringConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "full_name", nullable = false, length = 1024)
    private String fullName;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(length = 1024)
    private String email;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(length = 1024)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_contact", nullable = false, length = 20)
    private ContactPreference preferredContact = ContactPreference.PHONE;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "date_of_birth", length = 1024)
    private String encryptedDateOfBirth;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "iban", length = 1024)
    private String iban;

    @Column(name = "postal_code", length = 5)
    private String postalCode;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private boolean archived;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Version
    private long version;

    protected Customer() { }

    public Customer(String fullName, String email, String phone, ContactPreference preferredContact,
                    LocalDate dateOfBirth, String iban, String postalCode, String notes) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.preferredContact = preferredContact == null ? ContactPreference.PHONE : preferredContact;
        this.encryptedDateOfBirth = dateOfBirth == null ? null : dateOfBirth.toString();
        this.iban = iban;
        this.postalCode = postalCode;
        this.notes = notes;
    }

    public void update(String fullName, String email, String phone, ContactPreference preferredContact,
                       LocalDate dateOfBirth, String iban, String postalCode, String notes) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.preferredContact = preferredContact == null ? ContactPreference.PHONE : preferredContact;
        this.encryptedDateOfBirth = dateOfBirth == null ? null : dateOfBirth.toString();
        this.iban = iban;
        this.postalCode = postalCode;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }

    public void archive() { this.archived = true; this.updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public ContactPreference getPreferredContact() { return preferredContact; }
    public LocalDate getDateOfBirth() { return encryptedDateOfBirth == null ? null : LocalDate.parse(encryptedDateOfBirth); }
    public String getIban() { return iban; }
    public String getPostalCode() { return postalCode; }
    public String getNotes() { return notes; }
    public boolean isArchived() { return archived; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
