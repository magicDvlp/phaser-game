/* eslint-disable max-len */
import Phaser from 'phaser';

class Game extends Phaser.Scene {
  constructor() {
    super();
    this.hero = null;
    this.ground = null;
    this.cursors = null;
    this.prizes = null;
    this.platforms = [];
    this.score = 0;
    this.scoreLable = null;
    this.soundPing = null;
  }
  preload() {
    this.load.multiatlas('hero', 'img/hero.json', 'img');
    this.load.multiatlas('environment', 'img/environment.json', 'img');
    this.load.multiatlas('prizes', 'img/prizes.json', 'img');
    this.load.audio('bg', ['music/bg.mp3']);
    this.load.audio('ping', ['music/ping.mp3']);
  }
  createEnvironment() {
    this.add.sprite(400, 300, 'environment', '1.png').setScale(0.7);
    this.add.sprite(400, 300, 'environment', '2.png').setScale(0.7);
    this.add.sprite(400, 300, 'environment', '3.png').setScale(0.7);
    this.add.sprite(400, 300, 'environment', '4.png').setScale(0.7);
    this.add.sprite(400, 300, 'environment', '5.png').setScale(0.7);
    this.add.sprite(400, 300, 'environment', '6.png').setScale(0.7);
    this.ground = this.physics.add.staticSprite(400, 590, 'environment', '7.png');
    this.ground.setScale(0.7);
    this.ground.refreshBody();
  }
  createPlatform(x, y) {
    const platform = this.physics.add.staticSprite(x, y, 'environment', '7.png');
    platform.setScale(0.12);
    platform.refreshBody();
    this.platforms.push(platform);
  }
  createHero() {
    // hero
    this.hero = this.physics.add.sprite(400, 400, 'hero', '0_Reaper_Man_Idle Blinking_001.png');
    this.hero.setBounce(0.2);
    this.hero.body.setGravityY(300);
    this.hero.setCollideWorldBounds(true);
    this.hero.setScale(0.15, 0.15);
    const frameWalk = this.anims.generateFrameNames('hero', {
      start: 1,
      end: 23,
      zeroPad: 3,
      prefix: '0_Reaper_Man_Walking_',
      suffix: '.png',
    });
    const frameTurn = this.anims.generateFrameNames('hero', {
      start: 1,
      end: 17,
      zeroPad: 3,
      prefix: '0_Reaper_Man_Idle Blinking_',
      suffix: '.png',
    });
    const frameJump = this.anims.generateFrameNames('hero', {
      start: 1,
      end: 5,
      zeroPad: 3,
      prefix: '0_Reaper_Man_Jump Start_',
      suffix: '.png',
    });
    this.anims.create({key: 'heroWalk', frames: frameWalk, frameRate: 30, repeat: -1});
    this.anims.create({key: 'turn', frames: frameTurn, frameRate: 10, repeat: -1});
    this.anims.create({key: 'jump', frames: frameJump, frameRate: 30, repeat: 1});
  }
  createPrizes() {
    this.prizes = this.physics.add.group({
      key: 'prizes',
      frame: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png'],
      randomFrame: true,
      setXY: {x: 12, y: 0, stepX: 50},
      setScale: {x: 0.08, y: 0.08},
      quantity: 3,
      bounceY: 0.2,
    });
  }
  collectPrize(hero, prize) {
    prize.disableBody(true, true);
    this.soundPing.play();
    this.score += 10;
    this.scoreLable.setText('Score: ' + this.score);
  }
  create() {
    // background
    this.createEnvironment();

    // prizes
    this.createPrizes();

    // hero
    this.createHero();

    // platform
    this.createPlatform(0, 400);
    this.createPlatform(400, 200);
    this.createPlatform(750, 400);
    this.physics.add.collider(this.platforms, this.prizes);
    this.physics.add.collider(this.platforms, this.hero);
    this.physics.add.overlap(this.hero, this.prizes, this.collectPrize.bind(this), null, this);

    this.physics.add.collider(this.prizes, this.ground);
    this.physics.add.collider(this.hero, this.ground);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.scoreLable = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#fff'});

    // music
    this.sound.add('bg').play();
    this.soundPing = this.sound.add('ping');
  }
  update() {
    if (this.cursors.right.isDown) {
      this.hero.setVelocityX(160);
      this.hero.flipX = false;
      this.hero.anims.play('heroWalk', true);
    } else if (this.cursors.left.isDown) {
      this.hero.setVelocityX(-160);
      this.hero.flipX = true;
      this.hero.anims.play('heroWalk', true);
    } else {
      this.hero.setVelocityX(0);
      this.hero.anims.play('turn', true);
    }
    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.hero.body.touching.down) {
      this.hero.setVelocityY(-600);
      this.hero.anims.play('jump', true);
    }
  }
}

export default Game;
