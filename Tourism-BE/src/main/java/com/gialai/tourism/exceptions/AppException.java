package com.gialai.tourism.exceptions;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final String errorCode;
    private final int status;

    public AppException(String message, String errorCode, int status){
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public AppException(String message){
        this(message, "INTERNAL_ERROR", 500);
    }
}
