const GAME_WIDTH = 900;
const GAME_HEIGHT = 450;
const GROUND_Y = 418;
const GROUND_HEIGHT = 64;
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2;

function startBackgroundMusic(scene) {
  stopGameOverMusic(scene);

  let music = scene.sound.get('bgm-8bit');

  if (!music) {
    music = scene.sound.add('bgm-8bit', {
      loop: true,
      volume: 0.32
    });
  }

  if (!music.isPlaying) {
    music.play();
  }
}

function stopBackgroundMusic(scene) {
  const music = scene.sound.get('bgm-8bit');
  if (music && music.isPlaying) {
    music.stop();
  }
}

function startGameOverMusic(scene) {
  stopBackgroundMusic(scene);

  let music = scene.sound.get('gameover-8bit');

  if (!music) {
    music = scene.sound.add('gameover-8bit', {
      loop: true,
      volume: 0.28
    });
  }

  if (!music.isPlaying) {
    music.play();
  }
}

function stopGameOverMusic(scene) {
  const music = scene.sound.get('gameover-8bit');
  if (music && music.isPlaying) {
    music.stop();
  }
}

function playSoundEffect(scene, key, config = {}) {
  const defaultConfig = { volume: 0.55 };
  scene.sound.play(key, { ...defaultConfig, ...config });
}

function addPixelCloud(scene, x, y, scale = 1, alpha = 0.6) {
  const cloud = scene.add.container(x, y).setAlpha(alpha);
  cloud.add(scene.add.rectangle(0, 12, 95 * scale, 22 * scale, 0xffffff));
  cloud.add(scene.add.rectangle(-32 * scale, 0, 38 * scale, 32 * scale, 0xffffff));
  cloud.add(scene.add.rectangle(4 * scale, -8 * scale, 52 * scale, 40 * scale, 0xffffff));
  cloud.add(scene.add.rectangle(40 * scale, 3 * scale, 42 * scale, 28 * scale, 0xffffff));
  return cloud;
}

