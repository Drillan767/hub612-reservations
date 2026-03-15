<script setup lang="ts">
import type { Company } from '~/types/companies';
import { vuetifyConfig } from '~/composable/vuetifyConfig';

interface Form {
    name: string
    mensualCredits: number
}

interface Props {
    company?: Company
    currentLogoUrl?: string
}

const props = defineProps<Props>()

const { defineField, resetForm: resetVeeForm, controlledValues } = useForm<Form>({
    validationSchema: {
        name: 'required',
        mensualCredits: 'minValue:0'
    },
    initialValues: {
        mensualCredits: props.company?.mensual_credits ?? 0,
        name: props.company?.name,
    }
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [credits, creditsProps] = defineField('mensualCredits', vuetifyConfig)

const formValid = useIsFormValid()

const newLogo = ref<File | null>(null)
const logoDeleted = ref(false)

const showCurrentLogo = computed(() =>
    !!props.currentLogoUrl && !logoDeleted.value && !newLogo.value
)

// undefined = no change, '' = delete, File = replace
const logoPayload = computed<File | '' | undefined>(() => {
    if (newLogo.value) return newLogo.value
    if (logoDeleted.value) return ''
    return undefined
})

const resetForm = () => {
    resetVeeForm()
    newLogo.value = null
    logoDeleted.value = false
}

defineExpose({
    resetForm,
    values: controlledValues,
    valid: formValid,
    logoPayload,
})
</script>

<template>
    <VForm>
        <VContainer>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="nameProps"
                        v-model="name"
                        label="Nom"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <div v-if="showCurrentLogo" class="d-flex align-center ga-2 mb-2">
                        <VImg
                            :src="currentLogoUrl"
                            max-height="60"
                            max-width="120"
                            cover
                        />
                        <VChip
                            closable
                            @click:close="logoDeleted = true"
                        >
                            Logo actuel
                        </VChip>
                    </div>
                    <VFileInput
                        v-model="newLogo"
                        prepend-icon="mdi-camera"
                        accept="image/*"
                        :label="showCurrentLogo ? 'Remplacer le logo' : 'Logo'"
                        clearable
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol
                    cols="12"
                    md="9"
                >
                   <p class="text-body-large my-1 font-weight-bold">
                        Crédits mensuels
                   </p>
                   <p class="text-body-small my-1">
                        Chaque début de mois, cette somme sera
                        créditée à tous les membres de cette société
                   </p>
                </VCol>
                <VCol
                    cols="12"
                    md="3"
                >
                     <VNumberInput
                        v-bind="creditsProps"
                        v-model="credits"
                        variant="outlined"
                        control-variant="split"
                    />
                </VCol>
            </VRow>
        </VContainer>
    </VForm>
</template>
