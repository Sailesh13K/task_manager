package com.taskflow.taskmanager.repository;

import com.taskflow.taskmanager.entity.Project;
import com.taskflow.taskmanager.entity.Task;
import com.taskflow.taskmanager.entity.User;
import com.taskflow.taskmanager.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignedTo(User user);

    List<Task> findByProjectAndAssignedTo(Project project, User user);

    Long countByStatus(TaskStatus status);

    Long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
