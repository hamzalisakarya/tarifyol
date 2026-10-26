package de.tarifyol.backend.contract;

import de.tarifyol.backend.customer.Customer;
import de.tarifyol.backend.security.SensitiveStringConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "contracts")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 20)
    private ServiceType serviceType;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "provider_name", nullable = false, length = 1024)
    private String providerName;

    @Column(name = "contract_reference", length = 200)
    private String contractReference;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "meter_number", length = 1024)
    private String meterNumber;

    @Convert(converter = SensitiveStringConverter.class)
    @Column(name = "market_location_id", length = 1024)
    private String marketLocationId;

    @Column(name = "annual_consumption_kwh", precision = 12, scale = 2)
    private BigDecimal annualConsumptionKwh;

    @Column(name = "monthly_payment_eur", precision = 10, scale = 2)
    private BigDecimal monthlyPaymentEur;

    @Column(name = "monthly_price_eur", precision = 10, scale = 2)
    private BigDecimal monthlyPriceEur;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "cancellation_deadline")
    private LocalDate cancellationDeadline;

    @Column(name = "next_contact_date")
    private LocalDate nextContactDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContractStatus status = ContractStatus.ACTIVE;

    @Column(length = 2000)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Version
    private long version;

    protected Contract() { }

    public Contract(Customer customer, ServiceType serviceType, String providerName, String contractReference,
                    String meterNumber, String marketLocationId, BigDecimal annualConsumptionKwh,
                    BigDecimal monthlyPaymentEur, BigDecimal monthlyPriceEur, LocalDate contractStartDate,
                    LocalDate contractEndDate, LocalDate cancellationDeadline, ContractStatus status, String notes) {
        this.customer = customer;
        update(serviceType, providerName, contractReference, meterNumber, marketLocationId, annualConsumptionKwh,
                monthlyPaymentEur, monthlyPriceEur, contractStartDate, contractEndDate, cancellationDeadline,
                status, notes);
        this.createdAt = Instant.now();
    }

    public void update(ServiceType serviceType, String providerName, String contractReference, String meterNumber,
                       String marketLocationId, BigDecimal annualConsumptionKwh, BigDecimal monthlyPaymentEur,
                       BigDecimal monthlyPriceEur, LocalDate contractStartDate, LocalDate contractEndDate,
                       LocalDate cancellationDeadline, ContractStatus status, String notes) {
        this.serviceType = serviceType;
        this.providerName = providerName;
        this.contractReference = contractReference;
        this.meterNumber = meterNumber;
        this.marketLocationId = marketLocationId;
        this.annualConsumptionKwh = annualConsumptionKwh;
        this.monthlyPaymentEur = monthlyPaymentEur;
        this.monthlyPriceEur = monthlyPriceEur;
        this.contractStartDate = contractStartDate;
        this.contractEndDate = contractEndDate;
        this.cancellationDeadline = cancellationDeadline;
        this.nextContactDate = calculateNextContactDate(contractStartDate, contractEndDate);
        this.status = status == null ? ContractStatus.ACTIVE : status;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Customer getCustomer() { return customer; }
    public ServiceType getServiceType() { return serviceType; }
    public String getProviderName() { return providerName; }
    public String getContractReference() { return contractReference; }
    public String getMeterNumber() { return meterNumber; }
    public String getMarketLocationId() { return marketLocationId; }
    public BigDecimal getAnnualConsumptionKwh() { return annualConsumptionKwh; }
    public BigDecimal getMonthlyPaymentEur() { return monthlyPaymentEur; }
    public BigDecimal getMonthlyPriceEur() { return monthlyPriceEur; }
    public LocalDate getContractStartDate() { return contractStartDate; }
    public LocalDate getContractEndDate() { return contractEndDate; }
    public LocalDate getCancellationDeadline() { return cancellationDeadline; }
    public LocalDate getNextContactDate() { return nextContactDate; }
    public ContractStatus getStatus() { return status; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    private static LocalDate calculateNextContactDate(LocalDate startDate, LocalDate endDate) {
        if (endDate != null) return endDate.minusMonths(2);
        return startDate == null ? null : startDate.plusMonths(10);
    }
}
