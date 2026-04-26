package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.TicketDTO;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.service.TicketService;
import com.smartcampus.backend.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {
    
    private final TicketService ticketService;
    
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }
    
    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestParam(value = "resourceId", required = false) Long resourceId,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam("preferredContact") String preferredContact,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            Ticket ticket = new Ticket();
            ticket.setResourceId(resourceId);
            ticket.setCategory(category);
            ticket.setDescription(description);
            ticket.setPriority(priority);
            ticket.setPreferredContact(preferredContact);
            ticket.setReporterId(userDetails.getUser().getId());
            
            List<MultipartFile> imageList = (images == null) ? new ArrayList<>() : images;
            
            Ticket savedTicket = ticketService.createTicket(ticket, imageList);
            TicketDTO dto = ticketService.convertToDTO(savedTicket);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<TicketDTO>> getTickets(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Long userId = userDetails.getUser().getId();
        String userRole = userDetails.getUser().getRole();
        
        List<Ticket> tickets = ticketService.getTickets(userId, userRole);
        List<TicketDTO> dtos = tickets.stream()
            .map(ticket -> ticketService.convertToDTO(ticket))
            .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ticketService.convertToDTO(ticket), HttpStatus.OK);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNotes) {
        
        Ticket updated = ticketService.updateStatus(id, status, resolutionNotes);
        if (updated == null) {
            return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ticketService.convertToDTO(updated), HttpStatus.OK);
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {
        
        Ticket updated = ticketService.assignTechnician(id, technicianId);
        if (updated == null) {
            return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ticketService.convertToDTO(updated), HttpStatus.OK);
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestParam String comment,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Long userId = userDetails.getUser().getId();
        Ticket updated = ticketService.addComment(id, userId, comment);
        if (updated == null) {
            return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ticketService.convertToDTO(updated), HttpStatus.OK);
    }
    
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        boolean deleted = ticketService.deleteComment(ticketId, commentId, userDetails.getUser().getId());
        if (!deleted) {
            return new ResponseEntity<>("Cannot delete comment", HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>("Comment deleted", HttpStatus.OK);
    }
}
