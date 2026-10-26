package de.tarifyol.backend.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ContractResponse(UUID id, UUID customerId, String customerName, ServiceType serviceType,
                               String providerName, String contractReference, String meterNumber,
                               String marketLocationId, BigDecimal annualConsumptionKwh,
                               BigDecimal monthlyPaymentEur, BigDecimal monthlyPriceEur,
                               LocalDate contractStartDate, LocalDate contractEndDate,
                               LocalDate cancellationDeadline, LocalDate nextContactDate,
                               ContractStatus status, String notes, Instant createdAt, Instant updatedAt) {
    public static ContractResponse from(Contract contract) {
        return new ContractResponse(contract.getId(), contract.getCustomer().getId(), contract.getCustomer().getFullName(),
                contract.getServiceType(), contract.getProviderName(), contract.getContractReference(),
                contract.getMeterNumber(), contract.getMarketLocationId(), contract.getAnnualConsumptionKwh(),
                contract.getMonthlyPaymentEur(), contract.getMonthlyPriceEur(), contract.getContractStartDate(),
                contract.getContractEndDate(), contract.getCancellationDeadline(), contract.getNextContactDate(),
                contract.getStatus(), contract.getNotes(), contract.getCreatedAt(), contract.getUpdatedAt());
    }
}
