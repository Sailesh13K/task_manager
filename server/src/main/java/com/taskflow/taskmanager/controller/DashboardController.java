package com.taskflow.taskmanager.controller;

import com.taskflow.taskmanager.dto.response.DashboardResponse;
import com.taskflow.taskmanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboardData();
    }
}