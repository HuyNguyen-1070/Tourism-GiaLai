package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.request.HistoryTimelineRequest;
import com.gialai.tourism.models.dto.response.HistoryTimelineResponse;
import com.gialai.tourism.models.entities.HistoryTimeline;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.repositories.HistoryTimelineRepository;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.HistoryTimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryTimelineServiceImpl implements HistoryTimelineService {

    private final HistoryTimelineRepository historyTimelineRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HistoryTimelineResponse> getAll() {
        return historyTimelineRepository.findAllByOrderByYearAscDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HistoryTimelineResponse create(HistoryTimelineRequest request) {
        HistoryTimeline timeline = new HistoryTimeline();
        mapRequestToEntity(request, timeline);
        // Xử lý relatedPost
        if (request.getRelatedPostId() != null) {
            Post post = postRepository.findById(request.getRelatedPostId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND,
                            "Post with id " + request.getRelatedPostId()));
            timeline.setRelatedPost(post);
        }
        HistoryTimeline saved = historyTimelineRepository.save(timeline);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public HistoryTimelineResponse update(String id, HistoryTimelineRequest request) {
        HistoryTimeline timeline = historyTimelineRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND,
                        "HistoryTimeline with id " + id));
        mapRequestToEntity(request, timeline);
        // Cập nhật relatedPost
        if (request.getRelatedPostId() != null) {
            Post post = postRepository.findById(request.getRelatedPostId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND,
                            "Post with id " + request.getRelatedPostId()));
            timeline.setRelatedPost(post);
        } else {
            timeline.setRelatedPost(null);
        }
        HistoryTimeline saved = historyTimelineRepository.save(timeline);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(String id) {
        HistoryTimeline timeline = historyTimelineRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND,
                        "HistoryTimeline with id " + id));
        historyTimelineRepository.delete(timeline);
    }

    private HistoryTimelineResponse toResponse(HistoryTimeline timeline) {
        HistoryTimelineResponse.HistoryTimelinePostInfo postInfo = null;
        if (timeline.getRelatedPost() != null
                && timeline.getRelatedPost().getStatus() == PostStatus.APPROVED) {
            Post post = timeline.getRelatedPost();
            String thumbnail = (post.getImages() != null && !post.getImages().isEmpty())
                    ? post.getImages().getFirst()
                    : null;
            postInfo = HistoryTimelineResponse.HistoryTimelinePostInfo.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .thumbnail(thumbnail)
                    .build();
        }

        return HistoryTimelineResponse.builder()
                .id(timeline.getId())
                .year(timeline.getYear())
                .title(timeline.getTitle())
                .description(timeline.getDescription())
                .locationName(timeline.getLocationName())
                .imageUrl(timeline.getImageUrl())
                .relatedPost(postInfo)
                .displayOrder(timeline.getDisplayOrder() != null ? timeline.getDisplayOrder() : 0)
                .createdAt(timeline.getCreatedAt())
                .updatedAt(timeline.getUpdatedAt())
                .build();
    }

    private void mapRequestToEntity(HistoryTimelineRequest request, HistoryTimeline timeline) {
        timeline.setYear(request.getYear());
        timeline.setTitle(request.getTitle());
        timeline.setDescription(request.getDescription());
        timeline.setLocationName(request.getLocationName());
        timeline.setImageUrl(request.getImageUrl());
        timeline.setDisplayOrder(request.getDisplayOrder());
    }
}