package com.taskflow.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private Long totalTasks;

    private Long todoTasks;

    private Long inProgressTasks;

    private Long doneTasks;

    private Long overdueTasks;

    private Map<String, Long> tasksPerUser;
}
