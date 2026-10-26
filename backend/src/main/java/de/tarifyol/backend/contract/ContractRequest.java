package de.tarifyol.backend.contract;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ContractRequest(
        @NotNull ServiceType serviceType,
        @NotNull @Size(max = 120) String providerName,
        @Size(max = 200) String contractReference,
        @Size(max = 80) String meterNumber,
        @Size(max = 80) String marketLocationId,
        @PositiveOrZero BigDecimal annualConsumptionKwh,
        @PositiveOrZero BigDecimal monthlyPaymentEur,
        @PositiveOrZero BigDecimal monthlyPriceEur,
        @NotNull LocalDate contractStartDate,
        LocalDate contractEndDate,
        LocalDate cancellationDeadline,
        ContractStatus status,
        @Size(max = 2000) String notes) { }
