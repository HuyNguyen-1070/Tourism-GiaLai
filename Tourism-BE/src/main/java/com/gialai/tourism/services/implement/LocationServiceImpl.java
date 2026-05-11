package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.request.CreateLocationRequest;
import com.gialai.tourism.models.dto.request.UpdateLocationRequest;
import com.gialai.tourism.models.dto.response.LocationResponse;
import com.gialai.tourism.models.entities.Location;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.mappers.LocationMapper;
import com.gialai.tourism.repositories.LocationRepository;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final PostRepository postRepository;
    private final LocationMapper locationMapper;

    @Override
    @Transactional
    @CacheEvict(value = "allMapLocations", allEntries = true)
    public LocationResponse createLocation(CreateLocationRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, request.getPostId()));

        if (post.getStatus() != PostStatus.APPROVED) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Only approved posts can have a location");
        }

        locationRepository.findByPostId(request.getPostId()).ifPresent(loc -> {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Post already has a location");
        });

        Location location = Location.builder()
                .post(post)
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .placeId(request.getPlaceId())
                .build();

        location = locationRepository.save(location);
        return locationMapper.toAdminResponse(location);
    }

    @Override
    @Transactional
    @CacheEvict(value = "allMapLocations", allEntries = true)
    public LocationResponse updateLocation(String id, UpdateLocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Location"));

        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setPlaceId(request.getPlaceId());

        location = locationRepository.save(location);
        return locationMapper.toAdminResponse(location);
    }

    @Override
    @Transactional
    @CacheEvict(value = "allMapLocations", allEntries = true)
    public void deleteLocation(String id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Location"));
        locationRepository.delete(location);
    }
}