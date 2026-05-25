var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneGameOver" });
    },

    init: function (data) {
        this.finalScore = data.score || gameScore || 0;
        this.finalHighScore = data.highScore || highScore || 0;
    },

    preload: function () {
        this.load.setBaseURL('assets/');

        this.load.image("BGPlay", "images/BGPlay.png");
        this.load.image("ButtonPlay", "images/ButtonPlay.png");
        this.load.audio("snd_gameover", "audio/music_gameover.mp3");
        this.load.audio("snd_touchshooter", "audio/fx_touch.mp3");
    },

    create: function () {
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPlay");

        if (this.finalScore > this.finalHighScore) {
            this.finalHighScore = this.finalScore;
            highScore = this.finalHighScore;
            localStorage['high_score'] = this.finalHighScore;
        }

        this.snd_gameover = this.sound.add("snd_gameover", {
            volume: isSoundEnabled() ? 0.5 : 0
        });

        if (snd_touch == null) {
            snd_touch = this.sound.add("snd_touchshooter");
        }

        snd_touch.setVolume(isSoundEnabled() ? 1 : 0);

        if (isSoundEnabled()) {
            this.snd_gameover.play();
        }

        this.add.text(
            X_POSITION.CENTER,
            Y_POSITION.CENTER - 260,
            "Game Over",
            {
                fontFamily: "Verdana, Arial",
                fontSize: "70px",
                color: "#ff0000",
                stroke: "#ffffff",
                strokeThickness: 8
            }
        ).setOrigin(0.5).setDepth(100);

        this.add.text(
            X_POSITION.CENTER,
            Y_POSITION.CENTER - 150,
            "High Score: " + this.finalHighScore,
            {
                fontFamily: "Verdana, Arial",
                fontSize: "38px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5).setDepth(100);

        this.add.text(
            X_POSITION.CENTER,
            Y_POSITION.CENTER - 60,
            "Score: " + this.finalScore,
            {
                fontFamily: "Verdana, Arial",
                fontSize: "38px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5).setDepth(100);

        var buttonPlay = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER + 100,
            "ButtonPlay"
        );

        buttonPlay.setScale(0.9);
        buttonPlay.setInteractive();
        buttonPlay.setDepth(100);

        this.input.on("gameobjectover", function(pointer, gameObject){
            if(gameObject == buttonPlay){
                buttonPlay.setTint(0x999999);
            }
        }, this);

        this.input.on("gameobjectout", function(pointer, gameObject){
            if(gameObject == buttonPlay){
                buttonPlay.setTint(0xffffff);
            }
        }, this);

        this.input.on("gameobjectdown", function(pointer, gameObject){
            if(gameObject == buttonPlay){
                buttonPlay.setTint(0x999999);
            }
        }, this);

        this.input.on("gameobjectup", function(pointer, gameObject){
            if(gameObject == buttonPlay){
                buttonPlay.setTint(0xffffff);
                snd_touch.play();

                if (this.snd_gameover && this.snd_gameover.isPlaying) {
                    this.snd_gameover.stop();
                }

                this.scene.start("scenePilihHero");
            }
        }, this);
    },

    update: function () {},
});
