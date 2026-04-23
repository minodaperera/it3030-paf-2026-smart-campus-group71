package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find overlapping bookings for a resource.
     * Checks if a resource is already booked for an overlapping time range.
     * Only considers APPROVED bookings to prevent conflicts.
     */
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status = 'APPROVED' " +
           "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    List<Booking> findOverlappingBookings(@Param("resourceId") Long resourceId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    /**
     * Find all bookings for a specific user.
     */
    List<Booking> findByUserId(String userId);

    /**
     * Find all bookings for a specific user with a given status.
     */
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);

    /**
     * Find all bookings for a specific resource.
     */
    List<Booking> findByResourceId(Long resourceId);

    /**
     * Find all bookings for a specific resource with a given status.
     */
    List<Booking> findByResourceIdAndStatus(Long resourceId, BookingStatus status);

    /**
     * Find all approved bookings.
     */
    List<Booking> findByStatus(BookingStatus status);

    /**
     * Find a booking by ID and user ID (for authorization checks).
     */
    Optional<Booking> findByIdAndUserId(Long id, String userId);
}