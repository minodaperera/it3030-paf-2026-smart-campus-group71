package com.smartcampus.booking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE) // Required by @Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)  // Fix: only use 'id' for equality
@ToString(exclude = {"rejectionReason"})           // Fix: avoid lazy-load issues
@Table(name = "bookings", indexes = {
    @Index(name = "idx_resource_status", columnList = "resource_id, status"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include  // Fix: base equality only on 'id'
    private Long id;

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "purpose", nullable = false, length = 500)
    private String purpose;

    @Column(name = "expected_attendees", nullable = false)
    private Integer expectedAttendees;  // Fix: Integer (wrapper) instead of int (primitive)

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}