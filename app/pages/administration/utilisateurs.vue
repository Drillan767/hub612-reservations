<script setup lang="ts">
import type { User } from '~/types/users'
import { usePocketBase } from '~/composable/pocketbase'
import CreateUserDialog from '~/components/dialogs/CreateUserDialog.vue'
import EditUserDialog from '~/components/dialogs/EditUserDialog.vue'

definePageMeta({ middleware: 'admin' })

const pb = usePocketBase()
const dayjs = useDayjs()
const config = useRuntimeConfig()

const users = ref<User[]>([])
const selectedUser = ref<User>()
const loading = ref(false)
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showDeleteDialog = ref(false)

const fetch = async () => {
    loading.value = true

    try {
        users.value = await pb.collection<User>('users').getFullList({
            expand: 'company',
        })
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
}

const edit = (u: User) => {
    selectedUser.value = u
    showEditForm.value = true
}

const showDelete = (u: User) => {
    selectedUser.value = u
    showDeleteDialog.value = true
}

const deleteUser = async () => {
    if (!selectedUser.value) return
    loading.value = true

    try {
        await pb.collection('users').delete(selectedUser.value.id)
        selectedUser.value = undefined
        showDeleteDialog.value = false
        await fetch()
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
}

const getAvatarUrl = (u: User) => {
    if (!u.avatar) return undefined
    return `${config.public.pocketbase.url}/api/files/users/${u.id}/${u.avatar}?thumb=50x50`
}

const headers = [
    {
        key: 'avatar',
        title: '',
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
                <h1>Utilisateurs</h1>
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
                            :image="getAvatarUrl(item)"
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
            <template #item.company="{ item }">
                {{ (item as any).expand?.company?.name ?? '-' }}
            </template>
            <template #item.updated="{ item }">
                {{ dayjs(item.updated).format('DD/MM/YYYY à HH:mm') }}
            </template>
            <template #item.actions="{ item }">
                <VBtn
                    color="info"
                    icon="mdi-pencil"
                    size="small"
                    class="mr-1"
                    @click="edit(item)"
                />
                <VBtn
                    color="error"
                    icon="mdi-trash-can-outline"
                    size="small"
                    @click="showDelete(item)"
                />
            </template>
        </VDataTable>

        <CreateUserDialog
            v-model="showCreateForm"
            @success="fetch"
        />
        <EditUserDialog
            v-if="selectedUser"
            v-model="showEditForm"
            :user="selectedUser"
            @success="fetch"
        />
    </VContainer>

    <VDialog
        v-if="selectedUser"
        v-model="showDeleteDialog"
        width="600"
    >
        <VCard
            :title="`Supprimer ${selectedUser.first_name} ${selectedUser.last_name} ?`"
        >
            <template #text>
                Cette action est irréversible. L'utilisateur sera définitivement supprimé.<br />
                Continuer ?
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    class="mr-1"
                    @click="showDeleteDialog = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="error"
                    :loading="loading"
                    @click="deleteUser"
                >
                    Supprimer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
