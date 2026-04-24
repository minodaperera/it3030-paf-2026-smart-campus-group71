package smartcampus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import smartcampus.model.Booking;
import smartcampus.repository.BookingRepository;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

     
    public Booking createBooking(@NonNull Booking booking) {
        return bookingRepository.save(booking);
    }

     
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

     
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}