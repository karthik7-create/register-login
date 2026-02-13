package com.authsystem.registerlogin.service;

import com.authsystem.registerlogin.dto.AuthResponse;
import com.authsystem.registerlogin.dto.LoginRequest;
import com.authsystem.registerlogin.dto.RegisterRequest;
import com.authsystem.registerlogin.entity.User;
import com.authsystem.registerlogin.repository.UserRepository;
import com.authsystem.registerlogin.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public String register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        // Build and save user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .build();

        userRepository.save(user);

        // Fire-and-forget async email
        emailService.sendRegistrationSuccessEmail(user.getEmail(), user.getUsername());

        return "User registered successfully!";
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password!");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, "Login successful!", user.getUsername(), user.getEmail());
    }
}
