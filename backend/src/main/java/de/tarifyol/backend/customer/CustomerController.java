package de.tarifyol.backend.customer;

import de.tarifyol.backend.contract.ContractController;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/customers")
public class CustomerController {
    private final CustomerRepository customers;
    private final CustomerLookupService customerLookup;

    public CustomerController(CustomerRepository customers, CustomerLookupService customerLookup) {
        this.customers = customers;
        this.customerLookup = customerLookup;
    }

    @GetMapping
    public List<CustomerResponse> list() {
        return customers.findAllByArchivedFalseOrderByUpdatedAtDesc().stream().map(CustomerResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CustomerResponse get(@PathVariable UUID id) { return CustomerResponse.from(customerLookup.requireActive(id)); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse create(@Valid @RequestBody CustomerRequest request) {
        Customer customer = new Customer(request.fullName().trim(), clean(request.email()), clean(request.phone()),
                request.preferredContact(), request.dateOfBirth(), clean(request.iban()), clean(request.postalCode()), clean(request.notes()));
        return CustomerResponse.from(customers.save(customer));
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable UUID id, @Valid @RequestBody CustomerRequest request) {
        Customer customer = customerLookup.requireActive(id);
        customer.update(request.fullName().trim(), clean(request.email()), clean(request.phone()), request.preferredContact(),
                request.dateOfBirth(), clean(request.iban()), clean(request.postalCode()), clean(request.notes()));
        return CustomerResponse.from(customers.save(customer));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archive(@PathVariable UUID id) {
        Customer customer = customerLookup.requireActive(id);
        customer.archive();
        customers.save(customer);
    }

    private static String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
