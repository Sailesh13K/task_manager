package com.taskflow.taskmanager.service;

import com.taskflow.taskmanager.dto.response.DashboardResponse;
import com.taskflow.taskmanager.entity.ProjectMember;
import com.taskflow.taskmanager.entity.Task;
import com.taskflow.taskmanager.entity.User;
import com.taskflow.taskmanager.enums.Role;
import com.taskflow.taskmanager.enums.TaskStatus;
import com.taskflow.taskmanager.repository.ProjectMemberRepository;
import com.taskflow.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;
    private final ProjectMemberRepository projectMemberRepository;

    public DashboardResponse getDashboardData() {

        User currentUser = currentUserService.getCurrentUser();

        List<Task> visibleTasks = projectMemberRepository.findByUser(currentUser)
                .stream()
                .flatMap(member -> getVisibleTasks(member, currentUser).stream())
                .distinct()
                .toList();

        Long totalTasks = (long) visibleTasks.size();

        Long todoTasks = countByStatus(visibleTasks, TaskStatus.TODO);

        Long inProgressTasks = countByStatus(visibleTasks, TaskStatus.IN_PROGRESS);

        Long doneTasks = countByStatus(visibleTasks, TaskStatus.DONE);

        Long overdueTasks = visibleTasks.stream()
                .filter(task -> task.getDueDate() != null)
                .filter(task -> task.getDueDate().isBefore(LocalDate.now()))
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .count();

        Map<String, Long> tasksPerUser = visibleTasks.stream()
                .collect(Collectors.groupingBy(
                        task -> task.getAssignedTo().getName(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return new DashboardResponse(
                totalTasks,
                todoTasks,
                inProgressTasks,
                doneTasks,
                overdueTasks,
                tasksPerUser
        );
    }

    private List<Task> getVisibleTasks(ProjectMember member, User currentUser) {

        if(member.getRole() == Role.ADMIN) {
            return taskRepository.findByProject(member.getProject());
        }

        return taskRepository.findByProjectAndAssignedTo(
                member.getProject(),
                currentUser
        );
    }

    private Long countByStatus(List<Task> tasks, TaskStatus status) {

        return tasks.stream()
                .filter(task -> task.getStatus() == status)
                .count();
    }
}
