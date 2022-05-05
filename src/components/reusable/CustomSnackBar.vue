<template>
  <v-snackbar v-model="snackbar" :multi-line="multiLine">
    {{ snackBarText }}

    <template v-slot:action="{ attrs }">
      <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "CustomSnackBar",
  data() {
    return {
      multiLine: true,
      snackbar: false,
      snackBarText: `Please connect wallet to proceeded.`,
    };
  },
  methods: {
    open(){
      this.snackbar = true
    }
  }
};
</script>
