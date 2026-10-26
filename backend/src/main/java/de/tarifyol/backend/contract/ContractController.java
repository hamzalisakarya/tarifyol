package de.tarifyol.backend.contract;

import de.tarifyol.backend.customer.Customer;
import de.tarifyol.backend.customer.CustomerLookupService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class ContractController {
    private final ContractRepository contracts;
    private final CustomerLookupService customers;

    public ContractController(ContractRepository contracts, CustomerLookupService customers) {
        this.contracts = contracts;
        this.customers = customers;
    }

    @GetMapping("/customers/{customerId}/contracts")
    public List<ContractResponse> listForCustomer(@PathVariable UUID customerId) {
        customers.requireActive(customerId);
        return contracts.findAllByCustomerIdOrderByContractStartDateDesc(customerId).stream().map(ContractResponse::from).toList();
    }

    @PostMapping("/customers/{customerId}/contracts")
    @ResponseStatus(HttpStatus.CREATED)
    public ContractResponse create(@PathVariable UUID customerId, @Valid @RequestBody ContractRequest request) {
        Customer customer = customers.requireActive(customerId);
        return ContractResponse.from(contracts.save(new Contract(customer, request.serviceType(), request.providerName().trim(),
                clean(request.contractReference()), clean(request.meterNumber()), clean(request.marketLocationId()),
                request.annualConsumptionKwh(), request.monthlyPaymentEur(), request.monthlyPriceEur(),
                request.contractStartDate(), request.contractEndDate(), request.cancellationDeadline(),
                request.status(), clean(request.notes()))));
    }

    @PutMapping("/contracts/{id}")
    public ContractResponse update(@PathVariable UUID id, @Valid @RequestBody ContractRequest request) {
        Contract contract = requireContract(id);
        contract.update(request.serviceType(), request.providerName().trim(), clean(request.contractReference()),
                clean(request.meterNumber()), clean(request.marketLocationId()), request.annualConsumptionKwh(),
                request.monthlyPaymentEur(), request.monthlyPriceEur(), request.contractStartDate(),
                request.contractEndDate(), request.cancellationDeadline(), request.status(), clean(request.notes()));
        return ContractResponse.from(contracts.save(contract));
    }

    @GetMapping("/reminders")
    public List<ContractResponse> reminders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate start = from == null ? LocalDate.now() : from;
        LocalDate end = to == null ? start.plusDays(30) : to;
        if (end.isBefore(start)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "to must be on or after from");
        return contracts.findAllByNextContactDateLessThanEqualAndStatusOrderByNextContactDateAsc(end, ContractStatus.ACTIVE)
                .stream().filter(c -> c.getNextContactDate() != null && !c.getNextContactDate().isBefore(start))
                .map(ContractResponse::from).toList();
    }

    private Contract requireContract(UUID id) {
        return contracts.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));
    }

    private static String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
