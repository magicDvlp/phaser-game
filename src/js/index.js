import Game from './Game';
import Phaser from 'phaser';
// onload
window.addEventListener('load', function() {
  const gameConfig = {
    type: Phaser.AUTO,
    parent: document.querySelector('div'),
    width: 800,
    height: 600,
    scene: [Game],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 300},
        debug: false,
      },
    },
  };
  new Phaser.Game(gameConfig);
  // loading
  document.documentElement.classList.remove('html-hidden');
});
