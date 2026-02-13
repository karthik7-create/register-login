package com.authsystem.registerlogin.controller;

import com.authsystem.registerlogin.dto.ApiResponse;
import com.authsystem.registerlogin.dto.AuthResponse;
import com.authsystem.registerlogin.dto.LoginRequest;
import com.authsystem.registerlogin.dto.RegisterRequest;
import com.authsystem.registerlogin.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testProtected() {
        return ResponseEntity.ok("You are authenticated! This is a protected endpoint.");
    }
}
