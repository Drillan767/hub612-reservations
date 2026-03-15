<template>
    <VContainer class="h-100 d-flex align-center">
        <VRow justify="center">
            <VCol class="d-flex justify-center">
                <VCard width="550">
                    <template #text>
                        <VRow class="mb-4">
                            <VCol class="d-flex justify-center">
                                <VImg
                                    src="~/assets/logo/logo.svg"
                                    alt="Logo"
                                    class="logo"
                                    width="60"
                                />
                            </VCol>
                        </VRow>

                        <NuxtPage />
                    </template>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>

<style scoped>
.logo {
    flex-grow: 0;
}
</style>