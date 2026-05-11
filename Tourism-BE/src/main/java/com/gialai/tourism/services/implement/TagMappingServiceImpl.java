package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.repositories.TagRepository;
import com.gialai.tourism.services.TagMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagMappingServiceImpl implements TagMappingService {

    private final TagRepository tagRepository;

    @Override
    public Set<Tag> mapTagNames(List<String> tagNames) {
        if (tagNames == null) return new HashSet<>();
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name.toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_TAG, name)))
                .collect(Collectors.toSet());
    }
}