<script setup lang="ts">
import type { Company } from '~/types/companies';
import { usePocketBase } from '~/composable/pocketbase';
import CreateCompanyDialog from '~/components/dialogs/CreateCompanyDialog.vue';
import EditCompanyDialog from '~/components/dialogs/EditCompanyDialog.vue';

const pb = usePocketBase()
const dayjs = useDayjs()
const config = useRuntimeConfig()

const companies = ref<Company[]>([])
const selectedCompany = ref<Company>()
const loading = ref(false)
const showCreateForm = ref(false)
const showEditForm = ref(false)

const fetch = async() => {
    loading.value = true

    try {
        companies.value = await pb.collection<Company>('companies').getFullList()
    } catch (e) {

    } finally {
        loading.value = false
    }
}

const edit = (c: Company) => {
    selectedCompany.value = c
    showEditForm.value = true
}

const getThumbnail = (c: Company) => {
    if (c.logo === '') return ''
    return `${config.public.pocketbase.url}/api/files/companies/${c.id}/${c.logo}?thumb=50x50`
}

const headers = [
    {
        key: 'name',
        title: 'Nom',
    },
    {
        key: 'logo',
        title: 'Logo',
    },
    {
        key: 'mensual_credits',
        title: 'Crédits mensuels',
        align: 'end' as const,
    },
    {
        key: 'updated',
        title: 'Date de mise à jour',
    },
    {
        key: 'actions',
        title: 'Actions',
        align: 'end' as const,
    }
]

onMounted(fetch)

</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex align-center ga-4">
                <VBtn
                    icon="mdi-arrow-left"
                    to="/administration"
                />
                <h1>
                    Entreprises
                </h1>
            </VCol>
            <VCol class="d-flex justify-end align-center">
                <Button
                    text="Nouvelle entreprise"
                    append-icon="mdi-plus"
                    @click="showCreateForm = true"
                />
            </VCol>
        </VRow>

        <VDataTable
            :headers
            :items="companies"
        >
            <template #item.mensual_credits="{ item }">
                <VChip
                    :text="item.mensual_credits"
                    append-icon="mdi-circle-multiple-outline"
                />
            </template>
            <template #item.logo="{ item }">
                <VImg
                    :src="getThumbnail(item)"
                    height="50"
                    width="50"
                    rounded="sm"
                />
            </template>
            <template #item.updated="{ item }">
                {{ dayjs(item.updated).format('DD/MM/YYYY à HH:mm') }}
            </template>
            <template #item.actions="{ item }">
                <VBtn
                    color="info"
                    icon="mdi-pencil"
                    size="small"
                    class="mr-1"
                    @click="edit(item)"
                />
                <VBtn
                    color="error"
                    icon="mdi-trash-can-outline"
                    size="small"
                />
            </template>
        </VDataTable>
        <CreateCompanyDialog
            v-model="showCreateForm"
            @success="fetch"
        />
        <EditCompanyDialog
            v-if="selectedCompany"
            v-model="showEditForm"
            :company="selectedCompany"
            @success="fetch"
        />
    </VContainer>
</template>