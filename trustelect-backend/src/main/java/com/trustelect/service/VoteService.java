package com.trustelect.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustelect.dto.request.CastVoteRequest;
import com.trustelect.dto.response.CandidateResponse;
import com.trustelect.dto.response.DashboardStatsResponse;
import com.trustelect.dto.response.VoteHistoryResponse;
import com.trustelect.exception.BadRequestException;
import com.trustelect.exception.ResourceNotFoundException;
import com.trustelect.model.Candidate;
import com.trustelect.model.Vote;
import com.trustelect.model.Voter;
import com.trustelect.repository.CandidateRepository;
import com.trustelect.repository.VoteRepository;
import com.trustelect.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final VoterRepository voterRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionService electionService;
    private final VoterService voterService;

    @Transactional
    @SuppressWarnings("null")
    public void castVote(Long voterId, CastVoteRequest request) {
        Voter voter = voterRepository.findById(voterId)
                .orElseThrow(() -> new ResourceNotFoundException("Voter not found"));

        if (!voter.isActive()) {
            throw new BadRequestException("Your account is deactivated");
        }
        if (voter.isHasVoted()) {
            throw new BadRequestException("You have already voted!");
        }

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (!candidate.isActive()) {
            throw new BadRequestException("This candidate is not active");
        }

        // Record vote
        Vote vote = Vote.builder()
                .voterId(voter.getId())
                .voterCode(voter.getVoterId())
                .candidateId(candidate.getId())
                .timestamp(LocalDateTime.now())
                .build();
        voteRepository.save(vote);

        // Update candidate vote count
        candidate.setVotes(candidate.getVotes() + 1);
        candidateRepository.save(candidate);

        // Mark voter as voted
        voter.setHasVoted(true);
        voter.setVotedAt(LocalDateTime.now());
        voter.setVotedFor(candidate.getId());
        voterRepository.save(voter);
    }

    @SuppressWarnings("null")
    public List<VoteHistoryResponse> getVoteHistory() {
        List<Vote> votes = voteRepository.findAllOrderByTimestampDesc();
        return votes.stream().map(v -> {
            String voterName = voterRepository.findById(v.getVoterId())
                    .map(Voter::getName).orElse("Unknown");
            String candidateName = candidateRepository.findById(v.getCandidateId())
                    .map(Candidate::getName).orElse("Unknown");

            return VoteHistoryResponse.builder()
                    .id(v.getId())
                    .voterCode(v.getVoterCode())
                    .voterName(voterName)
                    .candidateId(v.getCandidateId())
                    .candidateName(candidateName)
                    .timestamp(v.getTimestamp())
                    .build();
        }).toList();
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalVoters  = voterService.getTotalVoters();
        long votedCount   = voterService.getVotedCount();
        long totalVotes   = voteRepository.count();

        List<Candidate> candidates = candidateRepository.findAllByOrderByVotesDesc();
        long totalCandVotes = candidates.stream().mapToLong(Candidate::getVotes).sum();

        List<CandidateResponse> candidateResponses = candidates.stream()
                .map(c -> {
                    double pct = totalCandVotes > 0
                            ? (double) c.getVotes() / totalCandVotes * 100 : 0;
                    return CandidateResponse.builder()
                            .id(c.getId()).name(c.getName()).party(c.getParty())
                            .imageUrl(c.getImageUrl()).symbol(c.getSymbol())
                            .votes(c.getVotes()).active(c.isActive())
                            .percentage(Math.round(pct * 10.0) / 10.0)
                            .build();
                }).toList();

        double turnout = totalVoters > 0 ? (double) votedCount / totalVoters * 100 : 0;

        return DashboardStatsResponse.builder()
                .totalVoters(totalVoters)
                .votedCount(votedCount)
                .remainingCount(totalVoters - votedCount)
                .turnoutPercentage(Math.round(turnout * 10.0) / 10.0)
                .totalCandidates(candidates.size())
                .totalVotes(totalVotes)
                .candidates(candidateResponses)
                .election(electionService.getCurrentElection())
                .build();
    }
}
