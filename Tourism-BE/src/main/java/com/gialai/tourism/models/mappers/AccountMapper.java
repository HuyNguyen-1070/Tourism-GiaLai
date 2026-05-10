package com.gialai.tourism.models.mappers;

import com.gialai.tourism.enums.AuthProvider;
import org.mapstruct.Mapper;
import com.gialai.tourism.models.dto.AccountDTO;
import com.gialai.tourism.models.dto.auth.RegisterDTO;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Role;

import java.util.Set;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface AccountMapper {
    AccountDTO toDTO(Account account);

    default Account mapRegisterDtoToEntity(RegisterDTO registerDTO, Role role) {
        Account account = new Account();
        account.setFullName(registerDTO.getFullName());
        account.setUsername(registerDTO.getUsername());
        account.setEmail(registerDTO.getEmail());
        account.setPassword(registerDTO.getPassword());
        account.setActive(true);
        account.setProvider(AuthProvider.LOCAL);
        if (role != null) {
            account.setRoles(Set.of(role));
        }
        return account;
    }
}