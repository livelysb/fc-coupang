package com.coupang.fc.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MatchRepository : JpaRepository<Match, Long> {
    fun findTop20ByMatchIdLessThanOrderByMatchIdDesc(lastMatchId: Long): List<Match>
}