// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4kkpTQg-j6tEk2no_5oXlhBctAYYlOu0",
  authDomain: "tiblocks-0914.firebaseapp.com",
  projectId: "tiblocks-0914",
  storageBucket: "tiblocks-0914.appspot.com",
  messagingSenderId: "386230084723",
  appId: "1:386230084723:web:ab2bae20d23fe36961f606",
  measurementId: "G-QXM4HZT48Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LoginScene, GameScene],
    parent: 'game-container'
  };
  
  // Initialize Phaser game
  const game = new Phaser.Game(config);
  
  // Login scene
  class LoginScene extends Phaser.Scene {
    constructor() {
      super({ key: 'LoginScene' });
    }
  
    preload() {
      this.load.html('login', 'login.html');
    }
  
    create() {
      const loginElement = this.add.dom(400, 300).createFromCache('login');
      
      document.getElementById('google-login').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(result => {
          this.scene.start('GameScene');
        }).catch(error => {
          console.error(error);
        });
      });
  
      document.getElementById('apple-login').addEventListener('click', () => {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        auth.signInWithPopup(provider).then(result => {
          this.scene.start('GameScene');
        }).catch(error => {
          console.error(error);
        });
      });
    }
  }
  
  // Game scene
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }
  
    preload() {
      this.load.image('rock', 'assets/rock.png');
      this.load.image('paper', 'assets/paper.png');
      this.load.image('scissors', 'assets/scissors.png');
    }
  
    create() {
      this.add.text(400, 50, 'Rock-Paper-Scissors', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  
      const rock = this.add.image(200, 300, 'rock').setInteractive();
      const paper = this.add.image(400, 300, 'paper').setInteractive();
      const scissors = this.add.image(600, 300, 'scissors').setInteractive();
  
      rock.on('pointerdown', () => this.playGame('rock'));
      paper.on('pointerdown', () => this.playGame('paper'));
      scissors.on('pointerdown', () => this.playGame('scissors'));
    }
  
    playGame(playerChoice) {
      const choices = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * choices.length)];
      const result = this.determineWinner(playerChoice, computerChoice);
  
      this.add.text(400, 500, `You chose: ${playerChoice}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 550, `Computer chose: ${computerChoice}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 600, `Result: ${result}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  
      this.saveGameState(playerChoice, computerChoice, result);
    }
  
    determineWinner(playerChoice, computerChoice) {
      if (playerChoice === computerChoice) {
        return 'Draw';
      }
      if ((playerChoice === 'rock' && computerChoice === 'scissors') ||
          (playerChoice === 'paper' && computerChoice === 'rock') ||
          (playerChoice === 'scissors' && computerChoice === 'paper')) {
        return 'You Win';
      }
      return 'You Lose';
    }
  
    saveGameState(playerChoice, computerChoice, result) {
      const user = firebase.auth().currentUser;
      if (user) {
        db.collection('gameStates').add({
          uid: user.uid,
          playerChoice,
          computerChoice,
          result,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          console.log('Game state saved successfully');
        }).catch(error => {
          console.error('Error saving game state:', error);
        });
      }
    }
  }