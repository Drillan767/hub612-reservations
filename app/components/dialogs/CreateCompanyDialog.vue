<script setup lang="ts">
import { usePocketBase } from '~/composable/pocketbase';
import CompanyForm from '~/components/forms/CompanyForm.vue';

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<(e: 'success') => void>()

const { mobile } = useDisplay()
const pb = usePocketBase()

const form = ref<InstanceType<typeof CompanyForm>>()
const loading = ref(false)

const submit = async() => {
    if (!form.value) return

    loading.value = true

    try {
        const fields = form.value?.values
        pb.collection('companies').create({
            name: fields.name,
            logo: form.value.loadPayload,
            mensual_credits: fields.mensualCredits,
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
            prepend-icon="mdi-domain-plus"
            title="Nouvelle société"
        >
            <template #text>
                <CompanyForm ref="form" />
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    @click="close"
                >
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