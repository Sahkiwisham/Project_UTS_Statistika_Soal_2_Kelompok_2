# Kalkulator Probabilitas

Aplikasi web statis interaktif untuk mempelajari dan menghitung probabilitas dasar, probabilitas bersyarat, serta Teorema Bayes.

---

# Anggota :
- William Christian Kurniawan - 2503010023
- M. Sahki Wisham Fauzan - 2503010033
- Nurul Arip Mauludin - 2503010027
- Melani Nurul Fitriani - 25030100
- Nenny Maryani - 25030100

---

## Fitur

- **Modul A — Probabilitas Dasar**
  - Komplemen, irisan, dan gabungan kejadian.
  - Dukungan kejadian saling lepas, independen, dan umum.
  - Diagram Venn interaktif.
- **Modul B — Probabilitas Bersyarat & Teorema Bayes**
  - Perhitungan `P(A|B)` dan `P(B|A)`.
  - Klasifikasi biner dengan Teorema Bayes.
  - Simulasi frekuensi alami untuk 10.000 kasus.
  - Preset studi kasus phishing, medis, dan pabrik.
- Mode gelap permanen dan tampilan responsif.
- Halaman gabungan dengan navigasi berbasis tab.

## Struktur Folder

```text
.
├── index.html                 # Halaman beranda
├── README.md
├── pages/
│   ├── modul-a.html           # Halaman Modul A
│   ├── modul-b.html           # Halaman Modul B
│   └── probabilitas.html      # Halaman gabungan kedua modul
└── assets/
    ├── css/
    │   └── style.css          # Gaya aplikasi
    └── js/
        ├── main.js            # Inisialisasi dan event listener
        ├── modul-a.js         # Logika Modul A
        ├── modul-b-bayes.js   # Logika Teorema Bayes
        ├── modul-b-conditional.js
        └── utils.js           # Helper format, parsing, dan toast
```

## Menjalankan Aplikasi

Karena aplikasi ini tidak membutuhkan proses build, aplikasi dapat dibuka langsung dengan membuka `index.html` di browser.

Untuk hasil yang lebih konsisten, jalankan server HTTP lokal dari folder proyek, misalnya:

```bash
python -m http.server 8000
```

Kemudian buka <http://localhost:8000>.

## Teknologi

- HTML5
- CSS3
- JavaScript ES6+
- Tailwind CSS melalui CDN
- KaTeX melalui CDN untuk tampilan rumus matematika

## Catatan

Aplikasi menggunakan aset CDN, sehingga koneksi internet diperlukan untuk memuat Tailwind CSS, KaTeX, dan Google Fonts.
