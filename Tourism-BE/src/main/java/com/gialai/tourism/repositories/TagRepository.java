package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {
    Optional<Tag> findByName(String name);
    List<Tag> findAllByOrderByNameAsc();
    List<Tag> findByNameContainingIgnoreCase(String name);
}