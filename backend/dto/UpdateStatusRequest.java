package com.smartcampus.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(APPROVED|REJECTED)$", flags = Pattern.Flag.CASE_INSENSITIVE,
             message = "Status must be either APPROVED or REJECTED")
    private String status;
    
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
}

