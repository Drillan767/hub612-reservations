import { defineRule, configure } from 'vee-validate'
import { email, required, confirmed, min, max, min_value, max_value } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';

export default defineNuxtPlugin(() => {
    configure({
        generateMessage: localize({
            fr: {
                messages: {
                    ...fr.messages,
                    required: 'Le champ est requis',
                    email: 'Le champ doit être une adresse e-mail valide',
                    size: 'Fichier trop volumineux',
                    image: 'Le fichier doit être une image',
                    confirmed: 'Les mots de passe doivent correspondre',
                    ext: 'Format de fichier non supporté',
                    min: 'Le champ doit avoir 0:{length} caractères ou plus',
                    max: 'Le champ ne doit pas dépasser 0:{length} caractères',
                    minValue: 'La valeur du champ doit excéder 0:{value}',
                    max_value: 'La valeur du champ ne doit pas excéder 0:{value}',
                },
            },
        })
    })

    setLocale('fr')

    defineRule('required', required)
    defineRule('email', email)
    defineRule('confirmed', confirmed)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('minValue', min_value)
    defineRule('maxValue', max_value)
})