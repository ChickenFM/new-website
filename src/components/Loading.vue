<template>
  <v-dialog v-model="loading" hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-progress-linear
        indeterminate
        color="white"
        class="mb-0"
      ></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    loading: Boolean
  }
};
</script>
