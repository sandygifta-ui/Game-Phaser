var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function(){
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init(){},

    preload(){

        //load image
        this.load.image('bg_start', 'assets/images/bg_start.png');
        this.load.image('btn_play', 'assets/images/btn_play.png');
        this.load.image('title_game', 'assets/images/title_game.png');
        this.load.image('panel_skor', 'assets/images/panel_skor.png');

        //load audio
        this.load.audio('snd_ambience', 'assets/audio/ambience.mp3');
        this.load.audio('snd_touch', 'assets/audio/touch.mp3');
        this.load.audio('snd_transisi_menu', 'assets/audio/transisi_menu.mp3');

        //load sprite
        this.load.spritesheet(
            'sps_mummy',
            'sprite/mummy37x45.png',
            {
                frameWidth: 37,
                frameHeight: 45
            }
        );
    },

    create: function () {

        //================ POSISI GLOBAL =================

        X_POSITION = {
            LEFT: 0,
            CENTER: game.canvas.width / 2,
            RIGHT: game.canvas.width,
        };

        Y_POSITION = {
            TOP: 0,
            CENTER: game.canvas.height / 2,
            BOTTOM: game.canvas.height,
        };

        //================ SOUND =================

        //musik ambience
        if(snd_ambience == null){

            snd_ambience = this.sound.add('snd_ambience');

            snd_ambience.loop = true;

            snd_ambience.setVolume(0.35);

            snd_ambience.play();
        }

        //sound lain
        this.snd_touch = this.sound.add('snd_touch');

        var snd_transisi =
        this.sound.add('snd_transisi_menu');

        //================ HIGHSCORE =================

        var skorTertinggi =
        localStorage["highscore"] || 0;

        //================ BACKGROUND =================

        this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER,
            'bg_start'
        );

        //================ BUTTON PLAY =================

        var btnPlay = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER + 75,
            'btn_play'
        );

        btnPlay.setDepth(10);

        //scale awal
        btnPlay.setScale(0);

        //================ TITLE GAME =================

        this.titleGame = this.add.image(
            X_POSITION.CENTER,
            200,
            'title_game'
        );

        this.titleGame.setDepth(10);

        //mengurangi posisi y title
        this.titleGame.y -= 384;

        //scale awal title
        this.titleGame.setScale(0);

        //================ PANEL SCORE =================

        var panelSkor = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.BOTTOM - 120,
            'panel_skor'
        );

        panelSkor.setOrigin(0.5);

        panelSkor.setDepth(10);

        panelSkor.setAlpha(0.8);

        //================ LABEL SCORE =================

        var lblSkor = this.add.text(
            panelSkor.x + 25,
            panelSkor.y,
            "High Score : " + skorTertinggi
        );

        lblSkor.setOrigin(0.5);

        lblSkor.setDepth(10);

        lblSkor.setFontSize(30);

        lblSkor.setTint(0xff732e);

        //================ OBJECT THIS =================

        var diz = this;

        //================ ANIMASI TITLE =================

        this.tweens.add({

            targets: diz.titleGame,

            ease: 'Bounce.easeOut',

            duration: 750,

            delay: 250,

            y: 200,

            onComplete: function(){

                snd_transisi.play();
            }
        });

        //animasi scale tombol play
        this.tweens.add({

            targets: btnPlay,

            ease: 'Back',

            duration: 500,

            delay: 750,

            scaleX: 1,

            scaleY: 1
        });

        //animasi title membesar
        this.tweens.add({

            targets: diz.titleGame,

            ease: 'Elastic',

            duration: 750,

            delay: 1000,

            scaleX: 1,

            scaleY: 1
        });

        //================ STATUS BUTTON =================

        var btnClicked = false;

        //================ POINTER OVER =================

        this.input.on(
            'gameobjectover',

            function(pointer, gameObject){

                console.log('Scene Menu | Object Over');

                if(btnClicked) return;

                if(gameObject == btnPlay){

                    btnPlay.setTint(0x616161);
                }

            }, this
        );

        //================ POINTER OUT =================

        this.input.on(
            'gameobjectout',

            function(pointer, gameObject){

                console.log('Scene Menu | Object Out');

                if(btnClicked) return;

                if(gameObject == btnPlay){

                    btnPlay.setTint(0xffffff);

                    btnClicked = true;
                }

            }, this
        );

        //================ POINTER DOWN =================

        this.input.on(
            'gameobjectdown',

            function(pointer, gameObject){

                console.log('Scene Menu | Object Click');

                if(gameObject == btnPlay){

                    btnPlay.setTint(0x616161);

                    btnClicked = true;
                }

            }, this
        );

        //================ POINTER UP OBJECT =================

        this.input.on(
            'gameobjectup',

            function(pointer, gameObject){

                console.log(
                    'Scene Menu | Object End Click'
                );

                if(gameObject == btnPlay){

                    btnPlay.setTint(0xffffff);

                    this.scene.start('scenePlay');

                    this.snd_touch.play();
                }

            }, this
        );

        //================ POINTER UP =================

        this.input.on(
            'pointerup',

            function(pointer, gameObject){

                console.log(
                    'Scene Menu | Mouse Up'
                );

                btnClicked = false;

            }, this
        );

        //aktifkan interaksi tombol
        btnPlay.setInteractive();
    },

    update(){}

});