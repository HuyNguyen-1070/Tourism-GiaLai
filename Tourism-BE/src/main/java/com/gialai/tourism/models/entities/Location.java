package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "locations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Location extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", unique = true, nullable = false)
    private Post post;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "public_id", length = 255)
    private String publicId;

    @Column(name = "place_id", length = 255)
    private String placeId;
}