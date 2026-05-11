package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.models.entities.Location;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.models.mappers.LocationMapper;
import com.gialai.tourism.repositories.LocationRepository;
import com.gialai.tourism.services.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    public NearbyLocationResponse getNearbyLocations(double lat, double lng, int radius, int limit, List<String> tags) {
        radius = Math.min(radius, 200);
        limit = Math.min(limit, 50);

        List<Object[]> raw = locationRepository.findNearbyLocationsRaw(lat, lng, radius, limit);
        List<NearbyLocationItem> items = raw.stream()
                .map(this::mapNearbyRow)
                .collect(Collectors.toList());

        // Apply tag filter if provided (post‑filtering after DB query)
        if (tags != null && !tags.isEmpty()) {
            items = items.stream()
                    .filter(item -> item.getTags().stream()
                            .anyMatch(tag -> tags.stream().anyMatch(t -> t.equalsIgnoreCase(tag))))
                    .collect(Collectors.toList());
        }

        return NearbyLocationResponse.builder()
                .userLocation(new LatLng(lat, lng))
                .radius(radius)
                .totalFound(items.size())
                .locations(items)
                .build();
    }

    private NearbyLocationItem mapNearbyRow(Object[] row) {
        Location loc = (Location) row[0];
        Double distance = ((Number) row[1]).doubleValue();
        Post post = loc.getPost();

        return NearbyLocationItem.builder()
                .locationId(loc.getId())
                .postId(post.getId())
                .postTitle(post.getTitle())
                .postThumbnailUrl(post.getImages() != null && !post.getImages().isEmpty()
                        ? post.getImages().get(0) : null)
                .name(loc.getName())
                .address(loc.getAddress())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .placeId(loc.getPlaceId())
                .distance(Math.round(distance * 100.0) / 100.0)
                .tags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()))
                .averageRating(post.getAverageRating())
                .likeCount(post.getLikeCount())
                .build();
    }

    @Override
    @Cacheable(value = "allMapLocations", key = "#tags?.toString() + '_' + #keyword")
    public AllLocationResponse getAllLocations(List<String> tags, String keyword) {
        List<Location> locations = locationRepository.findAllApprovedLocations();
        Stream<Location> stream = locations.stream();

        // Filter by keyword on name and post title
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.toLowerCase();
            stream = stream.filter(loc ->
                    loc.getName().toLowerCase().contains(kw) ||
                            loc.getPost().getTitle().toLowerCase().contains(kw)
            );
        }

        // Filter by tags
        if (tags != null && !tags.isEmpty()) {
            stream = stream.filter(loc -> loc.getPost().getTags().stream()
                    .map(Tag::getName)
                    .anyMatch(name -> tags.stream().anyMatch(name::equalsIgnoreCase)));
        }

        List<AllLocationItem> items = stream
                .map(locationMapper::toAllLocationItem)
                .collect(Collectors.toList());

        return AllLocationResponse.builder()
                .total(items.size())
                .locations(items)
                .build();
    }

    @Override
    public LocationDetailResponse getLocationDetail(String locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Location"));
        if (location.getPost().getStatus() != PostStatus.APPROVED) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Location");
        }
        return locationMapper.toDetailResponse(location);
    }
}