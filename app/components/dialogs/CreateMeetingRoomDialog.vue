<script setup lang="ts">
import { usePocketBase } from '~/composable/pocketbase'
import MeetingRoomForm from '~/components/forms/MeetingRoomForm.vue';

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<(e: 'success') => void>()

const { mobile } = useDisplay()
const pb = usePocketBase()

const form = ref<InstanceType<typeof MeetingRoomForm>>()
const loading = ref(false)

const submit = async() => {
    if (!form.value) return

    loading.value = true

    try {
        await pb.collection('meeting_rooms').create({
            name: form.value.values.name,
            is_callbox: form.value.values.isCallbox,
            description: form.value.values.description,
            price: form.value.values.price,
            image: form.value.values.image,
        })
        emit('success')
        close()
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
}

const close = () => {
    form.value?.resetForm()
    open.value = false
}
</script>

<template>
    <VDialog
        v-model="open"
        :fullscreen="mobile"
        max-width="700px"
        scrollable
    >
        <VCard
            prepend-icon="mdi-account-plus"
            title="Nouvel utilisateur"
        >
            <template #text>
                <MeetingRoomForm ref="form" />
            </template>
            <template #actions>
                <VSpacer />
                <VBtn @click="close">
                    Fermer
                </VBtn>
                <Button
                    :disabled="!form?.valid"
                    :loading="loading"
                    text="Enregistrer"
                    append-icon="mdi-plus"
                    small
                    @click="submit"
                />
            </template>
        </VCard>
    </VDialog>
</template>