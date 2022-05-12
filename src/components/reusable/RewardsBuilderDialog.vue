<template>
  <v-container>
    <v-form>
      <v-row
        class="align-center"
        v-for="(item, index) in rewards"
        :key="item.id"
      >
        <v-col cols="3" sm="5" md="5">
          <v-text-field
            :label="'Prize order'"
            required
            v-model="item.id"
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="8" sm="5" md="5">
          <v-text-field
            :label="'*Prize in %'"
            required
            @input="$v.rewards.$each[index].$touch()"
            @blur="$v.rewards.$each[index].$touch()"
            :error-messages="
              $v.rewards.$each[index].$invalid ? 'Prize is required' : ''
            "
            v-model="item.value"
          ></v-text-field>
        </v-col>
        <v-col cols="1" sm="1" md="1">
          <v-icon
            v-if="item.id == rewards.length && item.id != 1"
            color="accent"
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
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="blue lighten-1"> mdi-information </v-icon>
        </v-btn>
      </template>
      <small>maximum number of winners 5</small><br />
      <small>sum of prizes must be 100%</small><br />
    </v-tooltip><br>
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
    rewards: {
      $each: {
        value: { required },
      },
    },
  },
  data() {
    return {
      valid: true,
      dialog: false
    };
  },
  computed: {},
  methods: {
    isValid() {
      this.$v.$touch();
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
