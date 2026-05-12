package com.gialai.tourism.validators.annotations;

import com.gialai.tourism.validators.constraint.NotBlankOrEmptyEnumOptionalValidator;
import com.gialai.tourism.validators.constraint.NotBlankOrEmptyOptionalValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;


import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {NotBlankOrEmptyOptionalValidator.class, NotBlankOrEmptyEnumOptionalValidator.class})
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotBlankOrEmptyOptional {
    String message() default "{fieldName} must not be blank or empty";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String fieldName();
}