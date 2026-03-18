<script setup lang="ts">
import type { Company } from '~/types/companies';

definePageMeta({ middleware: 'admin' })
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
const showDeleteDialog = ref(false)

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

const showDelete = (c: Company) => {
    selectedCompany.value = c
    showDeleteDialog.value = true
};

const deleteCompany = async() => {
    if (!selectedCompany.value) return
    loading.value = true

    try {
        await pb.collection('companies').delete(selectedCompany.value.id)
        selectedCompany.value = undefined
        showDeleteDialog.value = false
        await fetch()
    } catch (e) {
        console.log({ e })
    } finally {
        loading.value = false
    }
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
            :loading
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
                    @click="showDelete(item)"
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
    <VDialog
        v-if="selectedCompany"
        v-model="showDeleteDialog"
        width="600"
    >
        <VCard
            :title="`Supprimer ${selectedCompany.name} ?`"
        >
            <template #text>
                Cette est irréversible, et tous les utilisateurs liés à cette société
                se retrouveront marqués comme appartenant à aucune société. <br />
                Continuer ?
            </template>

            <template #actions>
                <VSpacer />
                <VBtn
                    class="mr-1"
                    @click="showDeleteDialog = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="error"
                    @click="deleteCompany"
                >
                    Supprimer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>