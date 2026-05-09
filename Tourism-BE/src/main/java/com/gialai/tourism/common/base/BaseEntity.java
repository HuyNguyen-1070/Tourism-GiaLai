package com.gialai.tourism.common.base;

import com.gialai.tourism.common.utils.Util;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Data
public abstract class BaseEntity {
    @Id
    @Column(name = "id", updatable = false, columnDefinition = "VARCHAR(20)", nullable = false)
    private String id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void setGeneratedIdIfAbsent(){
        if (this.id == null){
            this.id = Util.getPrefix(this.getClass()) + Util.randomAlphaNumber(8);
        }
    }
}
