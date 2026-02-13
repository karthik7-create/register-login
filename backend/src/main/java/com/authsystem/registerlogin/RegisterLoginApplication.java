package com.authsystem.registerlogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RegisterLoginApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegisterLoginApplication.class, args);
    }
}
