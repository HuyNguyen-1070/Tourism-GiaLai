package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {
    Optional<Location> findByPostId(String postId);

    @Query(value = "SELECT l.*, (6371 * ACOS(COS(RADIANS(:lat)) * COS(RADIANS(l.latitude)) " +
            "* COS(RADIANS(l.longitude) - RADIANS(:lng)) + SIN(RADIANS(:lat)) * SIN(RADIANS(l.latitude)))) AS distance " +
            "FROM locations l JOIN posts p ON p.id = l.post_id " +
            "WHERE p.status = 'APPROVED' " +
            "HAVING distance <= :radius " +
            "ORDER BY distance ASC LIMIT :limit",
            nativeQuery = true)
    List<Object[]> findNearbyLocationsRaw(@Param("lat") double lat,
                                          @Param("lng") double lng,
                                          @Param("radius") int radius,
                                          @Param("limit") int limit);

    @Query("SELECT l FROM Location l JOIN FETCH l.post p WHERE p.status = 'APPROVED'")
    List<Location> findAllApprovedLocations();
}