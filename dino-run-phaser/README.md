# Dino Run Phaser

Game endless runner sederhana menggunakan Phaser 3 dengan animasi player, animasi menu, animasi game over, koin, rintangan, skor, backsound 8-bit, dan efek suara 8-bit.

## Fitur
- Tampilan awal / menu utama dengan animasi judul, dino, koin, awan, dan tanah berjalan.
- Gameplay endless run.
- Dino memiliki animasi lari menggunakan sprite sheet `dino-run.png`.
- Dino melompat menggunakan SPACE, panah atas, atau klik layar.
- Koin beranimasi spin dan menambah skor.
- Kaktus sebagai rintangan.
- Ground sudah diperbaiki agar tidak bertumpuk: visual ground hanya menggunakan `tileSprite`, sedangkan collider memakai rectangle transparan.
- Game Over menampilkan animasi panel, dino, teks, dan skor akhir.
- Tombol kembali ke menu awal.
- Backsound 8-bit original dari file `bgm-8bit.wav` saat gameplay.
- Efek suara koin dari file `sfx-coin.wav`.
- Efek suara hit/kaktus dari file `sfx-hit.wav`.
- Backsound khusus tampilan game over dari file `gameover-8bit.wav`.
- Tombol `M` saat bermain untuk mute / unmute musik.

## Struktur Folder
```text
dino-run-phaser/
├─ index.html
├─ style.css
├─ README.md
├─ src/
│  └─ main.js
└─ assets/
   ├─ dino.png
   ├─ dino-run.png
   ├─ coin.png
   ├─ coin-spin.png
   ├─ cactus.png
   ├─ ground.png
   ├─ bgm-8bit.wav
   ├─ sfx-coin.wav
   ├─ sfx-hit.wav
   └─ gameover-8bit.wav
```

## Cara Menjalankan di VS Code dengan Live Server
1. Ekstrak file ZIP.
2. Buka folder `dino-run-phaser` di Visual Studio Code.
3. Install extension **Live Server** jika belum ada.
4. Klik kanan file `index.html`.
5. Pilih **Open with Live Server**.
6. Browser akan terbuka dan game bisa dimainkan.
7. Klik tombol **MULAI GAME**. Musik akan aktif setelah interaksi pertama dengan user karena browser biasanya membatasi autoplay audio.

## Kontrol Game
- `SPACE` = Lompat
- `Panah Atas` = Lompat
- `Klik layar` = Lompat
- `M` = Mute / unmute backsound


## Audio yang Ditambahkan
- Saat player mengambil koin, fungsi `collectCoin()` memanggil `playSoundEffect(this, 'sfx-coin')`.
- Saat player menabrak kaktus, fungsi `hitObstacle()` memanggil `playSoundEffect(this, 'sfx-hit')`.
- Saat masuk `GameOverScene`, musik gameplay dihentikan dan diganti dengan `gameover-8bit.wav`.

## Bagian Coding Penting
File utama ada di:

```text
src/main.js
```

Scene yang digunakan:

```javascript
BootScene      // preload aset dan membuat animasi global
StartScene     // tampilan awal game
GameScene      // gameplay utama
GameOverScene  // tampilan game over
```

## Cara Kerja Animasi Player
Aset `dino-run.png` adalah sprite sheet berisi 4 frame. Animasi dibuat di `BootScene`:

```javascript
this.anims.create({
  key: 'dino-run',
  frames: this.anims.generateFrameNumbers('dino-run', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1
});
```

Lalu dijalankan pada player:

```javascript
this.player.play('dino-run');
```

## Catatan Phaser CDN
Project ini menggunakan Phaser dari CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>
```

Jadi perangkat perlu koneksi internet saat pertama kali menjalankan game agar library Phaser dapat dimuat.
