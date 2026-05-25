var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init: function () {},

    preload: function () {
        this.load.setBaseURL('assets/');

        this.load.image("BGPlay", "images/BGPlay.png");
        this.load.image("Title", "images/Title.png");
        this.load.image("ButtonPlay", "images/ButtonPlay.png");
        this.load.image("ButtonSoundOn", "images/ButtonSoundOn.png");
        this.load.image("ButtonSoundOff", "images/ButtonSoundOff.png");
        this.load.image("ButtonMusicOn", "images/ButtonMusicOn.png");
        this.load.image("ButtonMusicOff", "images/ButtonMusicOff.png");

        this.load.audio("snd_menu", "audio/music_menu.mp3");
        this.load.audio("snd_touchshooter", "audio/fx_touch.mp3");
    },

    create: function () {
        X_POSITION = {
            LEFT: 0,
            CENTER: game.canvas.width / 2,
            RIGHT: game.canvas.width
        };

        Y_POSITION = {
            TOP: 0,
            CENTER: game.canvas.height / 2,
            BOTTOM: game.canvas.height
        };

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPlay");

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, "Title");

        var buttonPlay = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER + 150,
            "ButtonPlay"
        );

        var buttonSound = this.add.image(
            X_POSITION.RIGHT - 70,
            Y_POSITION.BOTTOM - 70,
            "ButtonSoundOn"
        );

        buttonPlay.setInteractive();
        buttonSound.setInteractive();

        if (snd_touch == null) {
            snd_touch = this.sound.add("snd_touchshooter");
        }

        // Cegah audio music_menu dobel saat sceneMenu dibuat ulang
        // Hentikan semua instance lama dengan key snd_menu sebelum membuat/memakai yang baru.
        this.sound.stopByKey("snd_menu");

        if (snd_menu_global == null) {
            snd_menu_global = this.sound.add("snd_menu", {
                loop: true,
                volume: isSoundEnabled() ? 0.5 : 0
            });
        }

        this.snd_menu = snd_menu_global;

        buttonSound.setTexture(isSoundEnabled() ? "ButtonSoundOn" : "ButtonSoundOff");
        snd_touch.setVolume(isSoundEnabled() ? 1 : 0);
        this.snd_menu.setVolume(isSoundEnabled() ? 0.5 : 0);

        if (isSoundEnabled() && !this.snd_menu.isPlaying) {
            this.snd_menu.play();
        }

        this.input.on("gameobjectover", function (pointer, gameObject) {
            if (gameObject == buttonPlay) {
                buttonPlay.setTint(0x999999);
            }

            if (gameObject == buttonSound) {
                buttonSound.setTint(0x999999);
            }
        }, this);

        this.input.on("gameobjectout", function (pointer, gameObject) {
            if (gameObject == buttonPlay) {
                buttonPlay.setTint(0xffffff);
            }

            if (gameObject == buttonSound) {
                buttonSound.setTint(0xffffff);
            }
        }, this);

        this.input.on("gameobjectdown", function (pointer, gameObject) {
            if (gameObject == buttonSound) {
                buttonSound.setTint(0x999999);
            }
        }, this);

        this.input.on("gameobjectup", function (pointer, gameObject) {
            if (gameObject == buttonPlay) {
                buttonPlay.setTint(0xffffff);
                snd_touch.play();

                if (this.snd_menu && this.snd_menu.isPlaying) {
                    this.snd_menu.stop();
                }

                this.scene.start("scenePilihHero");
            }

            if (gameObject == buttonSound) {
                if (isSoundEnabled()) {
                    localStorage["sound_enabled"] = 0;
                    buttonSound.setTexture("ButtonSoundOff");
                    snd_touch.setVolume(0);
                    this.snd_menu.setVolume(0);
                    if (this.snd_menu.isPlaying) {
                        this.snd_menu.stop();
                    }
                } else {
                    localStorage["sound_enabled"] = 1;
                    buttonSound.setTexture("ButtonSoundOn");
                    snd_touch.setVolume(1);
                    this.snd_menu.setVolume(0.5);
                    if (!this.snd_menu.isPlaying) {
                        this.snd_menu.play();
                    }
                }

                buttonSound.setTint(0xffffff);
            }
        }, this);
    },

    update: function () {},
});
