package com.coupang.fc.controller

import com.coupang.fc.application.MatchService
import com.coupang.fc.common.ApiResponse
import com.coupang.fc.data.GoalRequest
import com.coupang.fc.data.MatchCreateRequest
import com.coupang.fc.data.MatchDto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class MatchController(
    private val matchService: MatchService
) {

    @PostMapping("/match")
    fun createMatch(@RequestBody request: MatchCreateRequest) =
        ApiResponse.run { matchService.createMatch(request) }

    @GetMapping("/match")
    fun getMatch(matchId: Long): ApiResponse<MatchDto> =
        ApiResponse.run { matchService.getMatch(matchId) }

    @PostMapping("/goal")
    fun saveGoal(@RequestBody request: GoalRequest) = ApiResponse.run { matchService.saveGoal(request) }

    @PostMapping("/match/end")
    fun endMatch(matchId: Long) = ApiResponse.run { matchService.endMatch(matchId) }

    @PostMapping("/match/cancel")
    fun cancelMatch(matchId: Long) = ApiResponse.run { matchService.cancelMatch(matchId) }

    @GetMapping("/matches/recent")
    fun getRecentMatches(lastMatchId: Long?) =
        ApiResponse.run { matchService.getRecentMatches(lastMatchId ?: Long.MAX_VALUE) }

}