<script setup lang="ts">
import useAuth from '~/composable/auth'
const auth = useAuth()
</script>

<template>
    <VAppBar
        title="Réservations"
        class="px-4"
    >
        <template #prepend>
            <NuxtLink to="/">
                <VImg
                    src="~/assets/logo/logo.svg"
                    alt="Logo"
                    class="logo"
                    width="60"
                />

            </NuxtLink>
        </template>
        <template #append>
            <UserMenu v-if="auth.isAuthenticated.value" />
            <VBtn
                v-else
                color="red"
                icon="mdi-account"
                to="/connexion"
            />
        </template>
    </VAppBar>

    <VContainer>
        <NuxtPage />
    </VContainer>
</template>