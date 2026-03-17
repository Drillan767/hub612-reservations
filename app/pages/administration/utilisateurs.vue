<script setup lang="ts">
import type { User } from '~/types/users'
import { usePocketBase } from '~/composable/pocketbase'

const pb = usePocketBase()
const dayjs = useDayjs()
const config = useRuntimeConfig()

const users = ref<User[]>([])
const loading = ref(false)
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showDeleteDialog = ref(false)

const fetch = async() => {
    loading.value = true

    try {
        users.value = await pb.collection<User>('users').getFullList()
    } catch (e) {

    } finally {
        loading.value = false
    }
}

const headers = [
    {
        key: 'avatar',
        title: ''
    },
    {
        key: 'full_name',
        title: 'Nom complet',
    },
    {
        key: 'email',
        title: 'Email',
    },
    {
        key: 'credits',
        title: 'Crédits',
    },
    {
        key: 'company',
        title: 'Entreprise',
    },
    {
        key: 'updated',
        title: 'Date de mise à jour',
    },
    {
        key: 'actions',
        title: 'Actions',
        align: 'end' as const,
    }
]

onMounted(fetch)

</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex align-center ga-4">
                <VBtn
                    icon="mdi-arrow-left"
                    to="/administration"
                />
                <h1>
                    utilisateurs
                </h1>
            </VCol>
            <VCol class="d-flex justify-end align-center">
                <Button
                    text="Nouvel utilisateur"
                    append-icon="mdi-account-plus"
                    @click="showCreateForm = true"
                />
            </VCol>
        </VRow>
        <VDataTable
            :loading
            :headers
            :items="users"
        >
            <template #item.avatar="{ item }">
                <VBadge
                    color="transparent"
                    :offset-x="5"
                    :offset-y="5"
                >
                    <template #badge>
                        <template v-if="item.verified">
                            <VIcon
                                v-if="item.is_admin"
                                icon="mdi-security"
                                color="red"
                            />
                            <VIcon
                                v-else
                                icon="mdi-check-circle"
                                color="success"
                            />
                        </template>
                        <VIcon
                            v-else
                            icon="mdi-alert-circle-outline"
                            color="warning"
                        />
                    </template>

                    <template #default>
                        <VAvatar
                            :icon="item.avatar ? undefined : 'mdi-account'"
                            :image="item.avatar ?? undefined"
                        />
                    </template>
                </VBadge>
            </template>
            <template #item.full_name="{ item }">
                {{ `${item.first_name} ${item.last_name}` }}
            </template>
            <template #item.credits="{ item }">
                <VChip
                    :text="item.credits"
                    append-icon="mdi-circle-multiple-outline"
                />
            </template>
            <template #item.updated="{ item }">
                {{ dayjs(item.updated).format('DD/MM/YYYY à HH:mm') }}
            </template>
        </VDataTable>
    </VContainer>
</template>