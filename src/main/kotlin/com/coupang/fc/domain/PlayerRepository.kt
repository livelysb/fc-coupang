package com.coupang.fc.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayerRepository : JpaRepository<Player, Long> {
    fun existsByNameAndNickname(name: String, nickname: String): Boolean
}