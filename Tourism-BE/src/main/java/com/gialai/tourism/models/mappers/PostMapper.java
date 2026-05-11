package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.dto.request.CreatePostRequest;
import com.gialai.tourism.models.dto.request.UpdatePostRequest;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.services.TagMappingService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class PostMapper {

    @Autowired
    protected TagMappingService tagMappingService;

    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "approvedByUsername", source = "approvedBy.username")
    @Mapping(target = "rejectedByUsername", source = "rejectedBy.username")
    public abstract PostResponse toResponse(Post post);

    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "favoritedAt", ignore = true)
    public abstract PostSummaryResponse toSummary(Post post);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title", source = "title")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "summary", source = "summary")
    @Mapping(target = "sourceType", source = "sourceType")
    @Mapping(target = "sourceName", source = "sourceName")
    @Mapping(target = "images", source = "images")
    public abstract Post toEntity(CreatePostRequest request);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title", source = "title")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "summary", source = "summary")
    @Mapping(target = "sourceType", source = "sourceType")
    @Mapping(target = "sourceName", source = "sourceName")
    @Mapping(target = "images", source = "images")
    public abstract void updateEntity(@MappingTarget Post post, UpdatePostRequest request);

    @AfterMapping
    protected void mapTagsToString(Post post, @MappingTarget PostResponse target) {
        target.setTags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
    }

    @AfterMapping
    protected void mapSummaryTags(Post post, @MappingTarget PostSummaryResponse target) {
        target.setTags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
    }

    @AfterMapping
    protected void mapRequestTags(CreatePostRequest request, @MappingTarget Post post) {
        post.setTags(tagMappingService.mapTagNames(request.getTags()));
    }

    @AfterMapping
    protected void mapUpdateTags(UpdatePostRequest request, @MappingTarget Post post) {
        post.setTags(tagMappingService.mapTagNames(request.getTags()));
    }
}