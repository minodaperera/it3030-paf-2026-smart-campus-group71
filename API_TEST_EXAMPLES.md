# API Testing Examples - Postman Collection Format
# Import this into Postman or use with cURL

## 1. CREATE BOOKING
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
  "resourceId": 1,
  "userId": "john.doe",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting for project planning",
  "expectedAttendees": 5
}

## Expected Response (201 Created):
{
  "id": 1,
  "resourceId": 1,
  "userId": "john.doe",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting for project planning",
  "expectedAttendees": 5,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-23T14:30:00",
  "updatedAt": "2026-04-23T14:30:00"
}

---

## 2. GET ALL BOOKINGS
GET http://localhost:8080/api/bookings

## 3. GET BOOKINGS FOR SPECIFIC USER
GET http://localhost:8080/api/bookings?userId=john.doe

## 4. GET SPECIFIC BOOKING
GET http://localhost:8080/api/bookings/1

---

## 5. APPROVE BOOKING (Admin)
PUT http://localhost:8080/api/bookings/1/status
Content-Type: application/json

{
  "status": "APPROVED",
  "reason": null
}

## Expected Response (200 OK):
{
  "id": 1,
  "resourceId": 1,
  "userId": "john.doe",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting for project planning",
  "expectedAttendees": 5,
  "status": "APPROVED",
  "rejectionReason": null,
  "createdAt": "2026-04-23T14:30:00",
  "updatedAt": "2026-04-23T14:45:00"
}

---

## 6. REJECT BOOKING (Admin)
PUT http://localhost:8080/api/bookings/2/status
Content-Type: application/json

{
  "status": "REJECTED",
  "reason": "Room is being renovated during this period"
}

---

## 7. CANCEL BOOKING (User)
DELETE http://localhost:8080/api/bookings/1?userId=john.doe

## Expected Response: 204 No Content (empty body)

---

## 8. GET PENDING BOOKINGS
GET http://localhost:8080/api/bookings/status/PENDING

## 9. GET APPROVED BOOKINGS
GET http://localhost:8080/api/bookings/status/APPROVED

## 10. GET BOOKINGS FOR RESOURCE
GET http://localhost:8080/api/bookings/resource/1

---

## ERROR SCENARIOS

### Scheduling Conflict
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
  "resourceId": 1,
  "userId": "jane.smith",
  "startTime": "2026-04-25T10:30:00",
  "endTime": "2026-04-25T11:30:00",
  "purpose": "Another meeting",
  "expectedAttendees": 3
}

## Expected Response (409 Conflict):
{
  "timestamp": "2026-04-23T14:50:00",
  "status": 409,
  "error": "Conflict",
  "message": "Resource is already booked for the requested time period. Please choose a different time slot.",
  "path": "/api/bookings"
}

### Invalid Request (Validation Error)
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
  "resourceId": -1,
  "userId": "",
  "startTime": "2026-04-25T10:00:00",
  "endTime": "2026-04-25T09:00:00",
  "purpose": "Test",
  "expectedAttendees": 0
}

## Expected Response (400 Bad Request):
{
  "timestamp": "2026-04-23T14:52:00",
  "status": 400,
  "error": "Validation Error",
  "message": "resourceId: Resource ID must be positive, userId: User ID is required, endTime: End time must be in the future, expectedAttendees: Expected attendees must be at least 1",
  "path": "/api/bookings"
}

### Booking Not Found
GET http://localhost:8080/api/bookings/999

## Expected Response (404 Not Found):
{
  "timestamp": "2026-04-23T14:54:00",
  "status": 404,
  "error": "Not Found",
  "message": "Booking not found with id: 999",
  "path": "/api/bookings/999"
}

---

## TEST WORKFLOW

1. Create a booking (should get PENDING status)
2. Try to create another booking in the same time slot (should fail with 409)
3. Approve the first booking (should succeed)
4. Create a booking in a different time slot (should succeed)
5. Reject the second booking with a reason
6. Cancel the first booking (should succeed)
7. Try to cancel an already cancelled booking (should fail)
