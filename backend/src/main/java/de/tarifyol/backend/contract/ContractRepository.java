package de.tarifyol.backend.contract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContractRepository extends JpaRepository<Contract, UUID> {
    @Override
    @EntityGraph(attributePaths = "customer")
    Optional<Contract> findById(UUID id);

    @EntityGraph(attributePaths = "customer")
    List<Contract> findAllByCustomerIdOrderByContractStartDateDesc(UUID customerId);

    @EntityGraph(attributePaths = "customer")
    List<Contract> findAllByNextContactDateLessThanEqualAndStatusOrderByNextContactDateAsc(LocalDate date, ContractStatus status);
}
