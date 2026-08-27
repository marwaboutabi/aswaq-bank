package com.aswaqbank.exception;

// Si tu as déjà une exception équivalente ailleurs dans le projet (ex: pour les virements),
// réutilise-la à la place et supprime ce fichier.
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}