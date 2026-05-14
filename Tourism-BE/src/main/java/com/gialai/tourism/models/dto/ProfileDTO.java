package com.gialai.tourism.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private String id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private String phone;
    private String address;
    private Set<String> roles;
}