<template>
  <v-container>
    <v-list>
      <DashboardHeader />
      <LotteryList :projectData="projectData" />
    </v-list>
  </v-container>
</template>

<script>
import createLottery from "../../../contracts/createLotteryInstance";
import lottery from "../../../contracts/lotteryInstance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LotteryList from "@/components/reusable/LotteryList";

export default {
  name: "HelloWorld",
  components: {
    DashboardHeader,
    LotteryList,
  },
  data: () => ({
    projectData: [],
    account: null,
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
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
