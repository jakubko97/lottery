<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on"> Set Rewards </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Rewards Builder</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="align-center" v-for="item in rewards" :key="item.id">
            <v-col cols="11" sm="5" md="5">
              <v-text-field
                :label="'Reward Number'"
                required
                v-model="item.id"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="11" sm="5" md="5">
              <v-text-field
                :label="'*Reward in %'"
                required
                v-model="item.value"
              ></v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-icon v-if="item.id == rewards.length && item.id != 1" color="red" @click="deleteReward(item.id)">mdi-delete</v-icon>
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col cols="11" sm="5" md="5">
              <v-fab-transition>
                <v-btn color="accent" dark bottom right fab small @click="addReward">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RewardsBuilderDialog",
  components: {},
  props: {
    rewards: {
      type: Array,
      required: true,
    },
  },
  data() { 
      return {
        dialog: false,
    }
  },
  methods: {
      addReward(){
        const defaultReward = { id: this.rewards.length + 1, value: ''}
        this.$emit('push-element', defaultReward)
      },
      deleteReward(id){
        this.$emit('delete-element', id)
      }
  },
};
</script>
