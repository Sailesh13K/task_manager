package com.taskflow.taskmanager.dto.response;

import com.taskflow.taskmanager.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectMemberResponse {

    private Long id;

    private ProjectResponse project;

    private UserSummaryResponse user;

    private Role role;
}
