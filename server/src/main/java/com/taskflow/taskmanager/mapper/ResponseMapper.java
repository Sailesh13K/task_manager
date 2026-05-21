package com.taskflow.taskmanager.mapper;

import com.taskflow.taskmanager.dto.response.ProjectMemberResponse;
import com.taskflow.taskmanager.dto.response.ProjectResponse;
import com.taskflow.taskmanager.dto.response.TaskResponse;
import com.taskflow.taskmanager.dto.response.UserSummaryResponse;
import com.taskflow.taskmanager.entity.Project;
import com.taskflow.taskmanager.entity.ProjectMember;
import com.taskflow.taskmanager.entity.Task;
import com.taskflow.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ResponseMapper {

    public UserSummaryResponse toUserSummary(User user) {

        if(user == null) {
            return null;
        }

        return new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public ProjectResponse toProjectResponse(Project project) {

        if(project == null) {
            return null;
        }

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                toUserSummary(project.getCreatedBy())
        );
    }

    public ProjectMemberResponse toProjectMemberResponse(ProjectMember member) {

        return new ProjectMemberResponse(
                member.getId(),
                toProjectResponse(member.getProject()),
                toUserSummary(member.getUser()),
                member.getRole()
        );
    }

    public TaskResponse toTaskResponse(Task task) {

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                toProjectResponse(task.getProject()),
                toUserSummary(task.getAssignedTo()),
                toUserSummary(task.getCreatedBy())
        );
    }
}
