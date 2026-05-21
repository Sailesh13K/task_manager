package com.taskflow.taskmanager.service;

import com.taskflow.taskmanager.dto.request.AddMemberRequest;
import com.taskflow.taskmanager.dto.request.CreateProjectRequest;
import com.taskflow.taskmanager.entity.Project;
import com.taskflow.taskmanager.entity.ProjectMember;
import com.taskflow.taskmanager.entity.User;
import com.taskflow.taskmanager.enums.Role;
import com.taskflow.taskmanager.exception.BadRequestException;
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
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final CurrentUserService currentUserService;
    private final TaskRepository taskRepository;

    public Project createProject(CreateProjectRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        Project savedProject = projectRepository.save(project);

        ProjectMember adminMember = ProjectMember.builder()
                .project(savedProject)
                .user(currentUser)
                .role(Role.ADMIN)
                .build();

        projectMemberRepository.save(adminMember);

        return savedProject;
    }

    public ProjectMember addMember(
            Long projectId,
            AddMemberRequest request
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        requireProjectAdmin(project);

        User userToAdd = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean alreadyExists = projectMemberRepository
                .findByProjectAndUser(project, userToAdd)
                .isPresent();

        if(alreadyExists) {
            throw new BadRequestException("User already in project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(userToAdd)
                .role(request.getRole())
                .build();

        return projectMemberRepository.save(member);
    }

    public void removeMember(Long projectId, Long userId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        requireProjectAdmin(project);

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProjectMember member = projectMemberRepository
                .findByProjectAndUser(project, userToRemove)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));

        if(member.getRole() == Role.ADMIN) {
            long adminCount = projectMemberRepository.findByProject(project)
                    .stream()
                    .filter(projectMember -> projectMember.getRole() == Role.ADMIN)
                    .count();

            if(adminCount <= 1) {
                throw new BadRequestException("Project must have at least one admin");
            }
        }

        boolean hasAssignedTasks = !taskRepository
                .findByProjectAndAssignedTo(project, userToRemove)
                .isEmpty();

        if(hasAssignedTasks) {
            throw new BadRequestException("Reassign this member's tasks before removing them");
        }

        projectMemberRepository.delete(member);
    }

    public Project getProject(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        requireProjectMember(project);

        return project;
    }

    public List<ProjectMember> getProjectMembers(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        requireProjectMember(project);

        return projectMemberRepository.findByProject(project);
    }

    public List<ProjectMember> getMyProjects() {

        User currentUser = currentUserService.getCurrentUser();

        return projectMemberRepository.findByUser(currentUser);
    }

    private ProjectMember requireProjectMember(Project project) {

        User currentUser = currentUserService.getCurrentUser();

        return projectMemberRepository
                .findByProjectAndUser(project, currentUser)
                .orElseThrow(() -> new ForbiddenException("You are not part of this project"));
    }

    private ProjectMember requireProjectAdmin(Project project) {

        ProjectMember member = requireProjectMember(project);

        if(member.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admin can manage project members");
        }

        return member;
    }

}
