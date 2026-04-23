package com.smartcampus.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    
    @NotNull(message = "Resource ID is required")
    @Positive(message = "Resource ID must be positive")
    private Long resourceId;
    
    @NotBlank(message = "User ID is required")
    @Size(min = 1, max = 100, message = "User ID must be between 1 and 100 characters")
    private String userId;
    
    @NotNull(message = "Start time is required")
    @FutureOrPresent(message = "Start time must be in the future or present")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;
    
    @NotBlank(message = "Purpose is required")
    @Size(min = 5, max = 500, message = "Purpose must be between 5 and 500 characters")
    private String purpose;
    
    @Min(value = 1, message = "Expected attendees must be at least 1")
    @Max(value = 10000, message = "Expected attendees cannot exceed 10000")
    private int expectedAttendees;
}

