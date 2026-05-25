var scenePilihHero = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePilihHero" });
    },

    init: function () {},

    preload: function () {
        this.load.setBaseURL('assets/');

        this.load.image("BGPilihPesawat", "images/BGPilihPesawat.png");
        this.load.image("ButtonMenu", "images/ButtonMenu.png");
        this.load.image("ButtonNext", "images/ButtonNext.png");
        this.load.image("ButtonPrev", "images/ButtonPrev.png");

        this.load.image("Pesawat1", "images/Pesawat1.png");
        this.load.image("Pesawat2", "images/Pesawat2.png");
        this.load.audio("snd_touchshooter", "audio/fx_touch.mp3");
    },

    create: function () {
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat');

        var buttonMenu = this.add.image(50, 50, 'ButtonMenu');
        var buttonNext = this.add.image(X_POSITION.CENTER + 250, Y_POSITION.CENTER, 'ButtonNext');
        var buttonPrevious = this.add.image(X_POSITION.CENTER - 250, Y_POSITION.CENTER, 'ButtonPrev');
        var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1));

        buttonMenu.setInteractive();
        buttonNext.setInteractive();
        buttonPrevious.setInteractive();
        heroShip.setInteractive();

        if (snd_touch == null) {
            snd_touch = this.sound.add("snd_touchshooter");
        }
        snd_touch.setVolume(isSoundEnabled() ? 1 : 0);

        this.input.on('gameobjectover', function(pointer, gameObject){
            if(gameObject == buttonMenu){ buttonMenu.setTint(0x999999); }
            if(gameObject == buttonNext){ buttonNext.setTint(0x999999); }
            if(gameObject == buttonPrevious){ buttonPrevious.setTint(0x999999); }
            if(gameObject == heroShip){ heroShip.setTint(0x999999); }
        }, this);

        this.input.on('gameobjectdown', function(pointer, gameObject){
            if(gameObject == buttonMenu){ buttonMenu.setTint(0x999999); }
            if(gameObject == buttonNext){ buttonNext.setTint(0x999999); }
            if(gameObject == buttonPrevious){ buttonPrevious.setTint(0x999999); }
            if(gameObject == heroShip){ heroShip.setTint(0x999999); }
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject){
            if(gameObject == buttonMenu){ buttonMenu.setTint(0xffffff); }
            if(gameObject == buttonNext){ buttonNext.setTint(0xffffff); }
            if(gameObject == buttonPrevious){ buttonPrevious.setTint(0xffffff); }
            if(gameObject == heroShip){ heroShip.setTint(0xffffff); }
        }, this);

        this.input.on('gameobjectup', function(pointer, gameObject){
            if(gameObject == buttonMenu){
                buttonMenu.setTint(0xffffff);
                snd_touch.play();
                this.scene.start("sceneMenu");
            }

            if(gameObject == buttonNext){
                buttonNext.setTint(0xffffff);
                snd_touch.play();
                currentHero++;
                if(currentHero >= countHero){ currentHero = 0; }
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }

            if(gameObject == buttonPrevious){
                buttonPrevious.setTint(0xffffff);
                snd_touch.play();
                currentHero--;
                if(currentHero < 0){ currentHero = (countHero - 1); }
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }

            if(gameObject == heroShip){
                heroShip.setTint(0xffffff);
                snd_touch.play();
                this.scene.start("scenePlay");
            }
        }, this);
    },

    update: function () {},
});
