package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.request.AddMemberRequest;
import com.taskflow.taskmanager.dto.request.CreateProjectRequest;
import com.taskflow.taskmanager.dto.response.ProjectMemberResponse;
import com.taskflow.taskmanager.dto.response.ProjectResponse;
import com.taskflow.taskmanager.mapper.ResponseMapper;
import com.taskflow.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ResponseMapper responseMapper;

    @PostMapping
    public ProjectResponse createProject(
            @Valid @RequestBody CreateProjectRequest request
    ) {

        return responseMapper.toProjectResponse(projectService.createProject(request));
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getProject(
            @PathVariable Long projectId
    ) {

        return responseMapper.toProjectResponse(projectService.getProject(projectId));
    }

    @GetMapping("/{projectId}/members")
    public List<ProjectMemberResponse> getProjectMembers(
            @PathVariable Long projectId
    ) {

        return projectService.getProjectMembers(projectId)
                .stream()
                .map(responseMapper::toProjectMemberResponse)
                .toList();
    }

    @PostMapping("/{projectId}/members")
    public ProjectMemberResponse addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddMemberRequest request
    ) {

        return responseMapper.toProjectMemberResponse(
                projectService.addMember(projectId, request)
        );
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public String removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId
    ) {

        projectService.removeMember(projectId, userId);

        return "Member removed successfully";
    }

    @GetMapping("/my-projects")
    public List<ProjectMemberResponse> getMyProjects() {

        return projectService.getMyProjects()
                .stream()
                .map(responseMapper::toProjectMemberResponse)
                .toList();
    }
}
