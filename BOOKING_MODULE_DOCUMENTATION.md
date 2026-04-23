# Booking Management Module Documentation

## Overview
The Booking Management module is a comprehensive Spring Boot implementation for managing resource bookings in the Smart Campus Operations Hub. It follows the **Layered Architecture** pattern with clear separation of concerns across Controller, Service, Repository, and Entity layers.

## Architecture

### Layered Architecture Components

1. **Entity Layer** (`model/`)
   - `Booking.java` - JPA entity representing a booking record
   - `BookingStatus.java` - Enum for booking statuses

2. **Repository Layer** (`repository/`)
   - `BookingRepository.java` - JpaRepository with custom queries for conflict detection

3. **Service Layer** (`service/`)
   - `BookingService.java` - Business logic and transaction management

4. **Controller Layer** (`controller/`)
   - `BookingController.java` - REST endpoints

5. **DTO Layer** (`dto/`)
   - `CreateBookingRequest.java` - Request DTO for booking creation
   - `UpdateStatusRequest.java` - Request DTO for status updates
   - `BookingResponse.java` - Response DTO

6. **Exception Layer** (`exception/`)
   - Custom exceptions for domain-specific errors
   - Global exception handler for consistent error responses

## Booking Entity

### Fields
- **id** (Long): Unique identifier, auto-generated
- **resourceId** (Long): Reference to the resource being booked
- **userId** (String): User requesting the booking
- **startTime** (LocalDateTime): Booking start time
- **endTime** (LocalDateTime): Booking end time
- **purpose** (String): Purpose of the booking
- **expectedAttendees** (int): Expected number of attendees
- **status** (BookingStatus): Current status (PENDING, APPROVED, REJECTED, CANCELLED)
- **rejectionReason** (String): Reason for rejection (if applicable)
- **createdAt** (LocalDateTime): Timestamp when booking was created
- **updatedAt** (LocalDateTime): Timestamp when booking was last updated

### Status Workflow
```
PENDING → APPROVED → (Booking confirmed)
       ↓
       REJECTED → (Booking declined with reason)

PENDING/APPROVED → CANCELLED → (User cancels their booking)
```

## Conflict Detection

The module includes a sophisticated conflict detection mechanism:
- **Custom JPA Query**: `findOverlappingBookings()` checks for time range overlaps
- **Time Range Check**: Uses the condition `(:start < b.endTime AND :end > b.startTime)`
- **Status Filter**: Only considers APPROVED bookings to prevent double-booking
- **Validation**: Conflicts are checked at creation and approval stages

### Example Conflict Scenario
```
Resource A is booked from 10:00 AM to 11:00 AM (APPROVED)
Attempting to book:        10:30 AM to 11:30 AM → CONFLICT! ❌
Attempting to book:        11:00 AM to 12:00 PM → SUCCESS ✓
```

## REST API Endpoints

### 1. Create a Booking
**Endpoint**: `POST /api/bookings`

**Request Body**:
```json
{
  "resourceId": 1,
  "userId": "user123",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting for project planning",
  "expectedAttendees": 5
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "resourceId": 1,
  "userId": "user123",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting for project planning",
  "expectedAttendees": 5,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-23T14:30:00",
  "updatedAt": "2026-04-23T14:30:00"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid input or validation errors
- **409 Conflict**: Scheduling conflict detected

---

### 2. Get All Bookings
**Endpoint**: `GET /api/bookings`

**Query Parameters**:
- `userId` (optional): Filter bookings by user ID

**Examples**:
- Get all bookings: `GET /api/bookings`
- Get user's bookings: `GET /api/bookings?userId=user123`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "resourceId": 1,
    "userId": "user123",
    "startTime": "2026-04-25T10:00:00",
    "endTime": "2026-04-25T11:00:00",
    "purpose": "Team meeting",
    "expectedAttendees": 5,
    "status": "PENDING",
    "rejectionReason": null,
    "createdAt": "2026-04-23T14:30:00",
    "updatedAt": "2026-04-23T14:30:00"
  }
]
```

---

### 3. Get Booking by ID
**Endpoint**: `GET /api/bookings/{id}`

**Example**: `GET /api/bookings/1`

**Response** (200 OK):
```json
{
  "id": 1,
  "resourceId": 1,
  "userId": "user123",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-23T14:30:00",
  "updatedAt": "2026-04-23T14:30:00"
}
```

**Error Responses**:
- **404 Not Found**: Booking does not exist

---

### 4. Update Booking Status (Admin)
**Endpoint**: `PUT /api/bookings/{id}/status`

**Request Body**:
```json
{
  "status": "APPROVED",
  "reason": null
}
```

