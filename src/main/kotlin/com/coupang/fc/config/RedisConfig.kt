package com.coupang.fc.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisStandaloneConfiguration
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
import org.springframework.data.redis.core.StringRedisTemplate


@Configuration
class RedisConfig(
    @Value("\${spring.redis.url}")
    val redisUrl: String
) {
    @Bean
    fun redisConnectionFactory(): LettuceConnectionFactory? {
        return LettuceConnectionFactory(RedisStandaloneConfiguration(redisUrl, 6379))
    }

    @Bean
    fun stringRedisTemplate(): StringRedisTemplate {
        return StringRedisTemplate(redisConnectionFactory()!!)
    }
}