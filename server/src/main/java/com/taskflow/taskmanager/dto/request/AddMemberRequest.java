package com.taskflow.taskmanager.dto.request;

import com.taskflow.taskmanager.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddMemberRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Role role;
}