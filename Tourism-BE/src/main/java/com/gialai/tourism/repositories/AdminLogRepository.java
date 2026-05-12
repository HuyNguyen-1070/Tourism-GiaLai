package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminLogRepository extends JpaRepository<AdminLog, String>, JpaSpecificationExecutor<AdminLog> {
}