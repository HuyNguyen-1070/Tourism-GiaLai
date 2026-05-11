package com.gialai.tourism.services.implement;

import com.gialai.tourism.models.dto.response.TagResponse;
import com.gialai.tourism.repositories.TagRepository;
import com.gialai.tourism.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    @Cacheable("allTags")
    public List<TagResponse> getAllTags() {
        return tagRepository.findAllByOrderByNameAsc()
                .stream()
                .map(tag -> new TagResponse(tag.getId(), tag.getName()))
                .collect(Collectors.toList());
    }
}