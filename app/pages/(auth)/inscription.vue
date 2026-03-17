<script setup lang="ts">
import { vuetifyConfig } from '~/composable/vuetifyConfig'
import Button from '~/components/Button.vue'
import { usePocketBase } from '~/composable/pocketbase'

interface Form {
    email: string
    firstName: string
    lastName: string
    password: string
    passwordRepeat: string
}

const { defineField, handleSubmit } = useForm<Form>({
    validationSchema: {
        email: 'required|email',
        firstName: 'required',
        lastName: 'required',
        password: 'required|min:8',
        passwordRepeat: 'required|confirmed:@password',
    }
})

const pb = usePocketBase()

const loading = ref(false)

const [firstName, fnProps] = defineField('firstName', vuetifyConfig)
const [lastName, lnProps] = defineField('lastName', vuetifyConfig)
const [email, emailProps] = defineField('email', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)
const [pr, prProps] = defineField('passwordRepeat', vuetifyConfig)

const formValid = useIsFormValid()

const register = handleSubmit(async(form) => {
    loading.value = true

    try {
        await pb.collection('users').create({
            email: form.email,
            first_name: form.firstName,
            last_name: form.lastName,
            credits: 0,
            is_admin: false,
            is_enabled: false,
            password: form.password,
            passwordConfirm: form.passwordRepeat,
            emailVisibility: true,
        })

        navigateTo('/post-register')
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
})

</script>

<template>
    <h1 class="text-center">
        Inscription
    </h1>
    <VForm>
        <VRow>
            <VCol
                cols="12"
                md="6"
            >
                <VTextField
                    v-bind="fnProps"
                    v-model="firstName"
                    label="Prénom"
                />
            </VCol>
            <VCol
                cols="12"
                md="6"
            >
                <VTextField
                    v-bind="lnProps"
                    v-model="lastName"
                    label="Nom de famille"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <VTextField
                    v-bind="emailProps"
                    v-model="email"
                    label="Adresse email"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol
                cols="12"
                md="6"
            >
                <VTextField
                    v-bind="passwordProps"
                    v-model="password"
                    label="Mot de passe"
                    type="password"
                />
            </VCol>
            <VCol
                cols="12"
                md="6"
            >
                <VTextField
                    v-bind="prProps"
                    v-model="pr"
                    label="Répéter le mot de passe"
                    type="password"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol class="d-flex justify-space-between align-center">
                <span>
                    Vous avez déjà un compte ?<br />
                    <NuxtLink to="/connexion">
                        Connexion
                    </NuxtLink>
                </span>

                <Button
                    text="Inscription"
                    :loading="loading"
                    :disabled="!formValid || loading"
                    @click="register"
                />
            </VCol>
        </VRow>
    </VForm>
</template>