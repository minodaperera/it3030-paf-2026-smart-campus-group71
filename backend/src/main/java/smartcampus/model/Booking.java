package smartcampus.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "bookings")
@Data 
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is required")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull(message = "Resource ID is required")
    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date must be today or a future date")
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;  

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees = 1;  

    @Column(nullable = false)
    private String status = "PENDING";  

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}