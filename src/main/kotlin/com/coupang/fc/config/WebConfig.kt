package com.coupang.fc.config

import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry
            .addMapping("/**")
            .allowedOrigins("http://localhost:3000", "http://localhost")
            .allowedMethods("*")
    }

    @Bean
    fun webServerFactoryCustomizer() = WebServerFactoryCustomizer {
            factory: ConfigurableServletWebServerFactory -> factory.setContextPath("/api")
    }
}