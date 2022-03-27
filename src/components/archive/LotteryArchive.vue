<template>
  <v-container>
    <v-list>
      <LotteryList
        :ethereumData="ethereumData != null ? ethereumData[0] : null"
        :archive="true"
        :projectData="projectData"
      />
    </v-list>
  </v-container>
</template>

<script>
import LotteryList from "@/components/reusable/LotteryList";
import lottery from "../../../contracts/lotteryInstance";
import createLottery from "../../../contracts/createLotteryInstance";
import apiCalls from "../../services/index";

export default {
  name: "LotteryArchive",
  components: {
    LotteryList,
  },
  data() {
    return {
      ethereumData: [],
      projectData: [],
      account: null,
      callResult: {
        finished: true,
        authorized: false,
        error: null,
        info: null,
      },
    };
  },
  async created() {
    this.$xapi
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum"
      )
      .then((result) => {
        this.ethereumData = result.data;
      });

    await this.getAddress();
    await this.getClosedProjects();
  },
  methods: {
    getAddress() {
      this.$web3.eth.getAccounts().then((accounts) => {
        [this.account] = accounts;
      });
    },
    getClosedProjects() {
      this.callResult.finished = false;
      createLottery.methods
        .returnClosedProjects()
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
                projectInfo.ticketPrice = this.$web3.utils.fromWei(
                  projectInfo.ticketPrice,
                  "ether"
                );
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
  },
};
</script>
