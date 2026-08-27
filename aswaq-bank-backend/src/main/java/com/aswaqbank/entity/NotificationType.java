package com.aswaqbank.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

// Les valeurs correspondent exactement aux clés utilisées côté frontend
// (FILTERS / notif-icon-${notif.type}) pour ne rien avoir à retraduire côté React.
public enum NotificationType {
    ORDERS("orders"),
    PAYMENT("payment"),
    STOCK("stock"),
    SUPPLIER("supplier"),
    LOYALTY("loyalty"),
    AI("ai"),
    SECURITY("security");

    private final String value;

    NotificationType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static NotificationType fromValue(String value) {
        for (NotificationType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Type de notification inconnu : " + value);
    }
}