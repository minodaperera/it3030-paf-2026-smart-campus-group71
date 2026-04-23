package com.smartcampus.booking.exception;

public class BookingNotFoundException extends BookingException {
    public BookingNotFoundException(Long id) {
        super("Booking not found with id: " + id);
    }
}
