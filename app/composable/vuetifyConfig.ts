export const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
    valid: state.valid,
  },
});
