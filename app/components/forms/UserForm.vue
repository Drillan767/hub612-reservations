<script setup lang="ts">
import type { User } from '~/types/users'
import type { Company } from '~/types/companies'
import { vuetifyConfig } from '~/composable/vuetifyConfig'
import { usePocketBase } from '~/composable/pocketbase'

interface Form {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    company: string
    credits: number
    isAdmin: boolean
    verified: boolean
}

interface Props {
    user?: User
    isEdit?: boolean
}

const props = defineProps<Props>()

const pb = usePocketBase()
const companies = ref<Company[]>([])

const loadCompanies = async () => {
    companies.value = await pb.collection<Company>('companies').getFullList()
}

onMounted(loadCompanies)

const passwordValidation = props.isEdit ? '' : 'required|min:8'
const passwordConfirmValidation = props.isEdit ? '' : 'required|confirmed:@password'

const { defineField, resetForm: resetVeeForm, controlledValues } = useForm<Form>({
    validationSchema: {
        firstName: 'required',
        lastName: 'required',
        email: 'required|email',
        password: passwordValidation,
        passwordConfirm: passwordConfirmValidation,
        credits: 'minValue:0',
    },
    initialValues: {
        firstName: props.user?.first_name ?? '',
        lastName: props.user?.last_name ?? '',
        email: props.user?.email ?? '',
        password: '',
        passwordConfirm: '',
        company: props.user?.company ?? '',
        credits: props.user?.credits ?? 0,
        isAdmin: props.user?.is_admin ?? false,
        verified: props.user?.verified ?? false,
    }
})

const [firstName, firstNameProps] = defineField('firstName', vuetifyConfig)
const [lastName, lastNameProps] = defineField('lastName', vuetifyConfig)
const [email, emailProps] = defineField('email', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)
const [passwordConfirm, passwordConfirmProps] = defineField('passwordConfirm', vuetifyConfig)
const [company, companyProps] = defineField('company', vuetifyConfig)
const [credits, creditsProps] = defineField('credits', vuetifyConfig)
const [isAdmin, isAdminProps] = defineField('isAdmin', vuetifyConfig)
const [verified, verifiedProps] = defineField('verified', vuetifyConfig)

const formValid = useIsFormValid()

const resetForm = () => {
    resetVeeForm()
}

defineExpose({
    resetForm,
    values: controlledValues,
    valid: formValid,
})
</script>

<template>
    <VForm>
        <VContainer>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="firstNameProps"
                        v-model="firstName"
                        label="Prénom"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="lastNameProps"
                        v-model="lastName"
                        label="Nom"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="emailProps"
                        v-model="email"
                        label="Email"
                        type="email"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="passwordProps"
                        v-model="password"
                        :label="isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'"
                        type="password"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="passwordConfirmProps"
                        v-model="passwordConfirm"
                        :label="isEdit ? 'Confirmer le nouveau mot de passe' : 'Confirmer le mot de passe'"
                        type="password"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VAutocomplete
                        v-bind="companyProps"
                        v-model="company"
                        :items="companies"
                        item-title="name"
                        item-value="id"
                        label="Entreprise"
                        clearable
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="12" md="4" class="d-flex align-center">
                    <p class="text-body-1 font-weight-bold">Crédits</p>
                </VCol>
                <VCol cols="12" md="8">
                    <VNumberInput
                        v-bind="creditsProps"
                        v-model="credits"
                        variant="outlined"
                        control-variant="split"
                        :min="0"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VSwitch
                        v-bind="isAdminProps"
                        v-model="isAdmin"
                        label="Administrateur"
                        color="error"
                        hide-details
                    />
                </VCol>
                <VCol v-if="isEdit">
                    <VSwitch
                        v-bind="verifiedProps"
                        v-model="verified"
                        label="Vérifié"
                        color="success"
                        hide-details
                    />
                </VCol>
            </VRow>
        </VContainer>
    </VForm>
</template>
