package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.dto.response.SearchPostResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface SearchPostMapper {
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "thumbnailUrl", ignore = true)
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "sourceType", expression = "java(post.getSourceType().name())")
    SearchPostResponse toResponse(Post post);

    @AfterMapping
    default void enrich(Post post, @MappingTarget SearchPostResponse target) {
        target.setTags(post.getTags().stream()
                .map(Tag::getName).collect(Collectors.toList()));
        target.setThumbnailUrl(post.getImages() != null && !post.getImages().isEmpty()
                ? post.getImages().get(0) : null);
    }
}