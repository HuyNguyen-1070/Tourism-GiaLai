package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import com.gialai.tourism.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Entity(name = "accounts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account extends BaseEntity implements UserDetails {
    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(unique = true, nullable = false, columnDefinition = "VARCHAR(30)")
    private String username;

    @Column(unique = true, nullable = false, columnDefinition = "VARCHAR(50)")
    private String email;

    @Column(nullable = false, columnDefinition = "VARCHAR(60)")
    private String password;

    @Column(columnDefinition = "VARCHAR(255)")
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(10) DEFAULT 'LOCAL'")
    private AuthProvider provider;

    @Column(name = "provider_id", columnDefinition = "VARCHAR(100)")
    private String providerId;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(columnDefinition = "VARCHAR(20)")
    private String phone;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @ManyToMany
    @JoinTable(name = "accounts_roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
