package com.gialai.tourism.services;

import com.gialai.tourism.models.entities.Tag;
import java.util.List;
import java.util.Set;

public interface TagMappingService {
    Set<Tag> mapTagNames(List<String> tagNames);
}