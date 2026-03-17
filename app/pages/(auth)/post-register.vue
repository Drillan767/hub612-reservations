<script setup lang="ts">
import Button from '~/components/Button.vue';


</script>

<template>
    <h1 class="text-center">
        Inscription prise en compte
    </h1>

    <VRow>
        <VCol>
            <p class="text-center">
                Veuillez vous rapprocher de l'équipe du HUB612
                afin qu'ils puisse valider votre compte.
            </p>
        </VCol>
    </VRow>
    <VRow>
        <VCol class="d-flex flex-column flex-md-row justify-space-around">
            <Button
                text="Connexion"
                append-icon="mdi-login"
                small
                @click="navigateTo('/connexion')"
            />
            <Button
                text="Accueil"
                append-icon="mdi-home"
                small
                @click="navigateTo('/')"
            />
        </VCol>
    </VRow>
</template>