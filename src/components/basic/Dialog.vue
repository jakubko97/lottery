<template>
  <div>
    <v-dialog v-bind="$attrs" width="80%" persistent :max-width="maxWidth">
      <v-card>
        <v-card-title class="headline">
          {{ $i18n.t(title) }}
          <v-btn
            absolute
            icon
            rounded
            style="top: 0px; right: 0px"
            class="ma-3 error--text"
            @click="$emit('close-dialog')"
          >
            <v-icon size="xx-large"> mdi-close-circle-outline </v-icon>
          </v-btn>
        </v-card-title>

        <slot />

        <slot name="content" />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="saveButton"
            :color="saveButtonColor"
            class="ma-0 pa-0"
            text
            :loading="loadingSaveButton"
            @click="saveDialog"
          >
            {{ $i18n.t(saveButtonLabel) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "BasicDialog",
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    saveButton: {
      type: Boolean,
      required: false,
    },
    saveButtonLabel: {
      type: String,
      default: "App.save",
    },
    saveButtonColor: {
      type: String,
      default: "info",
    },
    maxWidth: {
      type: String,
      required: false,
      default: "800",
    },
    loadingSaveButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    saveDialog() {
      this.$emit("save-dialog");
    },
  },
};
</script>
