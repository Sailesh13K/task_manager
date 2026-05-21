package com.taskflow.taskmanager.service;

import com.taskflow.taskmanager.dto.request.CreateTaskRequest;
import com.taskflow.taskmanager.dto.request.UpdateTaskStatusRequest;
import com.taskflow.taskmanager.entity.Project;
import com.taskflow.taskmanager.entity.ProjectMember;
import com.taskflow.taskmanager.entity.Task;
import com.taskflow.taskmanager.entity.User;
import com.taskflow.taskmanager.enums.Priority;
import com.taskflow.taskmanager.enums.Role;
import com.taskflow.taskmanager.enums.TaskStatus;
import com.taskflow.taskmanager.exception.ForbiddenException;
import com.taskflow.taskmanager.repository.ProjectMemberRepository;
import com.taskflow.taskmanager.repository.ProjectRepository;
import com.taskflow.taskmanager.repository.TaskRepository;
import com.taskflow.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private TaskService taskService;

    private User admin;
    private User member;
    private User outsider;
    private Project project;

    @BeforeEach
    void setUp() {

        admin = User.builder()
                .id(1L)
                .name("Admin")
                .email("admin@example.com")
                .password("secret")
                .build();

        member = User.builder()
                .id(2L)
                .name("Member")
                .email("member@example.com")
                .password("secret")
                .build();

        outsider = User.builder()
                .id(3L)
                .name("Outsider")
                .email("outsider@example.com")
                .password("secret")
                .build();

        project = Project.builder()
                .id(10L)
                .name("Project")
                .createdBy(admin)
                .build();

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(admin.getEmail(), null)
        );
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }

    @Test
    void createTaskRejectsAssignedUserOutsideProject() {

        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Task");
        request.setPriority(Priority.HIGH);
        request.setProjectId(project.getId());
        request.setAssignedUserId(outsider.getId());

        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(projectMemberRepository.findByProjectAndUser(project, admin))
                .thenReturn(Optional.of(projectMember(admin, Role.ADMIN)));
        when(userRepository.findById(outsider.getId())).thenReturn(Optional.of(outsider));
        when(projectMemberRepository.findByProjectAndUser(project, outsider))
                .thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class, () -> taskService.createTask(request));

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void memberSeesOnlyTheirAssignedProjectTasks() {

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(member.getEmail(), null)
        );

        Task assignedTask = task("Assigned", member);

        when(currentUserService.getCurrentUser()).thenReturn(member);
        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(projectMemberRepository.findByProjectAndUser(project, member))
                .thenReturn(Optional.of(projectMember(member, Role.MEMBER)));
        when(taskRepository.findByProjectAndAssignedTo(project, member))
                .thenReturn(List.of(assignedTask));

        List<Task> tasks = taskService.getProjectTasks(project.getId());

        assertEquals(1, tasks.size());
        assertEquals(assignedTask, tasks.get(0));
        verify(taskRepository, never()).findByProject(project);
    }

    @Test
    void adminCanUpdateStatusForTaskAssignedToAnotherUser() {

        Task task = task("Assigned", member);
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.DONE);

        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(projectMemberRepository.findByProjectAndUser(project, admin))
                .thenReturn(Optional.of(projectMember(admin, Role.ADMIN)));
        when(taskRepository.save(task)).thenReturn(task);

        Task updatedTask = taskService.updateTaskStatus(task.getId(), request);

        assertEquals(TaskStatus.DONE, updatedTask.getStatus());
        verify(taskRepository).save(task);
    }

    private ProjectMember projectMember(User user, Role role) {

        return ProjectMember.builder()
                .id(user.getId())
                .project(project)
                .user(user)
                .role(role)
                .build();
    }

    private Task task(String title, User assignedTo) {

        return Task.builder()
                .id(100L)
                .title(title)
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .project(project)
                .assignedTo(assignedTo)
                .createdBy(admin)
                .build();
    }
}
