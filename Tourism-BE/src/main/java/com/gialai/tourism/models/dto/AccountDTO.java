package com.gialai.tourism.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDTO {
    private String id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private Set<String> roles;
}