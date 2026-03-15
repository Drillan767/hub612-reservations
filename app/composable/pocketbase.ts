import type { TypedPocketBase } from '~/types/pocketbase-types'
import Pocketbase from 'pocketbase'

let pb: TypedPocketBase | null = null

export const usePocketBase = (): TypedPocketBase => {
    if (!pb) {
        const config = useRuntimeConfig()
        pb = new Pocketbase(config.public.pocketbase.url) as TypedPocketBase
    }
    return pb
}
