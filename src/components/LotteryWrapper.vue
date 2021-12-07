<template>
  <v-container>
    <v-list subheader>
      <v-row>
        <v-col cols="12" md="10">
          <v-subheader>Lotteries</v-subheader>
        </v-col>
        <v-col cols="12" md="2">
          <v-fab-transition>
            <v-btn fab color="primary" @click="createProject()">
              <v-icon>mdi-plus-box</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-col>
      </v-row>
      <v-list-item
        dense
        v-for="lottery in projectData"
        :key="lottery.projectTitle"
        style="justify-content: center; text-align: left; display: grid"
      >
        <v-list-item-content>
          <LotteryCard :lottery="lottery" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import createLottery from "../../contracts/createLotteryInstance";
import lottery from "../../contracts/lotteryInstance";
import LotteryCard from "@/components/LotteryCard";

export default {
  name: "HelloWorld",
  components: {
    LotteryCard,
  },
  data: () => ({
    headers: [
      { text: "Title", value: "projectTitle" },
      { text: "Price", value: "ticketPrice" },
      { text: "Deadline", value: "deadlineTime" },
    ],

    dialog: false,
    projectData: [],
    search: "",
    account: null,
    amount: null,
    lotteryDetailDialog: false,
    callResult: { finished: true, authorized: false, error: null, info: null },
  }),
  mounted() {
    // this code snippet takes the account (wallet) that is currently active
  },
  created() {
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });

    this.getProjects();
  },
  methods: {
    updateDialog(val) {
      this.lotteryDetailDialog = val;
    },
    getProjects() {
      this.callResult.finished = false;
      createLottery.methods
        .returnAllLotteries()
        .call()
        .then((projects) => {
          projects.forEach((projectAddress) => {
            const projectInst = lottery(projectAddress);
            let projectInfo = null;
            projectInst.methods
              .getDetails(this.account)
              .call()
              .then((projectData) => {
                projectInfo = projectData;
                projectInfo.isLoading = false;
                projectInfo.contract = projectInst;
                projectInfo.deadlineTime =
                  projectInfo.deadlineTime.toString() + "000";
                projectInfo.lotteryDateCreated =
                  projectInfo.lotteryDateCreated.toString() + "000";

                this.projectData.push(projectInfo);
                this.callResult.finished = true;
              })
              .catch((e) => {
                this.callResult.finished = true;
              });

            projectInst.methods
              .getPlayersDetails()
              .call()
              .then((projectData) => {
                projectInfo.players = projectData.lotteryPlayers;
                projectInfo.tickets = projectData.lotteryTickets;
              })
              .catch((e) => {
                this.callResult.finished = true;
              });
          });
        })
        .catch((e) => {
          this.callResult.finished = true;
        });
    },
    pickWinner(lottery) {
      lottery.contract.methods
        .pickWinner()
        .send({
          from: this.account,
        })
        .then(() => {})
        .catch(() => {});
    },
    getSelectedAddress() {
      return window.ethereum.selectedAddress;
    },
    createProject() {
      this.$router.push("/CreateProject");
    },

    getRefund() {
      this.contract.methods
        .getRefund()
        .send({
          from: this.account,
        })
        .then(() => {
          this.update();
        })
        .catch(() => {});
    },

    claimFunds() {
      this.contract.methods
        .claimFunds()
        .send({
          from: this.account,
        })
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>
