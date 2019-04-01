var app = new Vue({
  el: '#app',
  data: {
    challenges: [],
  },
  created() {
    this.getChallenges();
  },

  methods: {
    async getChallenges() {
      try {
        let response = await axios.get("/api/challenges");
        this.challenges = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteItem(challenge) {
      try {
        let response = await axios.delete("/api/challenges/" + challenge._id);
        this.getChallenges();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});
