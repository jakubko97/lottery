<template>
  <v-container>
    <v-form>
      <v-row class="align-center" v-for="(item, index) in prizes" :key="item.id">
        <v-col cols="11" sm="5" md="5">
          <v-text-field
            :label="'Prize Number'"
            required
            v-model="item.id"
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="11" sm="5" md="5">
          <v-text-field
            :label="'*Prize in %'"
            required
            @input="$v.prizes.$each[index].$touch()"
            @blur="$v.prizes.$each[index].$touch()"
            :error-messages="$v.prizes.$each[index].$invalid ? 'Prize is required' : ''"
            v-model="item.value"
          ></v-text-field>
        </v-col>
        <v-col cols="1" sm="1" md="1">
          <v-icon
            v-if="item.id == rewards.length && item.id != 1"
            color="red"
            @click="deleteReward(item.id)"
            >mdi-delete</v-icon
          >
        </v-col>
      </v-row>
    </v-form>
    <v-row class="align-center">
      <v-col cols="11" sm="5" md="5">
        <v-fab-transition>
          <v-btn color="accent" dark bottom right small @click="addReward">
            <v-icon>mdi-plus</v-icon>ADD
          </v-btn>
        </v-fab-transition>
      </v-col>
    </v-row>
    <small>*indicates required field</small>
    <v-spacer></v-spacer>
    <!-- <v-btn color="primary" dark @click="submit()"> Save </v-btn> -->
    <CustomSnackBar
      message="Max winners for lottery is 5"
      ref="snackBarDialog"
    />
  </v-container>
</template>

<script>
import CustomSnackBar from "@/components/reusable/CustomSnackBar";
import { validationMixin } from "vuelidate";

import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "RewardsBuilderDialog",
  components: {
    CustomSnackBar,
  },
  props: {
    rewards: {
      type: Array,
      required: true,
    },
  },
  validations: {
    prizes: {
      $each: {
        value: { required },
      },
    },
  },
  data() {
    return {
      valid: true,
      dialog: false,
      prizes: this.rewards,
    };
  },
  computed: {
   
  },
  methods: {
    isValid() {
      this.$v.$touch();
      console.log(this.$v);
      return !this.$v.$invalid;
    },
    addReward() {
      if (this.rewards.length < 5) {
        const defaultReward = { id: this.rewards.length + 1, value: "" };
        this.$emit("push-element", defaultReward);
      } else {
        this.$refs.snackBarDialog.open();
      }
    },
    deleteReward(id) {
      this.$emit("delete-element", id);
    },
  },
};
</script>
