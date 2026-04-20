package com.smartcampus.service;

import com.smartcampus.entity.Resource;

import com.smartcampus.exception.ResourceNotFoundException;

import com.smartcampus.repository.ResourceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ResourceService {

    private final ResourceRepository repository;

    public ResourceService(ResourceRepository repository) {

        this.repository = repository;

    }

    public List<Resource> getAll() {

        return repository.findAll();

    }

    public Resource getById(Long id) {

        return repository.findById(id)

                .orElseThrow(() -> new ResourceNotFoundException(id));

    }

    public Resource save(Resource resource) {

        return repository.save(resource);

    }

    public Resource update(Long id, Resource updated) {

        Resource r = getById(id);

        r.setName(updated.getName());

        r.setType(updated.getType());

        r.setCapacity(updated.getCapacity());

        r.setLocation(updated.getLocation());

        r.setStatus(updated.getStatus());

        r.setAvailabilityWindows(updated.getAvailabilityWindows());

        return repository.save(r);

    }

    public void delete(Long id) {

        Resource r = getById(id);

        repository.delete(r);

    }

    // 🔍 Filtering

    public List<Resource> filter(String type, String location, Integer capacity) {

        if (type != null)

            return repository.findByType(type);

        if (location != null)

            return repository.findByLocationContainingIgnoreCase(location);

        if (capacity != null)

            return repository.findByCapacityGreaterThanEqual(capacity);

        return repository.findAll();

    }

}