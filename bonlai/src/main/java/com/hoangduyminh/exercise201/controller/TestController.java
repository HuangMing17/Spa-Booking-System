package com.hoangduyminh.exercise201.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @GetMapping("/bcrypt/{password}")
    public Map<String, String> generateBcrypt(@PathVariable String password) {
        Map<String, String> result = new HashMap<>();
        String hash = passwordEncoder.encode(password);
        result.put("password", password);
        result.put("hash", hash);
        result.put("verification", String.valueOf(passwordEncoder.matches(password, hash)));
        return result;
    }
    
    @GetMapping("/verify")
    public Map<String, Object> verifyPassword(
            @RequestParam String password, 
            @RequestParam String hash) {
        Map<String, Object> result = new HashMap<>();
        result.put("password", password);
        result.put("hash", hash);
        result.put("matches", passwordEncoder.matches(password, hash));
        return result;
    }
}
