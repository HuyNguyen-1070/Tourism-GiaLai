package com.gialai.tourism.services.implement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gialai.tourism.services.JsonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JsonServiceImpl implements JsonService {
    private final ObjectMapper objectMapper;
    @Override
    public <T> T parseDTO(String rawJson, Class<T> targetType) throws JsonProcessingException {
        return objectMapper.readValue(rawJson, targetType);
    }
}
