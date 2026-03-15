<script setup lang="ts">
interface Props {
    text: string
    appendIcon?: string
    disabled?: boolean
    loading?: boolean
    small?: boolean
}

const {
    text,
    appendIcon = 'mdi-arrow-right',
    loading = false,
    disabled = false,
    small = false,
} = defineProps<Props>()

const emit = defineEmits<(e: 'click') => void>()
</script>

<template>
    <div
        :class="{ 'disabled': disabled, 'loading': loading, 'small': small }"
        class="button"
        @click="emit('click')"
    >
        <div class="left">
            <VProgressCircular
                v-if="loading"
                size="20"
                indeterminate
            />

            <template v-else>
                {{ text }}
            </template>
        </div>

        <div class="right">
            <VIcon :icon="appendIcon" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .button {
        display: flex;
        gap: 0;
        transition: all 0.3s ease;
        justify-content: center;

        &:hover {
            gap: 0.25rem;
        }

        &.disabled {
            pointer-events: none;
            opacity: 0.5;
        }

        &.small {
            .left, .right {
                padding: 0.5rem 0.4rem;
            }
        }

        &.loading .left {
            display: flex;
            justify-content: center;
            width: 120px;
        }

        .left {
            text-transform: uppercase;
            font-family: 'DM Mono', monospace;
            letter-spacing: -0.28px;
            font-weight: bold;
        }

        .left, .right {
            background-color: rgb(235, 29, 58);
            color: rgb(242, 228, 225);
            border-radius: .5rem;
            padding: 1.22rem 1rem;
            cursor: pointer;
        }
    }
</style>