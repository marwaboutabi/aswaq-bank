package com.aswaqbank.dto;

public class DeliveryUpdateRequest {
    private String transporteur;
    private String vehicule;
    private String chauffeur;
    private String trackingNumber;
    private String estimatedDeliveryDate; // format "yyyy-MM-dd"

    public String getTransporteur() { return transporteur; }
    public void setTransporteur(String transporteur) { this.transporteur = transporteur; }
    public String getVehicule() { return vehicule; }
    public void setVehicule(String vehicule) { this.vehicule = vehicule; }
    public String getChauffeur() { return chauffeur; }
    public void setChauffeur(String chauffeur) { this.chauffeur = chauffeur; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(String estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
}