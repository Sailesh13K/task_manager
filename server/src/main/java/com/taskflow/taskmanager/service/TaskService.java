package com.taskflow.taskmanager.service;

import com.taskflow.taskmanager.dto.request.AssignTaskRequest;
import com.taskflow.taskmanager.dto.request.CreateTaskRequest;
import com.taskflow.taskmanager.dto.request.UpdateTaskRequest;
import com.taskflow.taskmanager.dto.request.UpdateTaskStatusRequest;
import com.taskflow.taskmanager.entity.ProjectMember;
import com.taskflow.taskmanager.entity.Project;
import com.taskflow.taskmanager.entity.Task;
import com.taskflow.taskmanager.entity.User;
import com.taskflow.taskmanager.enums.Role;
import com.taskflow.taskmanager.enums.TaskStatus;
import com.taskflow.taskmanager.exception.ForbiddenException;
import com.taskflow.taskmanager.exception.ResourceNotFoundException;
import com.taskflow.taskmanager.repository.ProjectMemberRepository;
import com.taskflow.taskmanager.repository.ProjectRepository;
import com.taskflow.taskmanager.repository.TaskRepository;
import com.taskflow.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class TaskService {
        
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public Task createTask(CreateTaskRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Project project = projectRepository
                .findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        requireProjectAdmin(project, currentUser, "Only admin can create tasks");

        User assignedUser = userRepository
                .findById(request.getAssignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        projectMemberRepository
                .findByProjectAndUser(project, assignedUser)
                .orElseThrow(() ->
                        new ForbiddenException("Assigned user is not part of this project")
                );

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority())
                .status(TaskStatus.TODO)
                .assignedTo(assignedUser)
                .project(project)
                .createdBy(currentUser)
                .build();

        return taskRepository.save(task);
    }

    public List<Task> getProjectTasks(Long projectId) {

        User currentUser = currentUserService.getCurrentUser();

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        var member = projectMemberRepository
                .findByProjectAndUser(project, currentUser)
                .orElseThrow(() ->
                        new ForbiddenException("You are not part of this project")
                );

        if(member.getRole() != Role.ADMIN) {
            return taskRepository.findByProjectAndAssignedTo(project, currentUser);
        }

        return taskRepository.findByProject(project);
    }

    public List<Task> getMyTasks() {
        User currentUser = currentUserService.getCurrentUser();
        return taskRepository.findByAssignedTo(currentUser);
    }

    public Task updateTask(Long taskId, UpdateTaskRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        requireProjectAdmin(
                task.getProject(),
                currentUser,
                "Only admin can update task details"
        );

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());

        if(request.getAssignedUserId() != null) {
            User assignedUser = userRepository
                    .findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

            projectMemberRepository
                    .findByProjectAndUser(task.getProject(), assignedUser)
                    .orElseThrow(() ->
                            new ForbiddenException("Assigned user is not part of this project")
                    );

            task.setAssignedTo(assignedUser);
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(
            Long taskId,
            UpdateTaskStatusRequest request
    ) {

        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        var member = projectMemberRepository
                .findByProjectAndUser(task.getProject(), currentUser)
                .orElseThrow(() ->
                        new ForbiddenException("You are not part of this project")
                );

        boolean isAssignedUser = task.getAssignedTo().getId().equals(currentUser.getId());
        boolean isProjectAdmin = member.getRole() == Role.ADMIN;

        if(!isProjectAdmin && !isAssignedUser) {
            throw new ForbiddenException("You can update only your assigned tasks");
        }

        task.setStatus(request.getStatus());

        return taskRepository.save(task);
    }

    public Task assignTask(Long taskId, AssignTaskRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        requireProjectAdmin(task.getProject(), currentUser, "Only admin can assign tasks");

        User newUser = userRepository
                .findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        projectMemberRepository
                .findByProjectAndUser(task.getProject(), newUser)
                .orElseThrow(() ->
                        new ForbiddenException("User is not part of this project")
                );

        task.setAssignedTo(newUser);

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {

        User currentUser = currentUserService.getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        requireProjectAdmin(
                task.getProject(),
                currentUser,
                "Only admin can delete tasks"
        );

        taskRepository.delete(task);
    }

    private ProjectMember requireProjectAdmin(
            Project project,
            User currentUser,
            String message
    ) {

        ProjectMember member = projectMemberRepository
                .findByProjectAndUser(project, currentUser)
                .orElseThrow(() -> new ForbiddenException("You are not part of this project"));

        if(member.getRole() != Role.ADMIN) {
            throw new ForbiddenException(message);
        }

        return member;
    }

}
