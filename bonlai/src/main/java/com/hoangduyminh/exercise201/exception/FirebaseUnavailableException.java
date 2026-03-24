package com.hoangduyminh.exercise201.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when Firebase service is required but not configured or available
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class FirebaseUnavailableException extends RuntimeException {
    public FirebaseUnavailableException(String message) {
        super(message);
    }
}
