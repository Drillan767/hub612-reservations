<script setup lang="ts">
import type { Company } from '~/types/companies';
import { usePocketBase } from '~/composable/pocketbase';
import CompanyForm from '~/components/forms/CompanyForm.vue';

interface Props {
    company: Company
}

const props = defineProps<Props>()

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<(e: 'success') => void>()

const { mobile } = useDisplay()
const pb = usePocketBase()

const form = ref<InstanceType<typeof CompanyForm>>()
const loading = ref(false)

const currentLogoUrl = computed(() =>
    props.company.logo
        ? pb.files.getURL(props.company, props.company.logo)
        : undefined
)

const close = () => {
    form.value?.resetForm()
    open.value = false
}

const submit = async () => {
    if (!form.value) return
    loading.value = true
    try {
        const { name, mensualCredits } = form.value.values
        const data: Record<string, unknown> = {
            name,
            mensual_credits: mensualCredits,
        }

        const logoPayload = form.value.logoPayload
        if (logoPayload !== undefined) {
            data.field = logoPayload
        }

        await pb.collection('companies').update(props.company.id, data)
        emit('success')
        close()
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <VDialog
        v-model="open"
        :fullscreen="mobile"
        max-width="960px"
        scrollable
    >
         <VCard
            :title="`Éditer ${company.name}`"
            prepend-icon="mdi-domain"
        >
            <template #text>
                <CompanyForm
                    ref="form"
                    :company="company"
                    :current-logo-url="currentLogoUrl"
                />
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
                    append-icon="mdi-pencil"
                    small
                    @click="submit"
                />
            </template>
        </VCard>
    </VDialog>
</template>
