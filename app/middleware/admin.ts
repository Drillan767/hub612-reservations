import { usePocketBase } from '~/composable/pocketbase'

export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return

    const pb = usePocketBase()

    if (!pb.authStore.isValid || !(pb.authStore.record as Record<string, unknown>)?.is_admin) {
        return navigateTo('/')
    }
})
