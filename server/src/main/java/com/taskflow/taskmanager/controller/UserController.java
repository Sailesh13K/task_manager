package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.response.UserSummaryResponse;
import com.taskflow.taskmanager.mapper.ResponseMapper;
import com.taskflow.taskmanager.repository.UserRepository;
import com.taskflow.taskmanager.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final ResponseMapper responseMapper;

    @GetMapping("/me")
    public UserSummaryResponse me() {

        return responseMapper.toUserSummary(
                currentUserService.getCurrentUser()
        );
    }

    @GetMapping
    public List<UserSummaryResponse> users() {

        return userRepository.findAll()
                .stream()
                .map(responseMapper::toUserSummary)
                .toList();
    }
}
