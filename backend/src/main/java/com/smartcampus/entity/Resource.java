package com.smartcampus.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String location;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "availability_windows")
    private String availabilityWindows;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(String availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}