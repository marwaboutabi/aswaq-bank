package com.aswaqbank.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody ChatRequest request) {

        String response = geminiService.chat(request.getMessage());

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }

    @PostMapping("/assistant-fournisseur")
    public ResponseEntity<Map<String, String>> assistantFournisseur(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("response", "Veuillez poser une question.")
            );
        }

        String response = geminiService.chatFournisseur(question);

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }
}