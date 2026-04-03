package com.trustelect.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalVoters;
    private long votedCount;
    private long remainingCount;
    private double turnoutPercentage;
    private long totalCandidates;
    private long totalVotes;
    private List<CandidateResponse> candidates;
    private ElectionResponse election;
}
