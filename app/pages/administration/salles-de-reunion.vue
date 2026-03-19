<script setup lang="ts">
import type { MeetingRoom } from '~/types/meeting-room'
import { usePocketBase } from '~/composable/pocketbase'
import CreateUserDialog from '~/components/dialogs/CreateUserDialog.vue'
import EditUserDialog from '~/components/dialogs/EditUserDialog.vue'


definePageMeta({ middleware: 'admin' })

const pb = usePocketBase()
const dayjs = useDayjs()
const config = useRuntimeConfig()

const rooms = ref<MeetingRoom[]>([])
const selectedRoom = ref<MeetingRoom>()
const loading = ref(false)
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showDeleteDialog = ref(false)

const fetch = async () => {
    loading.value = true

    try {
        rooms.value = await pb.collection<MeetingRoom>('meeting_rooms').getFullList({
            expand: 'company',
        })
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex align-center ga-4">
                <VBtn
                    icon="mdi-arrow-left"
                    to="/administration"
                />
                <h1>Salles de réunion</h1>
            </VCol>
            <VCol class="d-flex justify-end align-center">
                <Button
                    text="Nouvel utilisateur"
                    append-icon="mdi-account-plus"
                    @click="showCreateForm = true"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>