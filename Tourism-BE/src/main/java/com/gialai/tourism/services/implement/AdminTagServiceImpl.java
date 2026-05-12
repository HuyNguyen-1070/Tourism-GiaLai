package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.request.CreateTagRequest;
import com.gialai.tourism.models.dto.request.UpdateTagRequest;
import com.gialai.tourism.models.dto.response.TagWithCountResponse;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.repositories.TagRepository;
import com.gialai.tourism.services.AdminLogService;
import com.gialai.tourism.services.AdminTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminTagServiceImpl implements AdminTagService {

    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final AdminLogService adminLogService;

    @Override
    @Cacheable(value = "adminTags", key = "#keyword != null ? #keyword : 'all'")
    public List<TagWithCountResponse> getAllTags(String keyword) {
        List<Tag> tags;
        if (keyword != null && !keyword.isBlank()) {
            tags = tagRepository.findByNameContainingIgnoreCase(keyword);
        } else {
            tags = tagRepository.findAllByOrderByNameAsc();
        }
        return tags.stream().map(this::toTagWithCount).collect(Collectors.toList());
    }

    @Transactional
    @Override
    @CacheEvict(value = "adminTags", allEntries = true)
    public TagWithCountResponse createTag(CreateTagRequest request, String adminId) {
        String name = request.getName().toUpperCase();
        if (tagRepository.findByName(name).isPresent()) {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Tag '" + name + "'");
        }
        Tag tag = new Tag();
        tag.setName(name);
        tag = tagRepository.save(tag);
        adminLogService.log(adminId, "CREATE_TAG", tag.getId(), "TAG", "Created tag: " + name);
        return toTagWithCount(tag);
    }

    @Transactional
    @Override
    @CacheEvict(value = "adminTags", allEntries = true)
    public TagWithCountResponse updateTag(String tagId, UpdateTagRequest request, String adminId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Tag"));
        String newName = request.getName().toUpperCase();
        if (!newName.equals(tag.getName()) && tagRepository.findByName(newName).isPresent()) {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Tag '" + newName + "'");
        }
        tag.setName(newName);
        tagRepository.save(tag);
        adminLogService.log(adminId, "UPDATE_TAG", tagId, "TAG", "Updated tag to: " + newName);
        return toTagWithCount(tag);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adminTags", allEntries = true)
    public void deleteTag(String tagId, String adminId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Tag"));
        long usageCount = postRepository.countByTagsContainingAndStatusNot(tagId, PostStatus.DELETED);
        if (usageCount > 0) {
            throw new AppException(ErrorCode.OPERATION_NOT_ALLOWED, "Cannot delete tag '" + tag.getName() +
                    "'. It is currently used by " + usageCount + " post(s).");
        }
        tagRepository.delete(tag);
        adminLogService.log(adminId, "DELETE_TAG", tagId, "TAG", "Deleted tag: " + tag.getName());
    }

    private TagWithCountResponse toTagWithCount(Tag tag) {
        int count = (int) postRepository.countByTagsContainingAndStatus(tag.getId(), PostStatus.APPROVED);
        return TagWithCountResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .postCount(count)
                .createdAt(tag.getCreatedAt())
                .build();
    }
}