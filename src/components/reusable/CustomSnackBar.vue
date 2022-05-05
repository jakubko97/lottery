<template>
  <v-snackbar v-model="snackbar" :multi-line="multiLine">
    {{ message }}

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
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      multiLine: true,
      snackbar: false,
    };
  },
  methods: {
    open(){
      this.snackbar = true
    }
  }
};
</script>
