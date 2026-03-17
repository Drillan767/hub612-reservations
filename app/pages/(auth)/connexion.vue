<script setup lang="ts">
import { vuetifyConfig } from '~/composable/vuetifyConfig'
import Button from '~/components/Button.vue'
import { usePocketBase } from '~/composable/pocketbase'

interface Form {
    email: string
    password: string
}

const { defineField, handleSubmit, setErrors } = useForm<Form>({
    validationSchema: {
        email: 'required|email',
        password: 'required',
    }
})

const pb = usePocketBase()

const loading = ref(false)

const [email, emailProps] = defineField('email', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)

const formValid = useIsFormValid()

const login = handleSubmit(async (form) => {
    loading.value = true

    try {
        await pb.collection('users').authWithPassword(form.email, form.password)
        navigateTo('/')
    } catch (e) {
        if (e.response.status === 403) {
            setErrors({ password: 'Votre compte n\'est pas actif' })
        } else {
            setErrors({ password: 'Identifiant / Mot de passe incorrect' })
        }

    } finally {
        loading.value = false
    }
})
</script>

<template>
<h1 class="text-center">
        Connexion
    </h1>
    <VForm>
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
            <VCol>
                <VTextField
                    v-bind="passwordProps"
                    v-model="password"
                    label="Mot de passe"
                    type="password"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol class="d-flex justify-space-between align-center">
                <span>
                    Pas encore inscrit ?<br />
                    <NuxtLink to="/inscription">
                        Créer un compte
                    </NuxtLink>
                </span>

                <Button
                    text="Connexion"
                    :loading="loading"
                    :disabled="!formValid || loading"
                    @click="login"
                />
            </VCol>
        </VRow>
    </VForm>
</template>