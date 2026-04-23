// package backend.service;

// public class BookingService {
    
// }

package com.smartcampus.booking.service;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // ✅ USER - Booking Create කරන්න
    public Booking createBooking(Booking booking) {
        // Conflict check
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            booking.getResourceId(),
            booking.getStartTime(),
            booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("එම වෙලාවට දැනටමත් booking එකක් තියෙනවා!");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    // ✅ ADMIN - සියලුම Bookings බලන්න
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ✅ ADMIN - Approve කරන්න
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found!"));
        booking.setStatus(BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }

    // ✅ ADMIN - Reject කරන්න
    public Booking rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found!"));
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    // ✅ ADMIN - Cancel කරන්න
    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found!"));
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    // ✅ USER - තමන්ගේ Bookings බලන්න
    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }
}
