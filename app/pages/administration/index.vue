<script setup lang="ts">
import { usePocketBase } from '~/composable/pocketbase'

definePageMeta({ middleware: 'admin' })

const pb = usePocketBase()

const total = ref(0)

const fetch = async() => {
    const result = await pb.collection('users').getList(0, -1, {
        filter: 'verified = false',
    })

    total.value = result.totalItems
}

onMounted(fetch)
</script>

<template>
    <h1>
        Administration
    </h1>

    <VContainer>
        <VRow>
            <VCol
                cols="12"
                md="4"
            >
                <VBadge
                    :model-value="total > 0"
                    :content="total"
                    color="red"
                    max="9"
                >
                    <VCard
                        prepend-icon="mdi-account-group"
                        title="Gérer les utilisateurs"
                        to="/administration/utilisateurs"
                        text="Validez et gérez les utilisateurs, et assignez les à leur entreprise"
                    />
                </VBadge>
            </VCol>
            <VCol
                cols="12"
                md="4"
            >
                <VCard
                    prepend-icon="mdi-domain"
                    title="Gérer les entreprises"
                    to="/administration/entreprises"
                    text="Gérez les entreprises et assignez leur nombre de crédits par mois"
                />
            </VCol>
            <VCol
                cols="12"
                md="4"
            >
                <VCard
                    prepend-icon="mdi-television"
                    title="Salles de réunion"
                    to="/administration/salles-de-reunion"
                    text="Gérez les salles de réunion, leur apparence et leur tarif"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>