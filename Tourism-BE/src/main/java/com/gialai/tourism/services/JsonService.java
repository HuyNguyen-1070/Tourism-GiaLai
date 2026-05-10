package com.gialai.tourism.services;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface JsonService {
    <T> T parseDTO(String rawJson, Class<T> targetType) throws JsonProcessingException;
}
