package com.coupang.fc.common

import mu.KLogging

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val body: T?
) {
    companion object : KLogging() {
        fun <T> run(block: () -> T): ApiResponse<T> =
            try {
                ApiResponse(true, "", block.invoke())
            } catch (e: ExpectedCaseException) {
                ApiResponse(false, e.message!!, null)
            } catch (e: Exception) {
                logger.error(e.message, e)
                ApiResponse(false, "Internal Server Error", null)
            }
    }
}