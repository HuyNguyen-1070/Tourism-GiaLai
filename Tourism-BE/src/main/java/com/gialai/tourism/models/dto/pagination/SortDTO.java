package com.gialai.tourism.models.dto.pagination;

import com.gialai.tourism.enums.SortDirection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SortDTO {
    private String field;
    private SortDirection sort;
}