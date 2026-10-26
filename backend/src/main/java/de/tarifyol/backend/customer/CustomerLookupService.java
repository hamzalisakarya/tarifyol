package de.tarifyol.backend.customer;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class CustomerLookupService {
    private final CustomerRepository customers;

    public CustomerLookupService(CustomerRepository customers) { this.customers = customers; }

    public Customer requireActive(UUID id) {
        return customers.findById(id).filter(customer -> !customer.isArchived())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
    }
}
