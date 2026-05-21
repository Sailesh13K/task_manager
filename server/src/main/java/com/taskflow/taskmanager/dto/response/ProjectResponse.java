package com.taskflow.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectResponse {

    private Long id;

    private String name;

    private String description;

    private UserSummaryResponse createdBy;
}
