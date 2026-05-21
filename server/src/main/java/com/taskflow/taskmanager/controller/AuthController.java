package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.request.LoginRequest;
import com.taskflow.taskmanager.dto.request.SignupRequest;
import com.taskflow.taskmanager.dto.response.AuthResponse;
import com.taskflow.taskmanager.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public AuthResponse signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}