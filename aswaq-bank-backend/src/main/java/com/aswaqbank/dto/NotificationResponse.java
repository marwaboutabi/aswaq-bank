package com.aswaqbank.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class NotificationResponse {

    private Long id;
    private String type;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private boolean read;
    private String linkLabel;
    private String linkTo;
    private Map<String, Object> details;

    public NotificationResponse() {
    }

    public NotificationResponse(Long id, String type, String title, String description, LocalDateTime createdAt,
                                 boolean read, String linkLabel, String linkTo, Map<String, Object> details) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.read = read;
        this.linkLabel = linkLabel;
        this.linkTo = linkTo;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getLinkLabel() {
        return linkLabel;
    }

    public void setLinkLabel(String linkLabel) {
        this.linkLabel = linkLabel;
    }

    public String getLinkTo() {
        return linkTo;
    }

    public void setLinkTo(String linkTo) {
        this.linkTo = linkTo;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}