class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    stopGameOverMusic(this);
    this.cameras.main.setBackgroundColor('#9fe7ff');

    const sun = this.add.circle(760, 80, 44, 0xfff59d, 0.85);
    this.tweens.add({
      targets: sun,
      scale: 1.08,
      alpha: 1,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.menuClouds = [
      addPixelCloud(this, 120, 92, 0.72, 0.45),
      addPixelCloud(this, 430, 80, 0.58, 0.38),
      addPixelCloud(this, 690, 135, 0.8, 0.36)
    ];

    this.ground = this.add.tileSprite(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, GROUND_HEIGHT, 'ground');

    this.titleText = this.add.text(GAME_WIDTH / 2, 82, 'DINO RUN', {
      fontSize: '62px',
      fontFamily: 'Arial',
      color: '#263238',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.titleText,
      y: 92,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const menuDino = this.add.sprite(GAME_WIDTH / 2, 214, 'dino-run');
    menuDino.setScale(2.05);
    menuDino.play('dino-run');
    this.tweens.add({
      targets: menuDino,
      y: 204,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const coinA = this.add.sprite(GAME_WIDTH / 2 - 150, 203, 'coin-spin').setScale(1.35);
    const coinB = this.add.sprite(GAME_WIDTH / 2 + 150, 203, 'coin-spin').setScale(1.35);
    coinA.play('coin-spin');
    coinB.play('coin-spin');
    this.tweens.add({ targets: coinA, y: 188, duration: 650, yoyo: true, repeat: -1 });
    this.tweens.add({ targets: coinB, y: 220, duration: 650, yoyo: true, repeat: -1 });

    this.add.text(GAME_WIDTH / 2, 286, 'Ambil koin untuk menambah skor. Hindari kaktus!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#263238'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 322, 'Kontrol: SPACE / panah atas / klik layar untuk lompat', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#37474f'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 350, 'Tekan M saat bermain untuk mute / unmute backsound', {
      fontSize: '17px',
      fontFamily: 'Arial',
      color: '#455a64'
    }).setOrigin(0.5);

    this.startButton = this.add.text(GAME_WIDTH / 2, 394, 'MULAI GAME', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#2e7d32',
      padding: { x: 28, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.startButton,
      scale: 1.06,
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.startButton.on('pointerover', () => this.startButton.setStyle({ backgroundColor: '#43a047' }));
    this.startButton.on('pointerout', () => this.startButton.setStyle({ backgroundColor: '#2e7d32' }));
    this.startButton.on('pointerdown', () => this.startGame());

    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
  }

  update(time, delta) {
    const dt = delta / 1000;
    this.ground.tilePositionX += 170 * dt;

    this.menuClouds.forEach((cloud, index) => {
      cloud.x -= (18 + index * 8) * dt;
      if (cloud.x < -120) cloud.x = GAME_WIDTH + 120;
    });
  }

  startGame() {
    startBackgroundMusic(this);
    this.cameras.main.fadeOut(280, 255, 255, 255);
    this.time.delayedCall(280, () => this.scene.start('GameScene'));
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.isGameOver = false;
    this.score = 0;
    this.gameSpeed = 280;

    this.cameras.main.setBackgroundColor('#aee9ff');

    this.skyObjects = [
      addPixelCloud(this, 160, 90, 0.7, 0.55),
      addPixelCloud(this, 480, 72, 0.48, 0.42),
      addPixelCloud(this, 710, 125, 0.82, 0.38)
    ];

    this.add.text(20, 18, 'Dino Run', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#263238',
      fontStyle: 'bold'
    });

    this.scoreText = this.add.text(20, 52, 'Skor: 0', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#263238'
    });

    this.instructionText = this.add.text(GAME_WIDTH - 20, 24, 'SPACE / ↑ / Klik = Lompat | M = Musik', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#37474f'
    }).setOrigin(1, 0);

    // Satu-satunya visual tanah. Collider tanah dibuat dari rectangle invisible,
    // sehingga ground tidak tampil dobel atau bertumpuk.
    this.ground = this.add.tileSprite(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, GROUND_HEIGHT, 'ground');
    this.groundCollider = this.add.rectangle(GAME_WIDTH / 2, GROUND_TOP + 18, GAME_WIDTH, 36, 0x000000, 0);
    this.physics.add.existing(this.groundCollider, true);

    this.player = this.physics.add.sprite(120, 335, 'dino-run');
    this.player.setScale(1.25);
    this.player.setGravityY(950);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(38, 45).setOffset(12, 15);
    this.player.play('dino-run');

    this.physics.add.collider(this.player, this.groundCollider);

    this.coins = this.physics.add.group({ allowGravity: false, immovable: true });
    this.obstacles = this.physics.add.group({ allowGravity: false, immovable: true });

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.input.on('pointerdown', () => this.jump());

    this.coinTimer = this.time.addEvent({
      delay: 1050,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    this.obstacleTimer = this.time.addEvent({
      delay: 1650,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    this.speedTimer = this.time.addEvent({
      delay: 4000,
      callback: () => {
        this.gameSpeed += 18;
      },
      loop: true
    });

    startBackgroundMusic(this);
  }

  update(time, delta) {
    if (this.isGameOver) return;

    const dt = delta / 1000;
    this.ground.tilePositionX += this.gameSpeed * dt;

    this.skyObjects.forEach((cloud, index) => {
      cloud.x -= (12 + index * 6) * dt;
      if (cloud.x < -120) cloud.x = GAME_WIDTH + 120;
    });

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jump();
    }

    if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
      const music = this.sound.get('bgm-8bit');
      if (music) music.setMute(!music.mute);
    }

    const isOnGround = this.player.body.blocked.down || this.player.body.touching.down;
    if (isOnGround) {
      this.player.play('dino-run', true);
    } else {
      this.player.setFrame(1);
    }

    this.updateMovingObjects(this.coins);
    this.updateMovingObjects(this.obstacles);
  }

  jump() {
    if (this.isGameOver) return;

    const isOnGround = this.player.body.blocked.down || this.player.body.touching.down;

    if (isOnGround) {
      this.player.setVelocityY(-545);
      this.tweens.add({
        targets: this.player,
        angle: -6,
        duration: 130,
        yoyo: true,
        ease: 'Sine.easeOut'
      });
    }
  }

  spawnCoin() {
    if (this.isGameOver) return;

    const y = Phaser.Math.Between(210, 300);
    const coin = this.coins.create(GAME_WIDTH + 40, y, 'coin-spin');
    coin.setScale(1.1);
    coin.body.setAllowGravity(false);
    coin.body.setSize(20, 20).setOffset(6, 6);
    coin.setVelocityX(-this.gameSpeed);
    coin.play('coin-spin');

    this.tweens.add({
      targets: coin,
      y: y - 16,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    const cactus = this.obstacles.create(GAME_WIDTH + 50, 361, 'cactus');
    cactus.setScale(1.05);
    cactus.body.setAllowGravity(false);
    cactus.body.setSize(30, 58).setOffset(9, 10);
    cactus.setVelocityX(-this.gameSpeed);
  }

  updateMovingObjects(group) {
    group.children.iterate((child) => {
      if (!child || !child.body) return;
      child.setVelocityX(-this.gameSpeed);

      if (child.x < -80) {
        child.destroy();
      }
    });
  }

  collectCoin(player, coin) {
    playSoundEffect(this, 'sfx-coin', { volume: 0.62 });

    const popup = this.add.text(coin.x, coin.y - 8, '+10', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#f57f17',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: popup.y - 35,
      alpha: 0,
      duration: 560,
      onComplete: () => popup.destroy()
    });

    coin.destroy();
    this.score += 10;
    this.scoreText.setText('Skor: ' + this.score);

    this.tweens.add({
      targets: this.scoreText,
      scale: 1.15,
      duration: 90,
      yoyo: true
    });
  }

  hitObstacle() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    playSoundEffect(this, 'sfx-hit', { volume: 0.72 });
    this.physics.pause();
    this.player.anims.stop();
    this.player.setTint(0xff7961);

    this.coinTimer.remove(false);
    this.obstacleTimer.remove(false);
    this.speedTimer.remove(false);

    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(180, 255, 92, 92);

    this.time.delayedCall(520, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    startGameOverMusic(this);
    this.cameras.main.setBackgroundColor('#263238');

    const stars = [];
    for (let i = 0; i < 42; i++) {
      const star = this.add.rectangle(
        Phaser.Math.Between(20, GAME_WIDTH - 20),
        Phaser.Math.Between(20, GAME_HEIGHT - 20),
        Phaser.Math.Between(2, 5),
        Phaser.Math.Between(2, 5),
        0xfff8e1,
        Phaser.Math.FloatBetween(0.18, 0.55)
      );
      stars.push(star);
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.65, 1),
        duration: Phaser.Math.Between(450, 1000),
        yoyo: true,
        repeat: -1
      });
    }

    const panel = this.add.rectangle(GAME_WIDTH / 2, 232, 600, 310, 0x37474f, 0.92)
      .setStrokeStyle(5, 0xffcc80)
      .setScale(0.75)
      .setAlpha(0);

    this.tweens.add({
      targets: panel,
      scale: 1,
      alpha: 1,
      duration: 420,
      ease: 'Back.easeOut'
    });

    const sadDino = this.add.sprite(GAME_WIDTH / 2, 122, 'dino-run').setScale(1.55).setFrame(0);
    sadDino.setAngle(-8).setAlpha(0);
    this.tweens.add({
      targets: sadDino,
      alpha: 1,
      y: 140,
      duration: 380,
      ease: 'Back.easeOut'
    });
    this.tweens.add({
      targets: sadDino,
      angle: 8,
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const gameOverText = this.add.text(GAME_WIDTH / 2, 202, 'GAME OVER', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#ffcc80',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScale(0.85).setAlpha(0);

    this.tweens.add({
      targets: gameOverText,
      scale: 1,
      alpha: 1,
      duration: 360,
      delay: 150,
      ease: 'Back.easeOut'
    });

    const scoreText = this.add.text(GAME_WIDTH / 2, 272, 'Skor Akhir: 0', {
      fontSize: '34px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    const scoreCounter = { value: 0 };
    this.tweens.add({
      targets: scoreCounter,
      value: this.finalScore,
      duration: 700,
      ease: 'Cubic.easeOut',
      onUpdate: () => scoreText.setText('Skor Akhir: ' + Math.floor(scoreCounter.value))
    });

    const menuButton = this.add.text(GAME_WIDTH / 2, 352, 'KEMBALI KE MENU AWAL', {
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#1565c0',
      padding: { x: 24, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);

    this.tweens.add({
      targets: menuButton,
      alpha: 1,
      y: 342,
      duration: 420,
      delay: 300,
      ease: 'Back.easeOut'
    });

    this.tweens.add({
      targets: menuButton,
      scale: 1.05,
      duration: 680,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    menuButton.on('pointerover', () => menuButton.setStyle({ backgroundColor: '#1e88e5' }));
    menuButton.on('pointerout', () => menuButton.setStyle({ backgroundColor: '#1565c0' }));
    menuButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(260, 38, 50, 56);
      this.time.delayedCall(260, () => this.scene.start('StartScene'));
    });
  }
}

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('dino', 'assets/dino.png');
    this.load.spritesheet('dino-run', 'assets/dino-run.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('coin', 'assets/coin.png');
    this.load.spritesheet('coin-spin', 'assets/coin-spin.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('cactus', 'assets/cactus.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.audio('bgm-8bit', 'assets/bgm-8bit.wav');
    this.load.audio('sfx-coin', 'assets/sfx-coin.wav');
    this.load.audio('sfx-hit', 'assets/sfx-hit.wav');
    this.load.audio('gameover-8bit', 'assets/gameover-8bit.wav');
  }

  create() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNumbers('dino-run', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNumbers('coin-spin', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    this.scene.start('StartScene');
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, StartScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
