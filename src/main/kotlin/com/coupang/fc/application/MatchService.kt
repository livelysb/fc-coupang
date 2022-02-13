package com.coupang.fc.application

import com.coupang.fc.common.ExpectedCaseException
import com.coupang.fc.data.GoalRequest
import com.coupang.fc.data.MatchCreateRequest
import com.coupang.fc.domain.Match
import com.coupang.fc.domain.MatchRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MatchService(
    private val matchRepository: MatchRepository
) {

    @Transactional
    fun createMatch(request: MatchCreateRequest): Long = matchRepository.save(Match(request)).id!!

    @Transactional(readOnly = true)
    fun getMatch(matchId: Long) =
        matchRepository.findByIdOrNull(matchId)?.toDto() ?: throw ExpectedCaseException("경기가 존재하지 않습니다.")

    @Transactional
    fun saveGoal(request: GoalRequest) {
        matchRepository.findByIdOrNull(request.matchId)?.apply {
            this.saveGoal(request)
        } ?: throw ExpectedCaseException("경기가 존재하지 않습니다.")
    }

    @Transactional
    fun endMatch(matchId: Long) {
        matchRepository.findByIdOrNull(matchId)?.apply {
            end()
        } ?: throw ExpectedCaseException("경기가 존재하지 않습니다.")
    }

    @Transactional
    fun cancelMatch(matchId: Long) {
        matchRepository.findByIdOrNull(matchId)?.apply {
            delete()
        } ?: throw ExpectedCaseException("경기가 존재하지 않습니다.")
    }
}
