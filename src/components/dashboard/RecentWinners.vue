<template>
<div> 
  <div class="headline mb-4">Recent Winners</div>
  <v-row>
    <v-col v-for="winner in winners" :key="winner.account">
       <v-card style="width:240px">
    <v-card-title>{{ winner.account }}</v-card-title>
    <v-card-subtitle>{{ winner.reward }}</v-card-subtitle>
      
  </v-card>
    </v-col>
  </v-row>
 </div>
</template>

<script>
export default {
  name: "RecentWinners",
  data(){
      return {
        search: '',
        winners: [
          {
            account: '0x998e00A168718f55Ac73b607c40b579Cc5F4DCEa',
            reward: '1.5 eth',
          },
          {
            account: '0xc1da6e594a55faAD15fe1E5fF5c8FbE5EAbdaE2b',
            reward: '0.54 eth',
          },
         {
            account: '0x74658B9eC4527c1Cf8602b6400FcEE1d2e78A901',
            reward: '4.9 eth',
          },
          {
            account: '0xd13AEd7f6d9056588a8401765e19F3409493c9dB',
            reward: '10 eth',
          },
         {
            account: '0x6D70623e64E2dBf79110aa6B046c781Eb73eDb42',
            reward: '8.0333 eth',
          }
        ]
      }
  },
  methods: {
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
