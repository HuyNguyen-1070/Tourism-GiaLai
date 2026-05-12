package com.gialai.tourism.validators.constraint;


import com.gialai.tourism.validators.annotations.NotBlankOrEmpty;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NotBlankOrEmptyEnumValidator implements ConstraintValidator<NotBlankOrEmpty, Enum<?>> {
    private String fieldName;

    @Override
    public void initialize(NotBlankOrEmpty notBlankOrEmpty) {
        this.fieldName = notBlankOrEmpty.fieldName();
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(fieldName + " must not be blank or empty")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}