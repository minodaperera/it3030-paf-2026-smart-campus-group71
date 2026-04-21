package com.smartcampus.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String resourceName;
    private String category;
    private String description;
    private String priority;
    private String preferredContact;
    private String status;
    private String rejectionReason;
    private String assignedTechnician;
    private String resolutionNotes;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private List<ImageAttachment> attachments = new ArrayList<>();
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private List<TicketComment> comments = new ArrayList<>();
    
    public Ticket() {
        this.status = "OPEN";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getResourceName() { return resourceName; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getPriority() { return priority; }
    public String getPreferredContact() { return preferredContact; }
    public String getStatus() { return status; }
    public String getRejectionReason() { return rejectionReason; }
    public String getAssignedTechnician() { return assignedTechnician; }
    public String getResolutionNotes() { return resolutionNotes; }
    public Long getUserId() { return userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<ImageAttachment> getAttachments() { return attachments; }
    public List<TicketComment> getComments() { return comments; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }
    public void setStatus(String status) { this.status = status; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public void setAssignedTechnician(String assignedTechnician) { this.assignedTechnician = assignedTechnician; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setAttachments(List<ImageAttachment> attachments) { this.attachments = attachments; }
    public void setComments(List<TicketComment> comments) { this.comments = comments; }
}