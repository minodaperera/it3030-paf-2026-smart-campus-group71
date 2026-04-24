package smartcampus.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

     
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }
}