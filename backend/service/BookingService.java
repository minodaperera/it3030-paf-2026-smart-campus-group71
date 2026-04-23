package com.smartcampus.booking.service;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.booking.exception.BookingNotFoundException;
import com.smartcampus.booking.exception.SchedulingConflictException;
import com.smartcampus.booking.dto.CreateBookingRequest;
import com.smartcampus.booking.dto.UpdateStatusRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;

    /**
     * Create a new booking after validating for scheduling conflicts.
     * Default status is set to PENDING.
     *
     * @param request the booking request
     * @return the created booking
     * @throws SchedulingConflictException if there's a scheduling conflict
     */
    @Transactional
    public Booking createBooking(CreateBookingRequest request) {
        log.info("Creating booking for resource: {} by user: {}", 
                 request.getResourceId(), request.getUserId());

        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }

        // Check for scheduling conflicts
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
            request.getResourceId(),
            request.getStartTime(),
            request.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            log.warn("Scheduling conflict detected for resource: {} in time range: {} - {}",
                     request.getResourceId(), request.getStartTime(), request.getEndTime());
            throw new SchedulingConflictException(
                "Resource is already booked for the requested time period. " +
                "Please choose a different time slot."
            );
        }

        // Create new booking with PENDING status
        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(request.getUserId());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with id: {}", savedBooking.getId());
        
        return savedBooking;
    }

    /**
     * Get all bookings with optional filtering by user ID.
     *
     * @param userId optional user ID to filter by
     * @return list of bookings
     */
    @Transactional(readOnly = true)
    public List<Booking> getAllBookings(String userId) {
        if (userId != null && !userId.isEmpty()) {
            log.info("Fetching bookings for user: {}", userId);
            return bookingRepository.findByUserId(userId);
        }
        log.info("Fetching all bookings");
        return bookingRepository.findAll();
    }

    /**
     * Get a booking by ID.
     *
     * @param id the booking ID
     * @return the booking
     * @throws BookingNotFoundException if booking not found
     */
    @Transactional(readOnly = true)
    public Booking getBookingById(Long id) {
        log.info("Fetching booking with id: {}", id);
        return bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException(id));
    }

    /**
     * Update booking status (approve/reject).
     * Only admin can approve or reject bookings.
     *
     * @param id the booking ID
     * @param request the status update request
     * @return the updated booking
     * @throws BookingNotFoundException if booking not found
     * @throws IllegalArgumentException if invalid status or booking cannot be updated
     */
    @Transactional
    public Booking updateBookingStatus(Long id, UpdateStatusRequest request) {
        log.info("Updating booking status for id: {} to status: {}", id, request.getStatus());

        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException(id));

        // Only PENDING bookings can be approved or rejected
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException(
                "Only PENDING bookings can be updated. Current status: " + booking.getStatus()
            );
        }

        // Validate and set the new status
        try {
            BookingStatus newStatus = BookingStatus.valueOf(request.getStatus().toUpperCase());
            
            if (newStatus == BookingStatus.APPROVED) {
                // Re-check for conflicts before approving
                List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    booking.getResourceId(),
                    booking.getStartTime(),
                    booking.getEndTime()
                );
                
                if (!conflicts.isEmpty()) {
                    log.warn("Cannot approve booking: {} - scheduling conflict detected", id);
                    throw new SchedulingConflictException(
                        "Cannot approve: Resource has conflicting bookings"
                    );
                }
                
                booking.setStatus(BookingStatus.APPROVED);
                log.info("Booking {} approved", id);
            } else if (newStatus == BookingStatus.REJECTED) {
                booking.setStatus(BookingStatus.REJECTED);
                booking.setRejectionReason(request.getReason());
                log.info("Booking {} rejected with reason: {}", id, request.getReason());
            } else {
                throw new IllegalArgumentException(
                    "Invalid status for admin update: " + request.getStatus()
                );
            }

            return bookingRepository.save(booking);
        } catch (IllegalArgumentException e) {
            log.error("Error updating booking status: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Cancel a booking (only by the user who created it or admin).
     *
     * @param id the booking ID
     * @param userId the user ID requesting cancellation
     * @throws BookingNotFoundException if booking not found
     * @throws IllegalArgumentException if booking cannot be cancelled
     */
    @Transactional
    public void cancelBooking(Long id, String userId) {
        log.info("Cancelling booking id: {} requested by user: {}", id, userId);

        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException(id));

        // Verify user owns the booking
        if (!booking.getUserId().equals(userId)) {
            log.warn("Unauthorized cancellation attempt for booking: {} by user: {}", id, userId);
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        // Cannot cancel already cancelled bookings
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking {} cancelled successfully", id);
    }

    /**
     * Get bookings by status.
     *
     * @param status the booking status
     * @return list of bookings with the specified status
     */
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        log.info("Fetching bookings with status: {}", status);
        return bookingRepository.findByStatus(status);
    }

    /**
     * Get bookings for a specific resource.
     *
     * @param resourceId the resource ID
     * @return list of bookings for the resource
     */
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByResource(Long resourceId) {
        log.info("Fetching bookings for resource: {}", resourceId);
        return bookingRepository.findByResourceId(resourceId);
    }
}