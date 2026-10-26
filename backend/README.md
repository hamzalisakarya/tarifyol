# TarifYol Backend

Private REST API for manually managed customer and contract records. The public website remains unchanged; `frontend/admin/` contains the separate administration page, which calls this API once it is deployed.

## Stack

- Java 21 and Spring Boot 4.1.1
- Spring MVC, Spring Data JPA, Bean Validation, Spring Security, Actuator
- PostgreSQL 18 with Flyway migrations
- Docker Compose for local PostgreSQL
- OpenAPI/Swagger UI for API inspection

## Local setup (PowerShell)

Create unique local values and keep them out of Git. Generate a 32-byte field key with:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Set the values in the current PowerShell session:

```powershell
$env:TARIFYOL_DB_PASSWORD = 'use-a-long-random-password'
$env:TARIFYOL_ADMIN_USERNAME = 'admin'
$env:TARIFYOL_ADMIN_PASSWORD = 'use-another-long-random-password'
$env:TARIFYOL_CORS_ALLOWED_ORIGINS = 'https://tarifyol.de'
$env:TARIFYOL_FIELD_ENCRYPTION_KEY = 'paste-generated-base64-key-here'
```

Start PostgreSQL:

```powershell
docker compose up -d database
```

Build the application and run it from `backend/`:

```powershell
mvn spring-boot:run
```

The API listens on `http://localhost:8081`. Swagger UI is at `/swagger-ui.html`; API requests require HTTP Basic authentication. The health endpoint is `/actuator/health`.

The admin page is published at `/admin/` with the existing GitHub Pages artifact. It currently points to `https://api.tarifyol.de` (configured in `frontend/admin/index.html`). The API domain, HTTPS hosting, DNS, and production secrets must be configured before the admin login can connect. The admin page keeps the Basic authentication header in memory only and clears it on logout; use HTTPS for any non-local API.

## Initial API

- `GET/POST /api/admin/customers`
- `GET/PUT/DELETE /api/admin/customers/{id}` (`DELETE` archives the customer)
- `GET/POST /api/admin/customers/{customerId}/contracts`
- `PUT /api/admin/contracts/{id}`
- `GET /api/admin/reminders?from=YYYY-MM-DD&to=YYYY-MM-DD`

Every contract requires a start date. The API calculates `nextContactDate` automatically: two months before `contractEndDate`, or ten months after `contractStartDate` when no end date is supplied (the 12-month default). Updating either date recalculates the reminder. Reminder delivery is not automated yet.

Names, email, phone, date of birth, IBAN, provider name, meter number, and market location ID are encrypted with AES-256-GCM before database storage. The encryption key is required at startup, is never stored in the database, and must be backed up securely; losing or changing it makes encrypted values unreadable. The local HTTP Basic setup is for local development only; production must use HTTPS, managed secrets, restricted network access, backups, and an access policy before real customer data is entered.

Date of birth and IBAN are retained only to support customer and supplier contract workflows, so the customer does not need to provide the same information again. Collect them only when needed for that purpose, explain the use to the customer, restrict access, and delete them when no longer needed.
