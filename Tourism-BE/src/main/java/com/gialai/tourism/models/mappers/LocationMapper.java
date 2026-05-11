package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.models.entities.Location;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    @Mapping(target = "locationId", source = "id")
    @Mapping(target = "postId", source = "post.id")
    @Mapping(target = "postTitle", source = "post.title")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "averageRating", source = "post.averageRating")
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "thumbnailUrl", ignore = true)
    AllLocationItem toAllLocationItem(Location loc);

    @Mapping(target = "locationId", source = "id")
    @Mapping(target = "post.tags", ignore = true)
    @Mapping(target = "post.thumbnailUrl", ignore = true)
    @Mapping(target = "post.authorUsername", source = "post.author.username")   // bổ sung
    LocationDetailResponse toDetailResponse(Location loc);

    @Mapping(target = "locationId", source = "id")
    @Mapping(target = "postId", source = "post.id")
    LocationResponse toAdminResponse(Location loc);

    @AfterMapping
    default void enrichAllLocationItem(Location loc, @MappingTarget AllLocationItem target) {
        Post post = loc.getPost();
        target.setThumbnailUrl(getFirstImage(post));
        target.setTags(mapTags(post));
    }

    @AfterMapping
    default void enrichDetailResponse(Location loc, @MappingTarget LocationDetailResponse target) {
        Post post = loc.getPost();
        target.getPost().setThumbnailUrl(getFirstImage(post));
        target.getPost().setTags(mapTags(post));
    }

    default String getFirstImage(Post post) {
        return (post.getImages() != null && !post.getImages().isEmpty())
                ? post.getImages().get(0) : null;
    }

    default List<String> mapTags(Post post) {
        return post.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }
}