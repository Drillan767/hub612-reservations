import type { User } from '~/types/users'
import { usePocketBase } from "./pocketbase"


const isAuthenticated = ref(false)
const user = ref<null | User>(null)
let initialized = false

export default function() {
    const pb = usePocketBase()

    if (!initialized) {
        isAuthenticated.value = pb.authStore.isValid
        user.value = pb.authStore.record

        pb.authStore.onChange(() => {
            isAuthenticated.value = pb.authStore.isValid
            user.value = pb.authStore.record
        })

        initialized = true
    }

    return { isAuthenticated, user }
}
