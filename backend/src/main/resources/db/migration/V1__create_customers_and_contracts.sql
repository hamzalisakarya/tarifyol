CREATE TABLE customers (
    id UUID PRIMARY KEY,
    full_name VARCHAR(1024) NOT NULL,
    email VARCHAR(1024),
    phone VARCHAR(1024),
    preferred_contact VARCHAR(20) NOT NULL,
    date_of_birth VARCHAR(1024),
    iban VARCHAR(1024),
    postal_code VARCHAR(5),
    notes VARCHAR(2000),
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_type VARCHAR(20) NOT NULL,
    provider_name VARCHAR(1024) NOT NULL,
    contract_reference VARCHAR(200),
    meter_number VARCHAR(1024),
    market_location_id VARCHAR(1024),
    annual_consumption_kwh NUMERIC(12, 2),
    monthly_payment_eur NUMERIC(10, 2),
    monthly_price_eur NUMERIC(10, 2),
    contract_start_date DATE,
    contract_end_date DATE,
    cancellation_deadline DATE,
    next_contact_date DATE,
    status VARCHAR(30) NOT NULL,
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_contracts_customer_start ON contracts(customer_id, contract_start_date DESC);
CREATE INDEX idx_contracts_next_contact ON contracts(next_contact_date) WHERE status = 'ACTIVE';
