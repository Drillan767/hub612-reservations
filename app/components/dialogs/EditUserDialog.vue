<script setup lang="ts">
import type { User } from '~/types/users'
import { usePocketBase } from '~/composable/pocketbase'
import UserForm from '~/components/forms/UserForm.vue'

interface Props {
    user: User
}

const props = defineProps<Props>()

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<(e: 'success') => void>()

const { mobile } = useDisplay()
const pb = usePocketBase()

const form = ref<InstanceType<typeof UserForm>>()
const loading = ref(false)

const close = () => {
    form.value?.resetForm()
    open.value = false
}

const submit = async () => {
    if (!form.value) return

    loading.value = true

    try {
        const values = form.value.values
        const data: Record<string, unknown> = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            company: values.company || null,
            credits: values.credits,
            is_admin: values.isAdmin,
            verified: values.verified,
        }

        if (values.password) {
            data.password = values.password
            data.passwordConfirm = values.passwordConfirm
        }

        await pb.collection('users').update(props.user.id, data)
        emit('success')
        close()
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
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
            :title="`Éditer ${user.first_name} ${user.last_name}`"
            prepend-icon="mdi-account-edit"
        >
            <template #text>
                <UserForm ref="form" :user="user" is-edit />
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
                    append-icon="mdi-pencil"
                    small
                    @click="submit"
                />
            </template>
        </VCard>
    </VDialog>
</template>
