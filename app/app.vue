<script setup lang="ts">
const route = useRoute()

const layoutName = computed(() => {
    switch (route.name) {
        case 'inscription':
        case 'connexion':
            return 'auth'
        default:
            return undefined
    }
})

</script>

<template>
    <VApp>
        <VMain>
            <NuxtLayout :name="layoutName">
                <NuxtPage />
            </NuxtLayout>
        </VMain>
    </VApp>
</template>
