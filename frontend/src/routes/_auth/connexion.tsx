import { createFileRoute } from '@tanstack/react-router'

const Connexion = () => (
    <div>
        <p>Login page</p>
    </div>
)

export const Route = createFileRoute('/_auth/connexion')({
    component: Connexion,
})