package com.gialai.tourism.validators.annotations;

import com.gialai.tourism.validators.constraint.NotBlankOrEmptyEnumValidator;
import com.gialai.tourism.validators.constraint.NotBlankOrEmptyValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {NotBlankOrEmptyValidator.class, NotBlankOrEmptyEnumValidator.class})
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotBlankOrEmpty {
    String message() default "{fieldName} must not be blank or empty";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String fieldName();
}
