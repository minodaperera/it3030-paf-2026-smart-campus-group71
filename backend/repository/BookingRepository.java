// package backend.repository;

// public class BookingRepository {
    
// }

package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Conflict Detection - එකම වෙලාවට booking තියෙනවද?
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status != 'CANCELLED' " +
           "AND b.status != 'REJECTED' " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // User ගේ bookings ටික
    List<Booking> findByUserId(String userId);

    // Status අනුව bookings
    List<Booking> findByStatus(com.smartcampus.booking.model.BookingStatus status);
}
