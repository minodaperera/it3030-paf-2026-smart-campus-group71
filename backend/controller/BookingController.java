package com.smartcampus.booking.controller;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.service.BookingService;
import com.smartcampus.booking.dto.CreateBookingRequest;
import com.smartcampus.booking.dto.UpdateStatusRequest;
import com.smartcampus.booking.dto.BookingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;

    /**
     * POST /api/bookings
     * Create a new booking request.
     * 
     * @param request the booking request
     * @return the created booking with 201 CREATED status
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        log.info("POST /api/bookings - Creating new booking for user: {}", request.getUserId());
        
        Booking booking = bookingService.createBooking(request);
        BookingResponse response = convertToResponse(booking);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/bookings
     * View all bookings with optional filtering by userId.
     * Query parameter: userId (optional) - Filter bookings by user ID
     * 
     * @param userId optional user ID to filter bookings
     * @return list of bookings
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(value = "userId", required = false) String userId) {
        log.info("GET /api/bookings - Fetching bookings" + 
                 (userId != null ? " for user: " + userId : ""));
        
        List<Booking> bookings = bookingService.getAllBookings(userId);
        List<BookingResponse> responses = bookings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /api/bookings/{id}
     * Get a specific booking by ID.
     * 
     * @param id the booking ID
     * @return the booking details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        log.info("GET /api/bookings/{} - Fetching booking details", id);
        
        Booking booking = bookingService.getBookingById(id);
        BookingResponse response = convertToResponse(booking);
        
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/bookings/{id}/status
     * Admin endpoint to approve or reject a booking with optional reason.
     * 
     * @param id the booking ID
     * @param request the status update request (status and optional reason)
     * @return the updated booking
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        log.info("PUT /api/bookings/{}/status - Updating status to: {}", id, request.getStatus());
        
        Booking booking = bookingService.updateBookingStatus(id, request);
        BookingResponse response = convertToResponse(booking);
        
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/bookings/{id}
     * User can cancel their booking.
     * Note: In a real application, the userId should come from the authenticated user context.
     * 
     * @param id the booking ID
     * @param userId the user ID of the user cancelling the booking
     * @return 204 NO CONTENT on successful cancellation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestParam(value = "userId") String userId) {
        log.info("DELETE /api/bookings/{} - Cancelling booking requested by user: {}", id, userId);
        
        bookingService.cancelBooking(id, userId);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/bookings/status/{status}
     * Get all bookings with a specific status (PENDING, APPROVED, REJECTED, CANCELLED).
     * 
     * @param status the booking status
     * @return list of bookings with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable String status) {
        log.info("GET /api/bookings/status/{} - Fetching bookings", status);
        
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        List<Booking> bookings = bookingService.getBookingsByStatus(bookingStatus);
        List<BookingResponse> responses = bookings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /api/bookings/resource/{resourceId}
     * Get all bookings for a specific resource.
     * 
     * @param resourceId the resource ID
     * @return list of bookings for the resource
     */
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByResource(@PathVariable Long resourceId) {
        log.info("GET /api/bookings/resource/{} - Fetching bookings", resourceId);
        
        List<Booking> bookings = bookingService.getBookingsByResource(resourceId);
        List<BookingResponse> responses = bookings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    /**
     * Convert Booking entity to BookingResponse DTO.
     */
    private BookingResponse convertToResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getResourceId(),
            booking.getUserId(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getPurpose(),
            booking.getExpectedAttendees(),
            booking.getStatus().name(),
            booking.getRejectionReason(),
            booking.getCreatedAt(),
            booking.getUpdatedAt()
        );
    }
}