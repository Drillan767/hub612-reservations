<script setup lang="ts">
import useAuth from '~/composable/auth'
import { usePocketBase } from '~/composable/pocketbase'

const pb = usePocketBase()
const auth = useAuth()


const avatar = computed(() => {
    if (!auth.user.value?.avatar) return undefined

    return `http://localhost:8090/api/files/users/${auth.user.value.id}/${auth.user.value.avatar}`
})

const logout = () => {
    pb.authStore.clear()
    navigateTo('/')
}
</script>

<template>
    <VMenu>
        <template #activator="{ props: menu }">
            <VBtn
                v-bind="menu"
                icon
            >
                <VAvatar
                    v-if="avatar"
                    :image="avatar"
                />
                <VIcon
                    v-else
                    icon="mdi-account"
                    color="red"
                />
            </VBtn>
        </template>
        <VList v-if="auth.user.value">
            <VListItem
                :prepend-avatar="avatar"
                :title="`${auth.user.value.first_name} ${auth.user.value.last_name}`"
                :subtitle="auth.user.value.email"
            />
            <VListItem
                v-if="auth.user.value.company !== ''"
                :title="auth.user.value.company"
                prepend-icon="mdi-domain"
            />
            <VListItem
                v-if="auth.user.value.is_admin"
                title="Administration"
                to="/administration"
            >
                <template #prepend>
                    <VIcon
                        icon="mdi-security"
                        color="#eb1d3a"
                    />
                </template>
            </VListItem>
            <VListItem
                prepend-icon="mdi-circle-multiple-outline"
            >
                <template #title>
                    <b>{{ auth.user.value.credits }}</b> crédits restants
                </template>
            </VListItem>
            <VDivider />
            <VListItem
                prepend-icon="mdi-logout"
                title="Déconnexion"
                @click="logout"
            />

        </VList>
    </VMenu>
</template>