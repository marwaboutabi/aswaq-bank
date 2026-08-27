package com.aswaqbank.controller;

import com.aswaqbank.dto.UpdateProfileRequest;
import com.aswaqbank.dto.UserProfileResponse;
import com.aswaqbank.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userProfileService.getProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userProfileService.updateProfile(request));
    }
    @PostMapping("/me/email/request-change")
    public ResponseEntity<Map<String, String>> requestEmailChange(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userProfileService.requestEmailChange(body.get("newEmail")));
    }

    @PostMapping("/me/email/confirm-change")
    public ResponseEntity<Map<String, Object>> confirmEmailChange(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                userProfileService.confirmEmailChange(body.get("newEmail"), body.get("code"))
        );
    }
}