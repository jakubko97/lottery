<template>
  <div style="justify-content: center; display: grid">
    <span class="headline">Create Lottery</span>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step editable :complete="e1 > 1" step="1">
          Ticket settings
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable :complete="e1 > 2" step="2">
          Prizes
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable step="3"> Deadline </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card width="650" class="mb-12" elevation="0">
            <v-card-text class="pt-0">
              <v-row class="pt-0">
                <v-col md="6" cols="12">
                  <v-text-field
                    label="Ticket price (ETH)"
                    type="number"
                    step="0.0001"
                    min="0"
                    v-model="newProject.ticketPrice"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    label="Ticket limit by account"
                    v-model="newProject.limitTickets"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-btn class="float-right" color="primary" @click="e1 = 2">
            Continue
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card width="650" elevation="0" class="mb-12">
            <RewardsBuilderDialog
              ref="rewardsBuilder"
              @push-element="addReward"
              @delete-element="deleteReward"
              :rewards="newProject.rewards"
            />
          </v-card>

          <v-btn
            color="primary"
            class="float-right"
            @click="rewardsFormConfirm()"
          >
            Continue
          </v-btn>

          <v-btn @click="e1 = 1" text> Back </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card width="650" elevation="0" class="mb-12" height="375px">
            <v-card-text class="pt-0">
              <v-row>
                <v-col class="" md="12">
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
          </v-card>

          <v-btn
            class="float-right"
            color="primary"
            :loading="newProject.isLoading"
            @click="startProject()"
          >
            Submit
          </v-btn>

          <v-btn @click="e1 = 2" text> Back </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <CustomSnackBar
      message="Please connect wallet to proceeded."
      ref="snackBarDialog"
    />
  </div>
</template>

<script>
import CustomSnackBar from "@/components/reusable/CustomSnackBar";
import createLottery from "../../contracts/BuildLotteryInstance";
import lottery from "../../contracts/lotteryInstance";
import RewardsBuilderDialog from "@/components/reusable/RewardsBuilderDialog";

export default {
  name: "CreateProject",
  components: {
    CustomSnackBar,
    RewardsBuilderDialog,
  },
  data() {
    return {
      nowDate: new Date().toISOString().slice(0, 10),
      nowTime: new Date().toISOString().substring(11, 16),
      date: null,
      time: null,
      e1: 1,
      account: null,
      modelSnackBar: false,
      newProject: {
        limitTicketsEnabled: false,
        isLoading: false,
        rewards: [
          { id: 1, value: 70 },
          { id: 2, value: 30 },
        ],
      },
    };
  },
  mounted() {
    // this code snippet takes the account (wallet) that is currently active
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });
  },
  created() {},
  methods: {
    addReward(reward) {
      this.newProject.rewards.push(reward);
    },
    deleteReward(id) {
      this.newProject.rewards = this.newProject.rewards.filter(
        (item) => item.id !== id
      );
    },
    rewardsFormConfirm() {
      if (this.$refs.rewardsBuilder.isValid()) {
        this.e1 = 3;
      }
    },
    retrieveRewards() {
      const arr = [];
      Array.from(this.newProject.rewards, (reward) => {
        arr.push(reward.value);
      });
      return arr;
    },
    async startProject() {
      if (this.account) {
        this.newProject.deadline = new Date(
          this.date + "T" + this.time + ":00"
        ).getTime();
        this.newProject.deadline = this.newProject.deadline / 1000;
        this.newProject.isLoading = true;
        console.log(this.retrieveRewards())
        await createLottery.methods
          .startProject(
            (this.newProject.owner = this.account),
            this.newProject.deadline,
            this.$web3.utils.toWei(this.newProject.ticketPrice, "ether"),
            this.retrieveRewards(),
            this.newProject.limitTickets
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
            this.$router.go("/");
          })
          .catch(() => {
            this.newProject.isLoading = false;
          });
      } else {
        this.$refs.snackBarDialog.open();
      }
    },
  },
};
</script>
