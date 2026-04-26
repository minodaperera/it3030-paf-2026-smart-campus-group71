package com.smartcampus.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import com.smartcampus.backend.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") 
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. Create Booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody @NonNull Booking booking) {
        booking.setUserId(userDetails.getUser().getId());
        Booking createdBooking = bookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }

    // 2. Get All Bookings (Admin can see all, Users can see theirs)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if ("ADMIN".equals(userDetails.getUser().getRole())) {
            return ResponseEntity.ok(bookingService.getAllBookings());
        } else {
            return ResponseEntity.ok(bookingService.getBookingsByUser(userDetails.getUser().getId()));
        }
    }

    // 3. Delete Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            if (!"ADMIN".equals(userDetails.getUser().getRole()) && !booking.getUserId().equals(userDetails.getUser().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this booking.");
            }
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Booking deleted successfully with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 4. Update Full Booking
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id, @Valid @RequestBody Booking bookingDetails) {
        try {
            Booking existingBooking = bookingService.getBookingById(id);
            if (!"ADMIN".equals(userDetails.getUser().getRole()) && !existingBooking.getUserId().equals(userDetails.getUser().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this booking.");
            }
            
            Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 5. Update ONLY Status (For Admin Dashboard)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id, @RequestParam String status) {
        if (!"ADMIN".equals(userDetails.getUser().getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only administrators can update booking statuses.");
        }
        
        try {
            Booking updatedBooking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }
}
