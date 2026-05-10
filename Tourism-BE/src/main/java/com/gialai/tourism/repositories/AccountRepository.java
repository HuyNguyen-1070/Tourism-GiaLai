package com.gialai.tourism.repositories;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByUsername(String username);
    List<Account> findByRoles_Name(RoleType roleType);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByRoles_Name(RoleType roleType);
    @Query("SELECT a FROM accounts a JOIN FETCH a.roles WHERE a.email = :email")
    Optional<Account> findByEmailWithRoles(@Param("email") String email);
    Optional<Account> findByEmailAndIsActiveTrue(String email);
    @Query("SELECT a FROM accounts a JOIN FETCH a.roles WHERE a.username = :username")
    Optional<Account> findByUsernameWithRoles(@Param("username") String username);
    Optional<Account> findByUsernameAndIsActiveTrue(String username);
}