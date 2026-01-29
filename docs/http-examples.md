# API Request / Response Examples

Below are ready-to-use examples demonstrating how the presentation layer exposes the CQRS handlers.

---
## Health Check
- **Purpose:** Quickly confirm the service is healthy without hitting business logic.
- **Request:**
  ```http
  GET /health HTTP/1.1
  Host: localhost:3000
  ```
- **Successful Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "status": "ok",
      "timestamp": "2026-01-29T12:00:00.000Z"
    }
  }
  ```

---
## Save Document (Command)
- **Purpose:** Registers a new document and persists it via the Cosmos repository.
- **Request:**
  ```http
  POST /document/save HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json

  {
    "id": "b52b3f05-f4f8-47a5-9adb-6b965c51eda1",
    "applicationCode": "CORE",
    "documentCode": "DOC-20260129-0001",
    "documentType": "PDF",
    "documentGroup": "CONTRACTS",
    "extension": "pdf",
    "fileWeight": 524288,
    "createdAt": "2026-01-29T11:59:03.000Z"
  }
  ```
- **Successful Response (201):**
  ```json
  {
    "success": true,
    "data": {
      "id": "b52b3f05-f4f8-47a5-9adb-6b965c51eda1",
      "applicationCode": "CORE",
      "documentCode": "DOC-20260129-0001",
      "documentType": "PDF",
      "documentGroup": "CONTRACTS",
      "status": "PENDING",
      "extension": "pdf",
      "createdAt": "2026-01-29T11:59:03.000Z",
      "fileWeight": 524288
    }
  }
  ```
- **Error Example (409 - already registered):**
  ```json
  {
    "success": false,
    "error": {
      "code": "DOCUMENT.ALREADY_REGISTERED",
      "message": "Document already registered: DOC-20260129-0001"
    }
  }
  ```

---
## Get Document (Query)
- **Purpose:** Retrieves a document projection without mutating domain state.
- **Request:**
  ```http
  GET /document?applicationCode=CORE&documentCode=DOC-20260129-0001 HTTP/1.1
  Host: localhost:3000
  ```
- **Successful Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "id": "b52b3f05-f4f8-47a5-9adb-6b965c51eda1",
      "applicationCode": "CORE",
      "documentCode": "DOC-20260129-0001",
      "documentType": "PDF",
      "documentGroup": "CONTRACTS",
      "status": "PENDING",
      "extension": "pdf",
      "createdAt": "2026-01-29T11:59:03.000Z",
      "fileWeight": 524288
    }
  }
  ```
- **Error Example (404 - not found):**
  ```json
  {
    "success": false,
    "error": {
      "code": "DOCUMENT.REGISTRATION_NOT_FOUND",
      "message": "Document registration not found for code: DOC-20260129-0001"
    }
  }
  ```
