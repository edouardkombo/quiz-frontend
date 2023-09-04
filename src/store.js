import { reactive } from 'vue';
import { shuffle } from './helpers';

export const store = reactive({
  apiUrl: "https://quizz-api.xtipper.com/api",	
  sessionId: 0,
  username: "",
  playerId: 0,	
  score: 0,
  bestCategoryScore: 0,	
  currentCategoryScore: 0,
  questionCount: 0,
  quizEnded: false,
  data: [],
  options: null,
  loading: true,
  currentQuestion: 0,
  step: 0,
  showAnswer: false,
  incrementScore() {
    this.score++;
  },
  restartQuiz() {
    this.score = 0;
    this.step = 0;
    this.bestCategoryScore = 0;
    this.currentCategoryScore = 0;
    this.sessionId = 0;
    this.playerId = 0;
    this.username = "";	  
    this.questionCount = 0;
    this.quizEnded = false;
    this.data = null;
    this.getData();
    this.loading = true;
  },
  setQuestionCount(count) {
    this.questionCount = count;
  },
  getData() {
    this.loading = true;

    const headers = { "Content-Type": "application/json", "Accept":"application/json" };

    fetch(
      `${this.apiUrl}/categories/${this.options.category}/questions`, {headers}
    )
      .then((res) => res.json())
      .then((res) => {
        
	res.map((item, index) => {

          fetch(
            `${this.apiUrl}/questions/${item.id}/answers`, {headers}
          )
          .then((res_answers) => res_answers.json())
          .then((res_answers) => {
	      //console.log(res_answers);
              //Define correct and incorrect answers
	      res_answers.forEach((item_answer, key) => {
		  item_answer.id = key;
	          if (item_answer.value.value > 0) {
                      item_answer.correct = true;
	          } else {
                      item_answer.correct = false;
	          }
	          res_answers[key] = item_answer;
	      });
	      item.answers = res_answers;
	      item.succeeded = false;
              res[item.id] = item;
	      this.data[this.data.length] = item;
              this.loading = false;
          });
        });
        this.currentQuestion = 0;
        this.showAnswer = false;
        this.questionCount = res.length;
        this.loading = false;
      });
  },
  checkAnswer(answerId) {
    if (this.data[this.currentQuestion].answers[answerId].correct == true) {
      this.incrementScore();
      this.showAnswer = true;
      this.data.results[this.currentQuestion].succeeded = true;
      return;
    }
    this.data[this.currentQuestion].succeeded = false;
    this.showAnswer = true;
  },
  getHash(input){
      var hash = 0, len = input.length;
      for (var i = 0; i < len; i++) {
          hash  = ((hash << 5) - hash) + input.charCodeAt(i);
          hash |= 0; // to 32bit integer
      }
      return hash;
  },	
  saveGameSession() {
    const currentTimeStamp = Math.round(+new Date()/1000);
    this.sessionId = this.getHash(this.username + "-" + currentTimeStamp);
    this.data.map((question) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept":"application/json" },
            body: JSON.stringify({ 
	        "player": `api/players/${this.playerId}`,
		"session": `${this.sessionId}`,
		"question": `api/questions/${question.id}`,
                "success": question.succeeded
	    })
        };
        fetch(`${this.apiUrl}/games`, requestOptions)
          .then(response => response.json())
          .then(response => {});
    });
  },
  setScore() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept":"application/json" },
        body: JSON.stringify({
            "player": `api/players/${this.playerId}`,
            "category": `api/categories/${this.options.category}`,
            "score": this.score
        })
    };
    fetch(`${this.apiUrl}/scores`, requestOptions)
      .then(response => response.json())
      .then(response => {});
  },
  getBestCategoryScore() {
    const headers = { "Content-Type": "application/json", "Accept":"application/json" };
    fetch(`${this.apiUrl}/scores?category=${this.options.category}&order[score]=desc`, {headers})
      .then(response => response.json())
      .then(response => { 
          this.bestCategoryScore = response[0].score;
	  this.currentCategoryScore = parseFloat((this.score*100)/this.bestCategoryScore).toFixed(2);
      });
  },	
  savePlayer() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept":"application/json" },
      body: JSON.stringify({ "username": `${this.username}` })
    };
    fetch(`${this.apiUrl}/players`, requestOptions)
      .then(response => response.json())
      .then(response => {
	  this.playerId = response.id;    
      });
  },
  checkPlayerId() {
      const headers = { "Content-Type": "application/json", "Accept":"application/json" };
      fetch(`https://api.ipify.org?format=json`)
        .then(response => response.json())
        .then(response => {
            this.clientIp = response.ip;
	    this.username = this.username + "-" + this.clientIp;

	    fetch(`${this.apiUrl}/players?username=${this.username}`, {headers})
              .then(player_response => player_response.json())
              .then(player_response => {
		  //Save player if does not exists
		  if (player_response.length==0) {
                      this.savePlayer();
		  } else {
                      //set player id
	              this.playerId = player_response[0].id;
		  }
            });
        });	  
  },
  getNextQuestion() {
    if (this.currentQuestion >= this.data.length - 1) {
      this.saveGameSession();
      this.setScore();
      this.getBestCategoryScore();
      this.quizEnded = true;
      this.step = 2;
    }
    this.currentQuestion += 1;
    this.showAnswer = false;
  },
  startQuiz(payload) {
    this.options = payload;
    this.step = 1;
  },
});
