package com.arttu;

import java.sql.Timestamp;

public class Interaction {
    private int interactionId;
    private int companyId;
    private Timestamp dateInteraction;
    private String interactionType;
    private String pipelineStatus;
    private String teamResponsible;
    private String detailedComments;

    public Interaction() {}

    public Interaction(int interactionId, int companyId, Timestamp dateInteraction,
                       String interactionType, String pipelineStatus,
                       String teamResponsible, String detailedComments) {
        this.interactionId = interactionId;
        this.companyId = companyId;
        this.dateInteraction = dateInteraction;
        this.interactionType = interactionType;
        this.pipelineStatus = pipelineStatus;
        this.teamResponsible = teamResponsible;
        this.detailedComments = detailedComments;
    }

    public Interaction(int companyId, String interactionType, String pipelineStatus,
                       String teamResponsible, String detailedComments) {
        this.companyId = companyId;
        this.interactionType = interactionType;
        this.pipelineStatus = pipelineStatus;
        this.teamResponsible = teamResponsible;
        this.detailedComments = detailedComments;
    }

    public int getInteractionId() {
        return interactionId;
    }

    public void setInteractionId(int interactionId) {
        this.interactionId = interactionId;
    }

    public int getCompanyId() {
        return companyId;
    }

    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    public Timestamp getDateInteraction() {
        return dateInteraction;
    }

    public void setDateInteraction(Timestamp dateInteraction) {
        this.dateInteraction = dateInteraction;
    }

    public String getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(String interactionType) {
        this.interactionType = interactionType;
    }

    public String getPipelineStatus() {
        return pipelineStatus;
    }

    public void setPipelineStatus(String pipelineStatus) {
        this.pipelineStatus = pipelineStatus;
    }

    public String getTeamResponsible() {
        return teamResponsible;
    }

    public void setTeamResponsible(String teamResponsible) {
        this.teamResponsible = teamResponsible;
    }

    public String getDetailedComments() {
        return detailedComments;
    }

    public void setDetailedComments(String detailedComments) {
        this.detailedComments = detailedComments;
    }
}

