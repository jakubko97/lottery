<template>
  <div style="justify-content: center; display: grid">
    <v-card>
      <v-card-title>
        <span class="headline font-weight-bold mt-2 ml-4"
          >Bring your project to life</span
        >
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row class="pt-0">
          <v-col md="6" cols="12">
            <v-text-field
              label="Title"
              persistent-hint
              v-model="newProject.title"
            >
            </v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              label="Ticket Price (ETH)"
              type="number"
              step="0.0001"
              min="0"
              v-model="newProject.ticketPrice"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6" cols="12">
            <v-textarea
              label="Description"
              persistent-hint
              v-model="newProject.description"
            >
            </v-textarea>
          </v-col>
          <v-col md="6" cols="12">
            <v-select
              v-model="newProject.rewards"
              :hint="`${newProject.rewards.value.length} vyhercovia`"
              :items="rewards"
              item-text="text"
              item-value="value"
              label="Select"
              persistent-hint
              return-object
              single-line
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6">
            <v-switch
              v-model="newProject.limitTicketsEnabled"
              :label="`Limit tickets per account`"
            ></v-switch>
          </v-col>
            <v-col v-if="newProject.limitTicketsEnabled" md="6">
            <v-text-field label="Limit" v-model="newProject.limitTickets"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <v-date-picker
              class="mr-5"
              :min="nowDate"
              v-model="date"
            ></v-date-picker>
            <v-time-picker
              :min="nowDate == date ? nowTime : ''"
              v-model="time"
              format="24hr"
            ></v-time-picker>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="startProject()"
          :loading="newProject.isLoading"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import createLottery from "../../contracts/createLotteryInstance";
import lottery from "../../contracts/lotteryInstance";

export default {
  name: "CreateProject",
  data: () => ({
    nowDate: new Date().toISOString().slice(0, 10),
    nowTime: new Date().toISOString().substring(11, 16),
    date: null,
    time: null,
    account: null,
    rewards: [
      { text: "1. miesto 70%, 2. miesto 30%", value: [70, 30] },
      { text: "1. miesto 80%, 2. miesto 20%", value: [80, 20] },
      { text: "1. miesto 60%, 2. miesto 40%", value: [60, 40] },
      {
        text: "1. miesto 70%, 2. miesto 20%, 3. miesto 10%",
        value: [70, 20, 10],
      },
      {
        text: "1. miesto 60%, 2. miesto 25%, 3. miesto 15%",
        value: [60, 25, 15],
      },
    ],
    newProject: {
      limitTicketsEnabled: false,
      isLoading: false,
      rewards: { text: "1. miesto 70%, 2. miesto 30%", value: [70, 30] },
    },
  }),
  mounted() {
    // this code snippet takes the account (wallet) that is currently active
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });
  },
  created() {},
  methods: {
    startProject() {
      this.newProject.deadline = new Date(
        this.date + "T" + this.time + ":00"
      ).getTime();
      this.newProject.deadline = this.newProject.deadline / 1000;
      this.newProject.isLoading = true;
      createLottery.methods
        .startProject(
          (this.newProject.owner = this.account),
          this.newProject.title,
          this.newProject.description,
          this.newProject.deadline,
          this.$web3.utils.toWei(this.newProject.ticketPrice, "ether"),
          this.newProject.rewards.value.length,
          this.newProject.rewards.value,
          this.newProject.limitTickets,
        )
        .send({
          from: this.account,
        })
        .then((res) => {
          this.newProject.isLoading = false;
          const projectInfo = res.events.ProjectStarted.returnValues;
          projectInfo.currentAmount = 0;
          projectInfo.currentState = 0;
          projectInfo.deadlineTime =
            projectInfo.deadlineTime.toString() + "000";
          projectInfo.contract = lottery(projectInfo.contractAddress);
          //this.projectData.push(projectInfo);
          this.$router.go('/')
        })
        .catch(() => {
          this.newProject.isLoading = false;
        });
    },
    closeDialog() {
      this.dialog = false;
      this.newProject.title = "";
      this.newProject.description = "";
      this.newProject.ticketPrice = "";
      this.newProject.deadline = "";
    },
  },
};
</script>
