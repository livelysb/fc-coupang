package com.coupang.fc.controller

import com.coupang.fc.common.ApiResponse
import com.coupang.fc.data.PlayerCreateRequest
import com.coupang.fc.data.PlayerDto
import com.coupang.fc.application.PlayerService
import com.coupang.fc.data.TodayPlayerDto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class PlayerController(
    private val playerService: PlayerService
) {

    @GetMapping("/all-players")
    fun getAllPlayers(): ApiResponse<List<PlayerDto>> = ApiResponse.run { playerService.getAllPlayers() }

    @PostMapping("/today-players")
    fun putTodayPlayers(@RequestBody todayPlayerList: List<TodayPlayerDto>) =
        ApiResponse.run { playerService.putTodayPlayers(todayPlayerList) }

    @GetMapping("/today-players")
    fun getTodayPlayers(): ApiResponse<List<TodayPlayerDto>> = ApiResponse.run { playerService.getTodayPlayers() }

    @PostMapping("/player")
    fun createPlayer(@RequestBody request: PlayerCreateRequest): ApiResponse<Unit> =
        ApiResponse.run { playerService.createPlayer(request) }
}
