<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/crowdfunding.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3"></h1>
      </v-col>
    </v-row>

    <StartProjectDialog ref="startProjectDialog" @startProject="startProject" />

    <v-data-table
      :headers="headers"
      :items="projectData"
      :mobile-breakpoint="0"
      :search="search"
      :loading="!callResult.finished"
      :sort-by="['']"
      :sort-desc="[true]"
      multi-sort
      :footer-props="{
        itemsPerPageOptions: [10, 20],
      }"
      dense
      @click:row="lotteryDetail"
    >
      <template #top>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <h2>
                {{ "Lotteries" }}
              </h2>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="search"
                single-line
                hide-details
                class="ma-0 pa-0"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #progress>
        <v-progress-linear
          v-if="!callResult.finished"
          color="info"
          height="10"
          indeterminate
        />
      </template>
      <!-- <template v-for="header in headers">
        <span :slot="`header.${header.value}`" :key="header.value">{{
          $i18n.t(header.text)
        }}</span>
      </template> -->
      <template #[`item.deadlineTime`]="{ item }">
        <div v-if="item.deadlineTime != null" class="d-flex">
          {{ getDateFormat(item.deadlineTime) }}
        </div>
      </template>
      <template #[`item.lotteryDateCreated`]="{ item }">
        <div v-if="item.lotteryDateCreated != null" class="d-flex">
          {{ getDateFormat(item.lotteryDateCreated) }}
        </div>
      </template>
    </v-data-table>
    <LotteryDetail ref="lotteryDialog" />
  </v-container>
</template>

<script>
import createLottery from "../../contracts/createLotteryInstance";
import lottery from "../../contracts/lotteryInstance";
import StartProjectDialog from "../components/StartProjectDialog";
import LotteryDetail from "../components/LotteryDetail";

export default {
  name: "HelloWorld",
  components: {
    StartProjectDialog,
    LotteryDetail,
  },
  data: () => ({
    headers: [
      { text: "Title", value: "projectTitle" },
      { text: "Price", value: "ticketPrice" },
      { text: "Deadline", value: "deadlineTime" },
      { text: "Created", value: "lotteryDateCreated" },
    ],

    dialog: false,
    projectData: [],
    search: "",
    account: null,
    amount: null,
    lotteryDetailDialog: false,
    callResult: { finished: true, authorized: false, error: null, info: null },
  }),
  async mounted() {
    // this code snippet takes the account (wallet) that is currently active
    this.$web3.eth.getAccounts().then((accounts) => {
      [this.account] = accounts;
    });
  },
  created() {
    // window.ethereum.on('accountsChanged', function (accounts) { // Time to reloadyour interface with accounts[0]!
    //   this.account = accounts;
    // })
    this.getProjects();
  },
  methods: {
    lotteryDetail(lottery) {
      this.$refs.lotteryDialog.openDialog(lottery);
    },

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
            projectInst.methods
              .getDetails()
              .call()
              .then((projectData) => {
                const projectInfo = projectData;
                projectInfo.isLoading = false;
                projectInfo.contract = projectInst;
                projectInfo.deadlineTime =
                  projectInfo.deadlineTime.toString() + "000";
                projectInfo.lotteryDateCreated =
                  projectInfo.lotteryDateCreated.toString() + "000";

                this.projectData.push(projectInfo);
                this.callResult.finished = true;
              });
          });
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
    startProject(newProject) {
      newProject.isLoading = true;
      createLottery.methods
        .startProject(
          (newProject.owner = this.account),
          newProject.title,
          newProject.description,
          newProject.deadline,
          newProject.ticketPrice
        )
        .send({
          from: this.account,
        })
        .then((res) => {
          newProject.isLoading = false;
          const projectInfo = res.events.ProjectStarted.returnValues;
          projectInfo.currentAmount = 0;
          projectInfo.currentState = 0;
          projectInfo.deadlineTime =
            projectInfo.deadlineTime.toString() + "000";
          projectInfo.contract = lottery(projectInfo.contractAddress);
          this.projectData.push(projectInfo);
          this.$refs.startProjectDialog.closeDialog();
        })
        .catch(() => {
          newProject.isLoading = false;
        });
    },
    getSelectedAddress() {
      return window.ethereum.selectedAddress;
    },
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate));
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
