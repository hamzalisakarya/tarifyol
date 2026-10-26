package de.tarifyol.backend.contract;

import de.tarifyol.backend.customer.Customer;
import de.tarifyol.backend.customer.ContactPreference;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ContractReminderDateTest {
    private final Customer customer = new Customer(
            "Test Customer", null, null, ContactPreference.PHONE, null, null, null, null);

    @Test
    void schedulesReminderTwoMonthsBeforeContractEnd() {
        Contract contract = contract(LocalDate.of(2026, 1, 15), LocalDate.of(2026, 12, 31));

        assertEquals(LocalDate.of(2026, 10, 31), contract.getNextContactDate());
    }

    @Test
    void defaultsToTenMonthsAfterStartWhenEndDateIsMissing() {
        Contract contract = contract(LocalDate.of(2026, 1, 31), null);

        assertEquals(LocalDate.of(2026, 11, 30), contract.getNextContactDate());
    }

    @Test
    void recalculatesReminderWhenContractDatesChange() {
        Contract contract = contract(LocalDate.of(2026, 1, 1), null);

        contract.update(ServiceType.ELECTRICITY, "Provider", null, null, null, null, null, null,
                LocalDate.of(2026, 2, 1), LocalDate.of(2027, 4, 15), null, ContractStatus.ACTIVE, null);

        assertEquals(LocalDate.of(2027, 2, 15), contract.getNextContactDate());
    }

    private Contract contract(LocalDate startDate, LocalDate endDate) {
        return new Contract(customer, ServiceType.ELECTRICITY, "Provider", null, null, null,
                null, null, null, startDate, endDate, null, ContractStatus.ACTIVE, null);
    }
}
