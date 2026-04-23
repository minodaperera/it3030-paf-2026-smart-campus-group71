// package backend.controller;

// public class BookingController {
    
// }

package backend.src.main.java.smartcampus.controller;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // ✅ POST /api/bookings - USER Booking create
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // ✅ GET /api/bookings - ADMIN සියලුම bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ GET /api/bookings/user/{userId} - USER තමන්ගේ bookings
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // ✅ PUT /api/bookings/{id}/approve - ADMIN approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    // ✅ PUT /api/bookings/{id}/reject - ADMIN reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, body.get("reason")));
    }

    // ✅ DELETE /api/bookings/{id} - ADMIN cancel
    @DeleteMapping("/{id}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}