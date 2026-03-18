<script setup lang="ts">
import { usePocketBase } from '~/composable/pocketbase'
import UserForm from '~/components/forms/UserForm.vue'

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<(e: 'success') => void>()

const { mobile } = useDisplay()
const pb = usePocketBase()

const form = ref<InstanceType<typeof UserForm>>()
const loading = ref(false)

const submit = async () => {
    if (!form.value) return

    loading.value = true

    try {
        const values = form.value.values
        await pb.collection('users').create({
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
            passwordConfirm: values.passwordConfirm,
            company: values.company || null,
            credits: values.credits,
            is_admin: values.isAdmin,
            verified: true,
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
                <UserForm ref="form" />
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
