var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePlay" });
    },

    init: function () {},

    preload: function () {
        this.load.setBaseURL('assets/');

        this.load.image("BG1", "images/BG1.png");
        this.load.image("BG2", "images/BG2.png");
        this.load.image("BG3", "images/BG3.png");
        this.load.image("GroundTransisi", "images/Transisi.png");
        this.load.image("Pesawat1", "images/Pesawat1.png");
        this.load.image("Pesawat2", "images/Pesawat2.png");
        this.load.image("Peluru", "images/Peluru.png");
        this.load.image("Efekledakan", "images/Efekledakan.png");
        this.load.image("cloud", "images/cloud.png");
        this.load.image("Musuh1", "images/Musuh1.png");
        this.load.image("Musuh2", "images/Musuh2.png");
        this.load.image("Musuh3", "images/Musuh3.png");
        this.load.image("MusuhBos", "images/MusuhBos.png");

        this.load.audio("snd_shoot", "audio/fx_touch.mp3");
        this.load.audio("snd_explode", "audio/fx_explode.mp3");
        this.load.audio("snd_play", "audio/music_play.mp3");
    },

    create: function () {
        this.isGameOver = false;
        this.scoreValue = 0;
        gameScore = 0;

        // Pastikan musik menu benar-benar berhenti saat masuk gameplay
        this.sound.stopByKey('snd_menu');

        this.snd_shoot = this.sound.add('snd_shoot');
        this.snd_explode = this.sound.add('snd_explode');
        this.snd_play = this.sound.add('snd_play', {
            loop: true,
            volume: isSoundEnabled() ? 0.4 : 0
        });

        this.snd_shoot.setVolume(isSoundEnabled() ? 0.35 : 0);
        this.snd_explode.setVolume(isSoundEnabled() ? 0.7 : 0);

        if (isSoundEnabled()) {
            this.snd_play.play();
        }

        this.lastBgIndex = Phaser.Math.Between(1, 3);
        this.bgBottomSize = { width: 768, height: 1664 };
        this.arrBgBottom = [];

        this.createBgBottom = function (xPos, yPos) {
            let bgBottom = this.add.image(xPos, yPos, 'BG' + this.lastBgIndex);
            bgBottom.setData('kecepatan', 3);
            bgBottom.setDepth(1);
            bgBottom.flipX = Phaser.Math.Between(0, 1);
            this.arrBgBottom.push(bgBottom);

            let newBgIndex = Phaser.Math.Between(1, 3);

            if (newBgIndex != this.lastBgIndex) {
                let bgBottomAddition = this.add.image(
                    xPos,
                    yPos - this.bgBottomSize.height / 2,
                    'GroundTransisi'
                );

                bgBottomAddition.setData('kecepatan', 3);
                bgBottomAddition.setData('tambahan', true);
                bgBottomAddition.setDepth(2);
                bgBottomAddition.flipX = Phaser.Math.Between(0, 1);

                this.arrBgBottom.push(bgBottomAddition);
            }

            this.lastBgIndex = newBgIndex;
        };

        this.addBgBottom = function () {
            if (this.arrBgBottom.length > 0) {
                let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];

                if (lastBG.getData('tambahan')) {
                    lastBG = this.arrBgBottom[this.arrBgBottom.length - 2];
                }

                this.createBgBottom(
                    game.canvas.width / 2,
                    lastBG.y - this.bgBottomSize.height
                );
            } else {
                this.createBgBottom(
                    game.canvas.width / 2,
                    game.canvas.height - this.bgBottomSize.height / 2
                );
            }
        };

        this.addBgBottom();
        this.addBgBottom();
        this.addBgBottom();

        this.bgCloudSize = { width: 768, height: 1962 };
        this.arrBgTop = [];

        this.createBgTop = function (xPos, yPos) {
            var bgTop = this.add.image(xPos, yPos, 'cloud');

            bgTop.setData('kecepatan', 6);
            bgTop.setDepth(5);
            bgTop.flipX = Phaser.Math.Between(0, 1);
            bgTop.setAlpha(Phaser.Math.Between(4, 7) / 10);

            this.arrBgTop.push(bgTop);
        };

        this.addBgTop = function () {
            if (this.arrBgTop.length > 0) {
                let lastBG = this.arrBgTop[this.arrBgTop.length - 1];

                this.createBgTop(
                    game.canvas.width / 2,
                    lastBG.y - this.bgCloudSize.height * Phaser.Math.Between(1, 4)
                );
            } else {
                this.createBgTop(
                    game.canvas.width / 2,
                    -this.bgCloudSize.height
                );
            }
        };

        this.addBgTop();

        this.scoreLabel = this.add.text(
            X_POSITION.CENTER,
            Y_POSITION.TOP + 80,
            '0',
            {
                fontFamily: 'Verdana, Arial',
                fontSize: '70px',
                color: '#ffffff',
                stroke: '#5c5c5c',
                strokeThickness: 2
            }
        );

        this.scoreLabel.setOrigin(0.5);
        this.scoreLabel.setDepth(100);

        this.heroShip = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.BOTTOM - 200,
            'Pesawat' + (currentHero + 1)
        );

        this.heroShip.setDepth(4);
        this.heroShip.setScale(0.35);

        this.cursorKeyListener = this.input.keyboard.createCursorKeys();

        this.input.on('pointermove', function (pointer) {
            if (this.isGameOver) {
                return;
            }

            let movementX = this.heroShip.x;
            let movementY = this.heroShip.y;

            if (pointer.x > 70 && pointer.x < X_POSITION.RIGHT - 70) {
                movementX = pointer.x;
            } else if (pointer.x <= 70) {
                movementX = 70;
            } else {
                movementX = X_POSITION.RIGHT - 70;
            }

            if (pointer.y > 70 && pointer.y < Y_POSITION.BOTTOM - 70) {
                movementY = pointer.y;
            } else if (pointer.y <= 70) {
                movementY = 70;
            } else {
                movementY = Y_POSITION.BOTTOM - 70;
            }

            let a = this.heroShip.x - movementX;
            let b = this.heroShip.y - movementY;
            let durationToMove = Math.sqrt(a * a + b * b) * 0.8;

            this.tweens.add({
                targets: this.heroShip,
                x: movementX,
                y: movementY,
                duration: durationToMove
            });
        }, this);

        let pointA = [];
        pointA.push(new Phaser.Math.Vector2(-200, 100));
        pointA.push(new Phaser.Math.Vector2(250, 200));
        pointA.push(new Phaser.Math.Vector2(200, (Y_POSITION.BOTTOM + 200) / 2));
        pointA.push(new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200));

        let pointB = [];
        pointB.push(new Phaser.Math.Vector2(900, 100));
        pointB.push(new Phaser.Math.Vector2(550, 200));
        pointB.push(new Phaser.Math.Vector2(500, (Y_POSITION.BOTTOM + 200) / 2));
        pointB.push(new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200));

        let pointC = [];
        pointC.push(new Phaser.Math.Vector2(900, 100));
        pointC.push(new Phaser.Math.Vector2(550, 200));
        pointC.push(new Phaser.Math.Vector2(400, (Y_POSITION.BOTTOM + 200) / 2));
        pointC.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        let pointD = [];
        pointD.push(new Phaser.Math.Vector2(-200, 100));
        pointD.push(new Phaser.Math.Vector2(550, 200));
        pointD.push(new Phaser.Math.Vector2(650, (Y_POSITION.BOTTOM + 200) / 2));
        pointD.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        var points = [pointA, pointB, pointC, pointD];

        this.arrEnemies = [];
        this.arrBullets = [];

        var Enemy = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize: function Enemy(scene, idxPath) {
                Phaser.GameObjects.Image.call(this, scene);

                this.setTexture('Musuh' + Phaser.Math.Between(1, 3));
                this.setDepth(4);
                this.setScale(0.35);

                this.curve = new Phaser.Curves.Spline(points[idxPath]);

                this.path = {
                    t: 0,
                    vec: new Phaser.Math.Vector2()
                };

                let enemy = this;

                scene.tweens.add({
                    targets: this.path,
                    t: 1,
                    duration: 3000,
                    onComplete: function () {
                        if (enemy) {
                            enemy.setActive(false);
                            enemy.setVisible(false);
                        }
                    }
                });
            },

            move: function () {
                this.curve.getPoint(this.path.t, this.path.vec);
                this.x = this.path.vec.x;
                this.y = this.path.vec.y;
            }
        });

        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize: function Bullet(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Peluru');

                this.setDepth(3);
                this.setPosition(x, y);
                this.setScale(0.5);
                this.speed = Phaser.Math.GetSpeed(20000, 1);
            },

            move: function () {
                this.y -= this.speed;

                if (this.y < -50) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        });

        this.enemyTimer = this.time.addEvent({
            delay: 250,
            callback: function () {
                if (this.arrEnemies.length < 3 && !this.isGameOver) {
                    let enemy = new Enemy(
                        this,
                        Phaser.Math.Between(0, points.length - 1)
                    );

                    this.children.add(enemy);
                    this.arrEnemies.push(enemy);
                }
            },
            callbackScope: this,
            loop: true
        });

        this.bulletTimer = this.time.addEvent({
            delay: 250,
            callback: function () {
                if (this.isGameOver) {
                    return;
                }

                let bullet = new Bullet(
                    this,
                    this.heroShip.x,
                    this.heroShip.y - 30
                );

                this.children.add(bullet);
                this.arrBullets.push(bullet);
                this.snd_shoot.play();
            },
            callbackScope: this,
            loop: true
        });

        this.emitterExplode1 = this.add.particles(0, 0, 'Efekledakan', {
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 200,
            tint: 0xffa500,
            emitting: false
        });

        this.emitterExplode1.setDepth(10);

        this.emitterExplode2 = this.add.particles(0, 0, 'Efekledakan', {
            speed: { min: -500, max: 500 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 300,
            tint: 0xffffff,
            emitting: false
        });

        this.emitterExplode2.setDepth(10);
    },

    goToGameOver: function () {
        if (this.isGameOver) {
            return;
        }

        this.isGameOver = true;
        gameScore = this.scoreValue;

        if (gameScore > highScore) {
            highScore = gameScore;
            localStorage['high_score'] = highScore;
        }

        if (this.snd_play && this.snd_play.isPlaying) {
            this.snd_play.stop();
        }

        this.snd_explode.play();

        this.time.delayedCall(350, function () {
            this.scene.start('sceneGameOver', {
                score: gameScore,
                highScore: highScore
            });
        }, [], this);
    },

    update: function () {
        if (this.isGameOver) {
            return;
        }

        for (let i = 0; i < this.arrBgBottom.length; i++) {
            this.arrBgBottom[i].y += this.arrBgBottom[i].getData('kecepatan');

            if (this.arrBgBottom[i].y >= game.canvas.height + this.bgBottomSize.height / 2) {
                this.addBgBottom();
                this.arrBgBottom[i].destroy();
                this.arrBgBottom.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < this.arrBgTop.length; i++) {
            this.arrBgTop[i].y += this.arrBgTop[i].getData('kecepatan');

            if (this.arrBgTop[i].y >= game.canvas.height + this.bgCloudSize.height / 2) {
                this.arrBgTop[i].destroy();
                this.arrBgTop.splice(i, 1);
                this.addBgTop();
                break;
            }
        }

        if (this.cursorKeyListener.left.isDown && this.heroShip.x > 70) {
            this.heroShip.x -= 7;
        }

        if (this.cursorKeyListener.right.isDown && this.heroShip.x < X_POSITION.RIGHT - 70) {
            this.heroShip.x += 7;
        }

        if (this.cursorKeyListener.up.isDown && this.heroShip.y > 70) {
            this.heroShip.y -= 7;
        }

        if (this.cursorKeyListener.down.isDown && this.heroShip.y < Y_POSITION.BOTTOM - 70) {
            this.heroShip.y += 7;
        }

        for (let i = 0; i < this.arrEnemies.length; i++) {
            this.arrEnemies[i].move();
        }

        for (let i = 0; i < this.arrBullets.length; i++) {
            this.arrBullets[i].move();
        }

        for (let i = 0; i < this.arrEnemies.length; i++) {
            if (
                this.arrEnemies[i].active &&
                Phaser.Geom.Intersects.RectangleToRectangle(this.heroShip.getBounds(), this.arrEnemies[i].getBounds())
            ) {
                this.emitterExplode1.explode(25, this.heroShip.x, this.heroShip.y);
                this.emitterExplode2.explode(25, this.heroShip.x, this.heroShip.y);
                this.goToGameOver();
                return;
            }
        }

        for (let i = 0; i < this.arrEnemies.length; i++) {
            for (let j = 0; j < this.arrBullets.length; j++) {
                if (
                    this.arrEnemies[i].active &&
                    this.arrBullets[j].active &&
                    this.arrEnemies[i].getBounds().contains(
                        this.arrBullets[j].x,
                        this.arrBullets[j].y
                    )
                ) {
                    this.arrEnemies[i].setActive(false);
                    this.arrEnemies[i].setVisible(false);

                    this.arrBullets[j].setActive(false);
                    this.arrBullets[j].setVisible(false);

                    this.scoreValue++;
                    gameScore = this.scoreValue;
                    this.scoreLabel.setText(this.scoreValue);

                    this.emitterExplode1.explode(
                        20,
                        this.arrBullets[j].x,
                        this.arrBullets[j].y
                    );

                    this.emitterExplode2.explode(
                        20,
                        this.arrBullets[j].x,
                        this.arrBullets[j].y
                    );

                    this.snd_explode.play();
                    break;
                }
            }
        }

        for (let i = 0; i < this.arrEnemies.length; i++) {
            if (!this.arrEnemies[i].active) {
                this.arrEnemies[i].destroy();
                this.arrEnemies.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < this.arrBullets.length; i++) {
            if (!this.arrBullets[i].active) {
                this.arrBullets[i].destroy();
                this.arrBullets.splice(i, 1);
                break;
            }
        }
    },
});
