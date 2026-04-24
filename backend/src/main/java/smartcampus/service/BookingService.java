package smartcampus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartcampus.model.Booking;
import smartcampus.repository.BookingRepository;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // අලුත් Booking එකක් Save කිරීම
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    // ඔක්කොම Bookings ලබා ගැනීම
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // යම්කිසි User කෙනෙකුගේ Bookings විතරක් ලබා ගැනීම
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}