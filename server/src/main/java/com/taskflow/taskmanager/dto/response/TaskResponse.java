package com.taskflow.taskmanager.dto.response;

import com.taskflow.taskmanager.enums.Priority;
import com.taskflow.taskmanager.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDate dueDate;

    private Priority priority;

    private TaskStatus status;

    private ProjectResponse project;

    private UserSummaryResponse assignedTo;

    private UserSummaryResponse createdBy;
}
