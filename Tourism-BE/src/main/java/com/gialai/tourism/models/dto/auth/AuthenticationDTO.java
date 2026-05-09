package com.gialai.tourism.models.dto.auth;

import com.gialai.tourism.models.dto.AccountDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationDTO {
    private String accessToken;
    private String refreshToken;
    private AccountDTO account;
}
