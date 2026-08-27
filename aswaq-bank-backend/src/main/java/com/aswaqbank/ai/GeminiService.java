package com.aswaqbank.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=";

    // ============================================================
    // ASSISTANT COMMUN / COMMERÇANT
    // ============================================================

    public String chat(String message) {

        String systemPrompt = """
                Tu es l'assistant IA officiel de la plateforme Aswaq Bank.

                TON RÔLE :
                Tu aides principalement les commerçants à comprendre et utiliser
                leur espace Aswaq Bank.

                Tu peux aider concernant :
                - les ventes
                - le chiffre d'affaires
                - les produits
                - le stock
                - les paiements
                - les transactions
                - les commandes fournisseurs
                - la fidélité
                - les tickets
                - les promotions
                - l'optimisation de l'activité commerciale

                LANGUE :
                - Réponds dans la langue utilisée par l'utilisateur.
                - Si l'utilisateur écrit en français, réponds en français.
                - Si l'utilisateur écrit en arabe, réponds en arabe.
                - Si l'utilisateur écrit en Darija, réponds en Darija.
                - Si l'utilisateur mélange français et arabe, adapte-toi naturellement.

                FIABILITÉ :
                - Ne jamais inventer de données personnelles.
                - Ne jamais inventer un solde.
                - Ne jamais inventer des transactions.
                - Ne jamais inventer des ventes.
                - Ne jamais inventer des produits ou commandes.
                - Si une donnée réelle n'est pas fournie, indique clairement que tu ne peux pas la consulter.

                SÉCURITÉ :
                - Ne demande jamais de mot de passe.
                - Ne demande jamais de code PIN.
                - Ne demande jamais de numéro complet de carte bancaire.
                - Ne demande jamais d'informations bancaires sensibles.

                STYLE :
                - Sois naturel.
                - Sois clair.
                - Sois professionnel.
                - Évite les réponses inutilement longues.

                QUESTION DE L'UTILISATEUR :
                """ + message;

        return callGemini(systemPrompt);
    }

    // ============================================================
    // ASSISTANT FOURNISSEUR
    // ============================================================

    public String chatFournisseur(String message) {

        String systemPrompt = """
                Tu es l'assistant IA officiel de la plateforme Aswaq Bank
                spécialisé pour les FOURNISSEURS.

                TON RÔLE :
                Tu aides les fournisseurs à gérer et comprendre leur activité
                sur la plateforme Aswaq Bank.

                Tu peux aider concernant :

                - les commandes reçues
                - les commandes en attente
                - les commandes acceptées
                - la préparation des commandes
                - les livraisons
                - les produits
                - le catalogue
                - les stocks
                - les ruptures de stock
                - les paiements reçus
                - les performances commerciales
                - les produits les plus demandés
                - les produits les moins demandés
                - les prévisions de demande
                - l'optimisation des ventes
                - les stratégies commerciales fournisseur

                IMPORTANT :
                Tu es un assistant fournisseur.
                Tes conseils doivent donc être adaptés à un fournisseur
                qui vend ses produits à des commerçants.

                DONNÉES :
                - Tu ne disposes pas automatiquement des données réelles
                  du fournisseur.
                - Ne prétends jamais connaître ses commandes réelles.
                - Ne prétends jamais connaître son stock réel.
                - Ne prétends jamais connaître ses paiements réels.
                - Ne prétends jamais connaître son chiffre d'affaires réel.
                - Si les données ne sont pas fournies dans la question,
                  explique que tu as besoin de ces données pour effectuer
                  une analyse précise.

                LANGUE :
                - Réponds dans la langue utilisée par l'utilisateur.
                - Français → français.
                - Arabe → arabe.
                - Darija → Darija.
                - Français + arabe → adapte-toi naturellement.

                STYLE :
                - Sois professionnel.
                - Sois simple et naturel.
                - Donne des recommandations concrètes.
                - Utilise des listes lorsque cela facilite la compréhension.
                - Évite les réponses inutilement longues.

                SÉCURITÉ :
                - Ne demande jamais de mot de passe.
                - Ne demande jamais de code PIN.
                - Ne demande jamais de numéro complet de carte bancaire.
                - Ne demande jamais d'informations bancaires sensibles.

                QUESTION DU FOURNISSEUR :
                """ + message;

        return callGemini(systemPrompt);
    }

    // ============================================================
    // APPEL GEMINI
    // ============================================================

    private String callGemini(String prompt) {

        String url = GEMINI_URL + apiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        try {

            Map<String, Object> response =
                    restTemplate.postForObject(
                            url,
                            requestBody,
                            Map.class
                    );

            if (response == null) {
                return "Désolé, aucune réponse n'a été reçue de Gemini.";
            }

            Object candidatesObject = response.get("candidates");

            if (!(candidatesObject instanceof List<?> candidates)
                    || candidates.isEmpty()) {

                return "Désolé, Gemini n'a retourné aucune réponse.";
            }

            Object candidateObject = candidates.get(0);

            if (!(candidateObject instanceof Map<?, ?> candidate)) {
                return "Désolé, la réponse de Gemini est invalide.";
            }

            Object contentObject = candidate.get("content");

            if (!(contentObject instanceof Map<?, ?> responseContent)) {
                return "Désolé, le contenu de la réponse Gemini est invalide.";
            }

            Object partsObject = responseContent.get("parts");

            if (!(partsObject instanceof List<?> parts)
                    || parts.isEmpty()) {

                return "Désolé, Gemini n'a retourné aucun texte.";
            }

            Object firstPart = parts.get(0);

            if (!(firstPart instanceof Map<?, ?> partMap)) {
                return "Désolé, la réponse Gemini est invalide.";
            }

            Object text = partMap.get("text");

            if (text instanceof String) {
                return (String) text;
            }

            return "Désolé, aucune réponse textuelle n'a été reçue.";

        } catch (Exception e) {

            e.printStackTrace();

            return "Désolé, une erreur est survenue lors de la communication avec Gemini.";
        }
    }
}