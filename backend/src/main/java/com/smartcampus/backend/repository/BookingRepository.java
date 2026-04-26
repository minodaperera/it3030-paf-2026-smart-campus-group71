package com.smartcampus.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.smartcampus.backend.model.Booking;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByResourceId(Long resourceId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.resourceId = :resourceId " +
           "AND b.status != 'REJECTED' " + 
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean hasTimeConflict(@Param("resourceId") Long resourceId, 
                            @Param("startTime") LocalDateTime startTime, 
                            @Param("endTime") LocalDateTime endTime);
}
