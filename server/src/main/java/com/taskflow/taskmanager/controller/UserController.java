package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.response.UserSummaryResponse;
import com.taskflow.taskmanager.mapper.ResponseMapper;
import com.taskflow.taskmanager.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final ResponseMapper responseMapper;

    @GetMapping("/me")
    public UserSummaryResponse me() {

        return responseMapper.toUserSummary(
                currentUserService.getCurrentUser()
        );
    }
}