Or for rejection:
```json
{
  "status": "REJECTED",
  "reason": "Room is being renovated during this period"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "resourceId": 1,
  "userId": "user123",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting",
  "expectedAttendees": 5,
  "status": "APPROVED",
  "rejectionReason": null,
  "createdAt": "2026-04-23T14:30:00",
  "updatedAt": "2026-04-23T14:45:00"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid status or booking cannot be updated
- **404 Not Found**: Booking does not exist
- **409 Conflict**: Cannot approve due to scheduling conflict

---

### 5. Cancel Booking (User)
**Endpoint**: `DELETE /api/bookings/{id}`

**Query Parameters**:
- `userId` (required): The user ID of the person cancelling the booking

**Example**: `DELETE /api/bookings/1?userId=user123`

**Response** (204 No Content): No response body

**Error Responses**:
- **400 Bad Request**: User cannot cancel another user's booking
- **404 Not Found**: Booking does not exist

---

### 6. Get Bookings by Status
**Endpoint**: `GET /api/bookings/status/{status}`

**Valid Status Values**: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`

**Example**: `GET /api/bookings/status/PENDING`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "resourceId": 1,
    "userId": "user123",
    "status": "PENDING",
    ...
  }
]
```

---

### 7. Get Bookings by Resource
**Endpoint**: `GET /api/bookings/resource/{resourceId}`

**Example**: `GET /api/bookings/resource/1`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "resourceId": 1,
    "userId": "user123",
    "status": "APPROVED",
    ...
  }
]
```

## Validation Rules

### CreateBookingRequest Validation
- **resourceId**: Required, must be positive
- **userId**: Required, 1-100 characters
- **startTime**: Required, must be in future or present
- **endTime**: Required, must be in future and after startTime
- **purpose**: Required, 5-500 characters
- **expectedAttendees**: Minimum 1, maximum 10,000

### UpdateStatusRequest Validation
- **status**: Required, must be either "APPROVED" or "REJECTED"
- **reason**: Optional, maximum 500 characters

## Exception Handling

### Custom Exceptions

1. **BookingNotFoundException**
   - Thrown when a booking with the specified ID is not found
   - HTTP Status: 404 Not Found

2. **SchedulingConflictException**
   - Thrown when a time slot conflicts with an existing approved booking
   - HTTP Status: 409 Conflict

3. **BookingException**
   - Base exception for booking-related errors
   - HTTP Status: 400 Bad Request

### Error Response Format
```json
{
  "timestamp": "2026-04-23T14:45:00",
  "status": 409,
  "error": "Conflict",
  "message": "Resource is already booked for the requested time period",
  "path": "/api/bookings"
}
```

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  purpose VARCHAR(500) NOT NULL,
  expected_attendees INT,
  status VARCHAR(20) NOT NULL,
  rejection_reason VARCHAR(500),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  
  INDEX idx_resource_status (resource_id, status),
  INDEX idx_user_id (user_id)
);
```

## Key Features

✅ **Conflict Prevention**: Automatic detection of overlapping bookings
✅ **Status Management**: Clear workflow for booking approval/rejection
✅ **User Authorization**: Users can only cancel their own bookings
✅ **Comprehensive Logging**: All operations logged for audit trails
✅ **Transaction Management**: Database operations are transactional
✅ **Input Validation**: Comprehensive request validation
✅ **Error Handling**: Global exception handler with consistent responses
✅ **RESTful Design**: Follows REST best practices
✅ **Lombok Integration**: Reduces boilerplate code
✅ **Clean Code**: Follows Java/Spring conventions

## Dependencies

Required dependencies in `pom.xml`:
```xml
<!-- Spring Boot Starters -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Database Driver (example: MySQL) -->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.33</version>
</dependency>

<!-- Lombok -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>

<!-- Validation -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## Best Practices Implemented

1. **Separation of Concerns**: Clear layer separation
2. **Transaction Management**: Proper use of @Transactional annotations
3. **Logging**: SLF4J logging for debugging and monitoring
4. **Error Handling**: Global exception handler for consistency
5. **Validation**: Input validation at the DTO level
6. **DTOs**: Request/Response objects separate from entities
7. **Immutability**: Use of final fields where appropriate
8. **Constructor Injection**: Via @RequiredArgsConstructor (Lombok)
9. **Documentation**: Comprehensive Javadoc comments
10. **Naming Conventions**: Clear, descriptive names following Java conventions

## Usage Examples

### Creating a Booking via cURL
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": 1,
    "userId": "john.doe",
    "startTime": "2026-04-25T10:00:00",
    "endTime": "2026-04-25T11:00:00",
    "purpose": "Project kickoff meeting",
    "expectedAttendees": 8
  }'
```

### Approving a Booking
```bash
curl -X PUT http://localhost:8080/api/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "reason": null
  }'
```

### Cancelling a Booking
```bash
curl -X DELETE "http://localhost:8080/api/bookings/1?userId=john.doe"
```

## Future Enhancements

1. **Email Notifications**: Send confirmation/rejection emails
2. **Recurring Bookings**: Support for recurring time slots
3. **Calendar Integration**: Sync with calendar applications
4. **Resource Availability**: Link with resource availability service
5. **Payment Processing**: For premium resources
6. **Analytics**: Booking statistics and reporting
7. **Caching**: Redis caching for frequently accessed data
8. **Message Queue**: Async processing using RabbitMQ/Kafka
9. **API Rate Limiting**: Prevent abuse
10. **Audit Logging**: Track all changes with who and when

---

**Version**: 1.0.0
**Last Updated**: April 23, 2026
**Status**: Production Ready
