package com.gialai.tourism.common.base;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.gialai.tourism.common.constants.Constant;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExceptionResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.DATE_TIME_PATTERN, timezone = Constant.TIMEZONE_VIETNAM)
    private LocalDateTime timestamp;
    private String path;
    private int code;
    private String status;
    private Object message;
}