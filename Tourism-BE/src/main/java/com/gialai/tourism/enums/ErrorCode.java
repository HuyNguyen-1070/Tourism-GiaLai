package com.gialai.tourism.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // === Authentication & Authorization ===
    UNAUTHENTICATED("Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS("Email or password is incorrect", HttpStatus.UNAUTHORIZED),
    ACCOUNT_LOCKED("Your account is locked", HttpStatus.UNAUTHORIZED),
    UNVERIFIED_ACCOUNT("Account is not verified", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN("Refresh Token is invalid or expired", HttpStatus.UNAUTHORIZED),
    OTP_NOT_VERIFIED("OTP has not been verified", HttpStatus.UNAUTHORIZED),
    INVALID_CURRENT_PASSWORD("Current password is incorrect.", HttpStatus.BAD_REQUEST),

    // === Validation Errors ===
    VALIDATION_ERROR("Invalid input data", HttpStatus.BAD_REQUEST),
    INVALID_OTP("%s OTP is invalid", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH("New password and confirm password do not match.", HttpStatus.BAD_REQUEST),
    PASSWORD_SAME_AS_OLD("New password must be different from the current password.", HttpStatus.BAD_REQUEST),
    INVALID_PRICE("Price must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    INVALID_STATE("Service is already inactive or deleted", HttpStatus.BAD_REQUEST),
    SERVICE_WAS_REMOVED("Service is already deleted", HttpStatus.BAD_REQUEST),

    // === Business Logic Errors ===
    OPERATION_NOT_ALLOWED("Operation is not allowed", HttpStatus.NOT_ACCEPTABLE),
    INSUFFICIENT_STOCK("Insufficient stock for product %s", HttpStatus.CONFLICT),
    ACCOUNT_HAS_ORDERS("Account has orders and cannot be deleted", HttpStatus.CONFLICT),
    CATEGORY_HAS_PRODUCTS("Please delete related products before deleting the category", HttpStatus.CONFLICT),
    BRAND_HAS_PRODUCTS("Please delete related products before deleting the brand", HttpStatus.CONFLICT),
    OTP_LIMIT_EXCEEDED("Exceeded %s OTP limit", HttpStatus.TOO_MANY_REQUESTS),
    REGISTRATION_EXPIRED("Registration session has expired. Please register again.", HttpStatus.GONE),

    // === Resource / Data Not Found or Conflicts ===
    INVALID_IMAGE_FORMAT("The image format you sent is invalid", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    IMAGE_SIZE_EXCEEDED("Image size exceeds the limit", HttpStatus.PAYLOAD_TOO_LARGE),
    RESOURCE_NOT_FOUND("%s not found", HttpStatus.NOT_FOUND),
    RESOURCE_ALREADY_EXISTS("%s already exists", HttpStatus.CONFLICT),

    // === External Services / Upload Errors ===
    UPLOAD_FAILED("Failed to upload file", HttpStatus.NOT_IMPLEMENTED),
    IMAGE_DELETE_FAILED("Failed to delete image", HttpStatus.NOT_IMPLEMENTED),
    MAIL_SEND_FAILED("Failed to send email", HttpStatus.SERVICE_UNAVAILABLE),
    FILE_READ_ERROR("Can not read file", HttpStatus.NOT_IMPLEMENTED),
    OTP_SEND_FAILED("Failed to send OTP", HttpStatus.SERVICE_UNAVAILABLE),
    EXTERNAL_SERVICE_ERROR("External service failed: %s", HttpStatus.BAD_GATEWAY),

    // === Post Management ===
    POST_NOT_FOUND("Post not found with id: %s", HttpStatus.NOT_FOUND),
    NOT_POST_OWNER("You do not have permission to edit this post", HttpStatus.FORBIDDEN),
    POST_ALREADY_PROCESSED("Post '%s' has already been processed", HttpStatus.CONFLICT),
    POST_DELETED("Post has been deleted", HttpStatus.NOT_FOUND),
    INVALID_TAG("Invalid tag provided", HttpStatus.BAD_REQUEST),
    SOURCE_NAME_REQUIRED("sourceName is required when sourceType is EXTERNAL", HttpStatus.BAD_REQUEST),
    CONTENT_TOO_SHORT("Content must be at least 50 plain text characters", HttpStatus.BAD_REQUEST),

    // === System & Uncategorized ===
    NOT_IMPLEMENTED("Feature not implemented", HttpStatus.NOT_IMPLEMENTED),
    DATABASE_ERROR("Database error", HttpStatus.NOT_IMPLEMENTED),
    UNCATEGORIZED_EXCEPTION("Unexpected error occurred", HttpStatus.NOT_IMPLEMENTED),
    GENERATE_TOKEN_EXCEPTION("Failed to generate token", HttpStatus.NOT_IMPLEMENTED);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
