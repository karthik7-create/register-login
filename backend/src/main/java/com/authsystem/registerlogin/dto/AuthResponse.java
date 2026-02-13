package com.authsystem.registerlogin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private String message;
    private String username;
    private String email;

    public AuthResponse(String token, String message, String username, String email) {
        this.token = token;
        this.type = "Bearer";
        this.message = message;
        this.username = username;
        this.email = email;
    }
}
