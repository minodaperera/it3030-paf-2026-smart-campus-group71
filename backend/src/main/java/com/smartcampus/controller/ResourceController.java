package com.smartcampus.controller;

import com.smartcampus.entity.Resource;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Resource> getAll() {
        return service.getAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public Resource getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // POST
    @PostMapping
    public ResponseEntity<Resource> create(@Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(service.save(resource));
    }

    // PUT
    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @Valid @RequestBody Resource resource) {
        return service.update(id, resource);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔍 FILTER API
    @GetMapping("/filter")
    public List<Resource> filter(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        return service.filter(type, location, capacity);
    }
}