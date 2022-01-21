<template>
  <v-container>
    <v-list>
      <LotteryList :ethereumData="ethereumData != null ? ethereumData[0] : null" :projectData="projectData" />
      <RecentTransactions/>
      <RecentWinners/>
    </v-list>
  </v-container>
</template>

<script>
import createLottery from "../../../contracts/createLotteryInstance";
import lottery from "../../../contracts/lotteryInstance";
import LotteryList from "@/components/reusable/LotteryList";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RecentWinners from "@/components/dashboard/RecentWinners";

export default {
  name: "LotteryWrapper",
  components: {
    LotteryList,
    RecentTransactions,
    RecentWinners
  },
  data: () => ({
    projectData: [],
    account: null,
    ethereumData: null,
    callResult: { finished: true, authorized: false, error: null, info: null },
  }),
  mounted() {
    // this code snippet takes the account (wallet) that is currently active
  },
  created() {
     this.$xapi.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum').then((result => {
      this.ethereumData = result.data
    }))

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
        .returnOpenProjects()
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
                projectInfo.ticketPrice = this.$web3.utils.fromWei(projectInfo.ticketPrice, "ether")
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
