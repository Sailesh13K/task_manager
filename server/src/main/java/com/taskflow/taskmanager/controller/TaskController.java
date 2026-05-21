package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.request.AssignTaskRequest;
import com.taskflow.taskmanager.dto.request.CreateTaskRequest;
import com.taskflow.taskmanager.dto.request.UpdateTaskRequest;
import com.taskflow.taskmanager.dto.request.UpdateTaskStatusRequest;
import com.taskflow.taskmanager.dto.response.TaskResponse;
import com.taskflow.taskmanager.mapper.ResponseMapper;
import com.taskflow.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ResponseMapper responseMapper;

    @PostMapping
    public TaskResponse createTask(
            @Valid @RequestBody CreateTaskRequest request
    ) {

        return responseMapper.toTaskResponse(taskService.createTask(request));
    }

    @GetMapping("/project/{projectId}")
    public List<TaskResponse> getProjectTasks(
            @PathVariable Long projectId
    ) {

        return taskService.getProjectTasks(projectId)
                .stream()
                .map(responseMapper::toTaskResponse)
                .toList();
    }

    @GetMapping("/my-tasks")
    public List<TaskResponse> getMyTasks() {

        return taskService.getMyTasks()
                .stream()
                .map(responseMapper::toTaskResponse)
                .toList();
    }

    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request
    ) {

        return responseMapper.toTaskResponse(
                taskService.updateTask(taskId, request)
        );
    }

    @PutMapping("/{taskId}/status")
    public TaskResponse updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {

        return responseMapper.toTaskResponse(
                taskService.updateTaskStatus(taskId, request)
        );
    }

    @PutMapping("/{taskId}/assign")
    public TaskResponse assignTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AssignTaskRequest request
    ) {

        return responseMapper.toTaskResponse(taskService.assignTask(taskId, request));
    }

    @DeleteMapping("/{taskId}")
    public String deleteTask(
            @PathVariable Long taskId
    ) {

        taskService.deleteTask(taskId);

        return "Task deleted successfully";
    }
}
