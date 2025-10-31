package org.veterinario.project

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform