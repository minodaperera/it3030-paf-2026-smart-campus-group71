package smartcampus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import smartcampus.model.Booking;
import smartcampus.service.BookingService;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") 
public class BookingController {

    @Autowired
    private BookingService bookingService;

     
    @PostMapping
    public Booking createBooking(@Valid @RequestBody @NonNull Booking booking) {
        return bookingService.createBooking(booking);
    }

     
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id) {
    bookingService.deleteBooking(id);
    return "Booking deleted successfully with ID: " + id;
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id,@Valid @RequestBody Booking bookingDetails) {
    return bookingService.updateBooking(id, bookingDetails);
    }
}