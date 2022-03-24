package com.coupang.fc.application

import com.coupang.fc.common.ExpectedCaseException
import com.coupang.fc.data.PlayerCreateRequest
import com.coupang.fc.data.PlayerDto
import com.coupang.fc.domain.Player
import com.coupang.fc.domain.PlayerRepository
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit


@Service
class PlayerService(
    private val playerRepository: PlayerRepository,
    private val stringRedisTemplate: StringRedisTemplate,
) {
    companion object {
        const val TODAY_PLAYERS = "TODAY_PLAYERS"
    }

    fun getAllPlayers() = playerRepository.findAll().map { it.toDto() }.sortedBy { it.name }

    fun createPlayer(request: PlayerCreateRequest) {
        if (playerRepository.existsByNameAndNickname(request.name, request.nickname)) {
            throw ExpectedCaseException("이미 존재하는 선수입니다.")
        }
        playerRepository.save(Player(request))
    }

    fun putTodayPlayers(playerIdList: List<Long>) {
        stringRedisTemplate.opsForValue().set(TODAY_PLAYERS, Gson().toJson(playerIdList), 1, TimeUnit.DAYS)
    }

    fun getTodayPlayers(): List<PlayerDto> {
        val todayPlayersId: List<Long> = stringRedisTemplate.opsForValue().get(TODAY_PLAYERS)?.let {
            Gson().fromJson(it, object : TypeToken<ArrayList<Long>>() {}.type)
        } ?: emptyList()

        return playerRepository.findAllById(todayPlayersId).map{ it.toDto() }.sortedBy { it.name }
    }


}