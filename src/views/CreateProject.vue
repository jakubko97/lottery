<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline font-weight-bold mt-2 ml-4"
          >Bring your project to life</span
        >
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row class="pt-0">
          <v-col md="12">
            <v-text-field
              label="Title"
              persistent-hint
              v-model="newProject.title"
            >
            </v-text-field>
          </v-col>
          <v-col md="12">
            <v-textarea
              label="Description"
              persistent-hint
              v-model="newProject.description"
            >
            </v-textarea>
          </v-col>
          <v-col md="6">
            <v-text-field
              label="Ticket Price (ETH)"
              type="number"
              step="0.0001"
              min="0"
              v-model="newProject.ticketPrice"
            >
            </v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              label="Number of winners"
              type="number"
              min="0"
              v-model="newProject.numberOfWinners"
            >
            </v-text-field>
          </v-col>

          <v-col md="6">
            <v-date-picker :min="nowDate" v-model="date"></v-date-picker>
          </v-col>
          <v-col md="6">
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
    newProject: { isLoading: false },
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
          this.newProject.ticketPrice,
          this.newProject.numberOfWinners
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
          this.$router.push({
            path: "/",
            params: { otherProp: { project: projectInfo } },
          });
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
