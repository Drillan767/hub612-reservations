<script setup lang="ts">
import type { MeetingRoom } from '~/types/meeting-room'
import { vuetifyConfig } from '~/composable/vuetifyConfig'
import { usePocketBase } from '~/composable/pocketbase'

interface Props {
    room?: MeetingRoom
}

interface Form {
    name: string
    image: File
    isCallbox: boolean
    description: string
    price: number
}

const props = defineProps<Props>()
const pb = usePocketBase()

const { defineField, resetForm, controlledValues } = useForm<Form>({
    validationSchema: {
        name: 'required',
        price: 'required|min:1',
        image: props.room ? 'image' : 'required|image',
    },
    initialValues: {
        name: props.room?.name ?? '',
        price: props.room?.price ?? 0,
        description: props.room?.description ?? '',
        isCallbox: props.room?.is_callbox ?? false,
    }
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [price, priceProps] = defineField('price', vuetifyConfig)
const [image, imageProps] = defineField('image', vuetifyConfig)
const [cb, cbProps] = defineField('isCallbox', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)

const formValid = useIsFormValid()

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
                <VCol
                    cols="12"
                    md="6"
                >
                     <VTextField
                        v-bind="nameProps"
                        v-model="name"
                        label="Nom"
                    />
                </VCol>
                <VCol
                    cols="12"
                    md="6"
                >
                     <VTextField
                        v-bind="priceProps"
                        v-model="price"
                        label="Prix"
                        type="number"
                        min="1"
                        step="1"
                        append-inner-icon="mdi-circle-multiple-outline"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol
                    cols="12"
                    md="6"
                >

                </VCol>
            </VRow>
        </VContainer>
    </VForm>
</template>