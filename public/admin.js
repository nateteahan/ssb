var app = new Vue({
  el: '#admin',
  data: {
    name: "",
    skillLevel: "",
    editSkill: "",
    file: null,
    addChallenge: null,
    challenges: [],
    findName: "",
    findChallenge: null,
    date: "",
    editDate: "",
  },
  created() {
    this.getChallenges();
  },
  computed: {
    suggestions() {
      return this.challenges.filter(challenge => challenge.name.toLowerCase().startsWith(this.findName.toLowerCase()));
    }
  },
  methods: {
    async editChallenge(challenge) {
      try {
        let response = await axios.put("/api/challenges/" + challenge._id, {
          name: this.findChallenge.name,
          date: this.editDate,
          skillLevel: this.editSkill,
        });
        this.findChallenge = null;
        this.getChallenges();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteChallenge(challenge) {
      try {
        let response = axios.delete("/api/challenges/" + challenge._id);
        this.findChallenge = null;
        this.getChallenges();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectChallenge(challenge) {
      this.findName = "";
      this.findChallenge = challenge;
    },
    async getChallenges() {
      try {
        let response = await axios.get("/api/challenges");
        this.challenges = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        // const formData = new FormData();
        // formData.append('photo', this.file, this.file.name)
        // let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/challenges', {
          name: this.name,
          date: this.date.toString(),
          skillLevel: this.skillLevel
        });
        this.addChallenge = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
  }
});
