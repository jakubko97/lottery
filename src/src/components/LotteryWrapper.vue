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
        <h1 class="display-2 font-weight-bold mb-3">

        </h1>
      </v-col>
    </v-row>

    <StartProjectDialog @startProject="startProject"/>
    <div v-for="(lottery, index) in projectData" :key="index">
    <v-card class="my-2 pa-0">
    <v-card-title>
      {{ lottery.projectTitle }}
    </v-card-title>

    <v-card-subtitle>
      <v-row>
        <v-col>
        Description: {{ lottery.projectDesc }}
        </v-col>
        <v-col>
         Deadline: {{ getDateFormat(lottery.deadlineTime) }}
        </v-col>
        <v-col>
          <v-text-field v-model="amount" label="Tickets" height="52">
          <template v-slot:prepend>
             <img width="32" height="32" src="../assets/ethereum.svg">
          </template>
        </v-text-field>
        <v-btn depressed color="primary" :loading="isLoading" @click="buyTicket(lottery)">
         Buy
         </v-btn>

        </v-col>
      </v-row>
    </v-card-subtitle>
        <!-- <v-card-text>
      <v-row v-if="lottery.currentState == 0">
        <v-col md="12">
          <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
          Open
        </v-col>
      </v-row>
      <v-row v-if="lottery.currentState == 1">
        <v-col md="12">
          <v-icon color="red">mdi-close-circle
        </v-icon>
        Closed
        </v-col>
      </v-row>
        </v-card-text> -->
    </v-card>
  </div>
  </v-container>
</template>

<script>
import createLottery from '../../contracts/createLotteryInstance';
import lottery from '../../contracts/lotteryInstance';
import StartProjectDialog from '../components/StartProjectDialog';

export default {
  name: 'HelloWorld',
  components: {
    StartProjectDialog
  },
  data: () => ({
    dialog: false,
    projectData: [],
    account: null,
    amount: null,
    goal: null,
    balance: null,
    deadline: null,
    pledgeOf: null,
    isLoading: false,
    owner: null,
    state: null
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
     getProjects() {
      createLottery.methods.returnAllLotteries().call().then((projects) => {
        projects.forEach((projectAddress) => {
          const projectInst = lottery(projectAddress);
          projectInst.methods.getDetails().call().then((projectData) => {
            const projectInfo = projectData;
            projectInfo.isLoading = false;
            projectInfo.contract = projectInst;
            this.projectData.push(projectInfo);
          });
        });
      });
    },
    startProject(newProject, dialog){
        newProject.isLoading = true;
      createLottery.methods.startProject(
        newProject.owner = this.account,
        newProject.title,
        newProject.description,
        newProject.deadline,
        newProject.ticketPrice
      ).send({
        from: this.account,
      }).then((res) => {
        newProject.isLoading = false
        dialog = false
        const projectInfo = res.events.ProjectStarted.returnValues;
        projectInfo.isLoading = false;
        projectInfo.currentAmount = 0;
        projectInfo.currentState = 0;
        projectInfo.contract = lottery(projectInfo.contractAddress);
        //this.startProjectDialog = false;
        //this.newProject = { isLoading: false };
      });
    },
    getSelectedAddress(){
      return window.ethereum.selectedAddress
    },
    getDateFormat(uintDate){
        let milliseconds = `${uintDate}000`; 
        return new Date(+milliseconds);
    },
    async update() {
      await this.contract.methods.deadline().call().then((value) => { const
        milliseconds = `${value}000`; 
        this.deadline = new Date(+milliseconds); });

      await this.contract.methods.goal().call().then((value) => {
        this.goal = parseFloat(this.$web3.utils.fromWei(value, 'ether')).toFixed(6);
      });

      await this.$web3.eth.getBalance(this.contract.options.address).then((value) => {
        this.balance = parseFloat(this.$web3.utils.fromWei(value, 'ether')).toFixed(6);
      });

      await this.contract.methods.pledgeOf(this.account).call().then((value) => {
        this.pledgeOf = parseFloat(this.$web3.utils.fromWei(value, 'ether')).toFixed(6);
      });

      await this.contract.methods.state().call().then((value) => { 
       this.state = value
      })

    await this.contract.methods.getOwner
      ().call().then((value) => { this.owner = value
      })

    },
    buyTicket(lottery) {
      if (this.amount != null) {
        this.isLoading = true;
        lottery.contract.methods.buyTicket(this.amount).send(
          {
            from: this.account,
            value: this.amount,
          },
        ).then(() => {
          this.update();
          this.isLoading = false;
        }).catch(() => {
          this.isLoading = false;
        });
      }
    },
    getRefund() {
      this.isLoading = true;
      this.contract.methods.getRefund().send({
        from: this.account,
      }).then(() => {
          this.update();
          this.isLoading = false;
        }).catch(() => {
          this.isLoading = false;
        });
    },

    claimFunds() { 
      this.isLoading = true; 
      this.contract.methods.claimFunds().send({
        from: this.account, }).then(() => { 
          this.update(); 
          this.isLoading = false;
        }).catch(() => { 
          this.isLoading = false; }); 
          },

  },
};
</script>
