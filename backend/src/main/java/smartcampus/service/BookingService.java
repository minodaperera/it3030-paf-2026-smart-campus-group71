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
         
        boolean isConflict = bookingRepository.hasTimeConflict(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (isConflict) {
             
            throw new RuntimeException("Time conflict detected! The resource is already booked for the selected time.");
        }

        return bookingRepository.save(booking);
    }

     
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

     
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    @SuppressWarnings("null")
    public void deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
        } else {
            throw new RuntimeException("Booking not found with id: " + id);
        }
    }
    
    @SuppressWarnings("null")
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));


        booking.setBookingDate(bookingDetails.getBookingDate());
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        booking.setPurpose(bookingDetails.getPurpose());
        booking.setAttendees(bookingDetails.getAttendees());
        booking.setStatus(bookingDetails.getStatus());

        return bookingRepository.save(booking);
    }
}