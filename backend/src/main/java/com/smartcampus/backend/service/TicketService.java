package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.TicketDTO;
import com.smartcampus.backend.model.ImageAttachment;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketComment;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    private final String UPLOAD_DIR = "uploads/";
    
    public Ticket createTicket(Ticket ticket, List<MultipartFile> images) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        List<ImageAttachment> attachments = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(image.getInputStream(), filePath);
                    ImageAttachment attachment = new ImageAttachment(fileName, filePath.toString());
                    attachments.add(attachment);
                }
            }
        }
        
        ticket.setAttachments(attachments);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setReporterId(ticket.getUserId());
        
        return ticketRepository.save(ticket);
    }
    
    public List<Ticket> getTickets(Long userId, String role) {
        if ("ADMIN".equals(role) || "TECHNICIAN".equals(role)) {
            return ticketRepository.findAll();
        } else {
            return ticketRepository.findByUserId(userId);
        }
    }
    
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }
    
    public Ticket updateStatus(Long id, String status, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus(status);
            if (resolutionNotes != null && !resolutionNotes.isEmpty()) {
                ticket.setResolutionNotes(resolutionNotes);
            }
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    public Ticket assignTechnician(Long id, String technician) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setAssignedTechnician(technician);
            ticket.setStatus("IN_PROGRESS");
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    public Ticket addComment(Long ticketId, Long userId, String userRole, String commentText) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            TicketComment comment = new TicketComment();
            comment.setComment(commentText);
            comment.setUserId(userId);
            comment.setUserRole(userRole);
            ticket.getComments().add(comment);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    public boolean deleteComment(Long ticketId, Long commentId, Long currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            TicketComment toDelete = ticket.getComments().stream()
                .filter(c -> c.getId() != null && c.getId().equals(commentId))
                .findFirst()
                .orElse(null);
            if (toDelete != null && toDelete.canEditOrDelete(currentUserId)) {
                ticket.getComments().remove(toDelete);
                ticketRepository.save(ticket);
                return true;
            }
        }
        return false;
    }
    
    public TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setResourceName(ticket.getResourceName());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setPreferredContact(ticket.getPreferredContact());
        dto.setStatus(ticket.getStatus());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setAssignedTechnician(ticket.getAssignedTechnician());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setUserId(ticket.getUserId());
        
        if (ticket.getAttachments() != null && !ticket.getAttachments().isEmpty()) {
            List<String> imageUrls = ticket.getAttachments().stream()
                .map(img -> "/uploads/" + img.getFileName())
                .collect(Collectors.toList());
            dto.setImageUrls(imageUrls);
        } else {
            dto.setImageUrls(new ArrayList<>());
        }
        
        return dto;
    }
}