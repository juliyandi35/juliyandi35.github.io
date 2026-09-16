# Review Website Portfolio

Tanggal review: 15 September 2026  
Lokasi proyek: `D:\CV dan Daftar Riwayat Hidup`

## Ringkasan Eksekutif

Website mempunyai konsep dan identitas visual yang kuat. Palet warna, tipografi, struktur dasar, Project Atlas, serta fondasi SEO sudah terlihat profesional. Namun, versi saat ini belum siap dipublikasikan karena production build gagal dan animasi depth menimbulkan masalah navigasi, horizontal overflow, keterbacaan, serta graph penutup yang tidak terlihat.

Situs juga lebih terasa sebagai katalog 301 repositori daripada portfolio profesional yang dengan cepat menjelaskan kompetensi, pengalaman, kontribusi, dan dampak pekerjaan.

Penilaian:

| Aspek | Nilai |
|---|---:|
| Identitas visual | 8/10 |
| Strategi konten | 6/10 |
| UX dan navigasi | 4/10 |
| Kesiapan teknis | 4/10 |
| Keseluruhan saat ini | 5,5/10 |

Rekomendasi utama: perbaiki masalah prioritas P0 sebelum melakukan deployment atau push ke repositori publik. Push ke repositori private tetap dapat dilakukan sebagai cadangan dan riwayat pengembangan.

## Ruang Lingkup dan Metode Review

Review dilakukan berdasarkan:

- Pemeriksaan source code Next.js, React, TypeScript, Tailwind CSS, GSAP, dan Three.js.
- Pemeriksaan langsung website melalui server lokal.
- Pengujian tampilan desktop pada viewport 1440 x 900.
- Pengujian tampilan mobile pada viewport sekitar 412 x 823.
- Pemeriksaan alur scroll, tujuan navigasi anchor, Project Atlas, dan graph penutup.
- Unit test, lint, TypeScript check, production build, Lighthouse, dan performance trace.
- Pemeriksaan dasar privasi terhadap data yang akan ikut masuk ke repository.

Tidak ada kode website yang diubah selama proses review.

## Hal yang Sudah Bagus

### 1. Identitas visual kuat dan konsisten

- Palet porcelain, hitam, abu-abu, dan hijau terlihat tenang serta profesional.
- Kombinasi Space Grotesk dan IBM Plex Mono cocok dengan citra riset, statistik, data, dan sistem.
- Penggunaan warna aksen cukup terkendali dan tidak berlebihan.
- Bentuk tombol dan kartu umumnya konsisten.

### 2. Hero menyampaikan positioning dengan cepat

- Headline langsung menjelaskan hubungan antara metode penelitian dan sistem yang bekerja.
- Subheadline menyebut bidang matematika, pemodelan statistik, sistem data, dan applied AI.
- CTA `Explore the work` dan `Contact` mudah dikenali.
- Ringkasan jumlah repositori, keluarga metode, dan aplikasi memberikan bukti kuantitatif sejak awal.

### 3. Project Atlas mempunyai fondasi interaksi yang baik

- Tersedia pencarian, filter, pagination, dan tautan ke repository nyata.
- Filter dapat dikombinasikan.
- Kondisi filter disimpan di URL sehingga hasil dapat dibagikan.
- Jumlah hasil disampaikan menggunakan `aria-live` untuk membantu pengguna screen reader.
- Form mempunyai label yang jelas.

### 4. Fondasi aksesibilitas sudah diperhatikan

- Terdapat satu H1 utama dan struktur heading yang cukup teratur.
- Tersedia skip link menuju konten utama.
- Navigasi menggunakan elemen semantik.
- Tombol menu mobile mempunyai `aria-expanded`, `aria-controls`, dan label yang sesuai.
- Terdapat dukungan `prefers-reduced-motion`.
- Kontrol tab dan graph mempunyai beberapa atribut aksesibilitas yang baik.

### 5. SEO teknis sudah lengkap

Website sudah mempunyai:

- Metadata title dan description.
- Canonical URL.
- Open Graph.
- Twitter card.
- Social preview image.
- JSON-LD tipe `Person`.
- Sitemap.
- Robots configuration.
- Font yang disimpan secara lokal.

Domain pada `metadataBase` tetap perlu dipastikan sama dengan domain deployment final.

### 6. Sejumlah pemeriksaan teknis sudah lulus

- ESLint: lulus tanpa warning atau error.
- Unit test: 40 test lulus dari 4 test file.
- Lighthouse Best Practices: 100.
- Lighthouse SEO: 100.
- Lighthouse Agentic Browsing: 100.
- Lighthouse Accessibility: 97.
- Local performance trace mencatat LCP 896 ms dan CLS 0,00.

Angka performa tersebut berasal dari server lokal tanpa network throttling dan bukan data pengguna nyata, sehingga tidak boleh dianggap sebagai hasil produksi final.

## Masalah Kritis

### P0-1. Production build gagal

Production build berhasil melewati kompilasi awal, tetapi gagal pada pemeriksaan TypeScript:

```text
components/Trajectory.tsx(127,21): error TS2322:
Type 'HTMLLIElement | null' is not assignable to type 'HTMLDivElement | null'.
```

Penyebab:

- `markerRefs` didefinisikan sebagai array `HTMLDivElement`.
- Ref tersebut dipasang pada elemen `<li>`.

Dampak:

- `npm run build` gagal.
- Website belum dapat dideploy melalui alur production build normal.

Saran:

- Ubah tipe ref menjadi `HTMLLIElement`.
- Jika `markerRefs` tidak pernah dipakai untuk logika apa pun, pilihan yang lebih sederhana adalah menghapus ref tersebut.

### P0-2. Animasi depth membuat halaman melebar secara horizontal

Pemeriksaan langsung menemukan horizontal overflow setelah pengguna mulai menggulir:

- Desktop: halaman melebar hingga sekitar 905 px melebihi viewport.
- Mobile: halaman melebar hingga sekitar 241 px melebihi viewport.

Penyebab utama:

- Seluruh section dianimasikan dari `z: -1150` menuju `z: 0`.
- Saat meninggalkan viewport, seluruh section diperbesar menuju `z: 620`.
- Dengan perspective 1100 px, positive Z tersebut memperbesar seluruh layout secara ekstrem.

Dampak:

- Muncul horizontal scrollbar.
- Konten dapat terpotong di kiri atau kanan.
- Posisi anchor menjadi tidak stabil.
- Pengalaman scroll terasa rusak, terutama di mobile.
- Layout yang sebenarnya responsif menjadi terlihat tidak responsif.

Saran utama:

- Hapus animasi keluar menuju `z: 620`.
- Jangan memberikan transformasi 3D pada keseluruhan section yang berisi konten dan anchor.
- Gunakan reveal sederhana dengan opacity dan sedikit `translateY` pada elemen internal.
- Jangan hanya menambahkan `overflow-x: hidden`, karena itu hanya menyembunyikan gejala dan tidak memperbaiki anchor atau keterbacaan.

### P0-3. Navigasi anchor mendarat pada posisi yang salah

Saat menu `Atlas` diklik:

- URL berubah menjadi `#atlas`.
- Bagian Atlas memang masuk viewport.
- Posisi bagian berada sekitar 413 px di atas viewport.
- Pengguna langsung melihat kumpulan project card.
- Judul, deskripsi, jumlah hasil, pencarian, dan filter Atlas terlewat.

Penyebabnya berkaitan dengan transformasi DepthLayer, GSAP ScrollTrigger, dan section yang berubah skala saat browser mencoba menghitung tujuan anchor.

Saran:

- Jangan mentransformasi elemen section yang menjadi tujuan anchor.
- Gunakan animasi pada child visual, bukan wrapper section.
- Tambahkan `scroll-margin-top` sesuai tinggi sticky navigation, sekitar 64-80 px.
- Uji semua menu: Trajectory, Practice, Atlas, Formation, dan Contact.

### P0-4. Graph penutup tidak terlihat

Pada akhir halaman, yang terlihat adalah:

- Latar terang kosong.
- Daftar kontrol aplikasi berwarna abu-abu dengan kontras rendah.
- Tidak ada visualisasi graph yang terlihat.

Canvas sebenarnya ada dan mempunyai ukuran viewport. Masalahnya adalah container canvas menggunakan z-index `-10`, sedangkan `html` dan `body` mempunyai background porcelain yang opaque. Canvas akhirnya berada di belakang background halaman.

GraphStage juga menggunakan tinggi `240vh`. Ketika canvas tidak terlihat, pengunjung harus melewati ruang kosong yang sangat panjang.

Saran:

- Render canvas langsung di dalam GraphStage.
- Berikan GraphStage background gelap secara eksplisit.
- Gunakan layer graph pada `z-index: 0` dan kontrol pada layer yang lebih tinggi.
- Hindari fixed canvas global dengan z-index negatif.
- Jika graph tidak membantu perekrut memahami kompetensi, pindahkan ke halaman eksperimen tersendiri atau hapus dari halaman utama.

### P0-5. Risiko privasi sebelum repository dibuat public

Mengecualikan `cv.pdf` dan `DRH Terbaru.pdf` belum membuat isi repository bebas dari data pribadi.

Source code masih memuat:

- Nomor telepon.
- Alamat email.
- Profil LinkedIn.
- Nama dan detail unit kerja.
- Jabatan dan pangkat.
- Tanggal pengangkatan.
- Riwayat pendidikan dan pelatihan.
- Email yang juga dimasukkan ke JSON-LD.

Saran:

- Tentukan data yang memang disetujui untuk tampil secara publik.
- Pertimbangkan menghapus nomor telepon dan menggunakan email sebagai jalur kontak utama.
- Pertimbangkan meringkas unit kerja dan detail kepegawaian.
- Pastikan repository private jika source lengkap masih diperlukan.
- Lakukan privacy review sekali lagi sebelum deployment publik.

## Kritik Strategi Konten

### 1. Jumlah repositori terlalu mendominasi narasi

Angka 301, 13, dan 16 diulang pada:

- Hero.
- Evidence at Scale.
- Project Atlas.
- Graph penutup.

Pengulangan tersebut membuktikan kuantitas, tetapi belum membuktikan kualitas, tanggung jawab, kompleksitas, atau dampak pekerjaan.

Saran:

- Tampilkan angka tersebut satu kali di hero atau Evidence at Scale.
- Setelah itu, arahkan perhatian pada 3-5 proyek terbaik.
- Gunakan full Atlas sebagai bukti tambahan, bukan inti utama cerita.

### 2. Istilah `projects` dan `repositories` tidak konsisten

Hero menggunakan klaim `301 verified public projects`, sementara bukti yang sebenarnya dihitung adalah public repositories.

Sebuah repository tidak selalu identik dengan sebuah proyek besar. Repository dapat berupa latihan, contoh analisis, versi lanjutan, atau eksperimen kecil.

Saran:

- Gunakan istilah faktual `301 public repositories` untuk hitungan keseluruhan.
- Gunakan istilah `selected projects` hanya untuk proyek yang memang sudah dikurasi dan dijelaskan konteksnya.
- Hindari kata `verified` jika verifikasinya hanya berarti repository terdeteksi saat build.

### 3. Project Atlas muncul terlalu awal

Urutan saat ini secara umum adalah:

1. Hero.
2. Trajectory.
3. Evidence at Scale.
4. Method Map.
5. Selected Investigations.
6. Project Atlas.
7. Professional Timeline.
8. Education.
9. Skills.
10. Contact.
11. Graph.

Pengalaman kerja justru berada setelah katalog besar. Perekrut biasanya ingin memahami peran, pengalaman, kontribusi, dan kompetensi terlebih dahulu.

Urutan yang disarankan:

1. Hero dan positioning.
2. Tiga kompetensi utama.
3. Proyek unggulan.
4. Pengalaman kerja.
5. Keahlian.
6. Pendidikan dan sertifikasi.
7. Project Atlas sebagai bukti tambahan.
8. Contact.
9. Graph opsional atau halaman terpisah.

### 4. Deskripsi proyek terlalu mekanis

Contoh pola saat ini:

> Vecm Eviews applies time series & forecasting in EViews.

Kalimat tersebut hanya mengulang nama proyek, keluarga metode, dan aplikasi. Pembaca belum mengetahui masalah yang diselesaikan, peran, proses, atau hasilnya.

Format case study yang disarankan:

- Masalah atau pertanyaan yang dianalisis.
- Konteks proyek.
- Peran dan tanggung jawab.
- Dataset atau skala data yang aman disebutkan.
- Metode yang dipilih dan alasannya.
- Teknologi yang digunakan.
- Hasil, manfaat, atau artefak yang dihasilkan.
- Tautan repository atau demo.

Contoh perbaikan deskripsi:

> Membangun model VECM untuk menganalisis hubungan jangka panjang dan dinamika jangka pendek antarvariabel deret waktu menggunakan EViews.

Jika hasil nyata bersifat rahasia, jelaskan tujuan, pendekatan, dan jenis output tanpa mengarang angka atau dampak.

### 5. `One example from every method family` masih terlalu panjang

Menampilkan satu proyek untuk setiap 13 keluarga metode tetap menghasilkan section yang panjang. Banyak kartu mempunyai struktur dan bahasa yang hampir sama.

Saran:

- Pilih 4-6 proyek flagship.
- Pastikan proyek terpilih menunjukkan variasi kemampuan, bukan hanya variasi software.
- Sediakan tombol menuju Atlas untuk melihat keseluruhan katalog.

### 6. Bahasa antarmuka tidak konsisten

Website menggunakan:

- Navigasi dan narasi utama berbahasa Inggris.
- Sejumlah kategori metode berbahasa Indonesia.
- Nama jabatan dan institusi campuran Indonesia dan Inggris.

Saran:

- Tentukan audiens utama.
- Untuk perekrut Indonesia, gunakan bahasa Indonesia dengan istilah teknis Inggris yang memang umum.
- Untuk audiens internasional, terjemahkan kategori dan deskripsi secara konsisten ke bahasa Inggris.
- Tambahkan pilihan bahasa hanya jika kedua audiens benar-benar penting. Jangan menambah language switcher jika satu bahasa sudah cukup.

### 7. Positioning profesional terlalu luas

Website ingin menampilkan matematika, statistik, riset, data systems, AI, dan cybersecurity secara bersamaan. Ini menunjukkan breadth, tetapi dapat membuat perekrut sulit memahami posisi utama yang dituju.

Saran:

- Tentukan satu positioning utama.
- Jadikan bidang lain sebagai kemampuan pendukung.
- Contoh arah: `Data and Statistical Systems Practitioner` dengan dukungan applied AI dan security awareness.
- Sesuaikan hero, proyek flagship, dan urutan kompetensi dengan positioning tersebut.

## Kritik Visual dan UI

### 1. Ruang kosong desktop terlalu besar

Pada desktop, hero hanya menggunakan sisi kiri layar, sementara sisi kanan hampir sepenuhnya kosong. Asimetri dapat terlihat premium, tetapi dalam kondisi ini terasa seperti ruang yang belum diisi.

Saran:

- Gunakan grid 5/7 atau 6/6.
- Tempatkan portrait lebih besar, visual proyek, grafik, atau cuplikan dashboard pada sisi kanan.
- Pertahankan whitespace, tetapi berikan fungsi visual yang mendukung positioning.

### 2. Portrait terlalu kecil

Portrait berukuran 64 x 64 px terasa seperti avatar akun, bukan elemen identitas portfolio profesional.

Saran:

- Gunakan portrait yang lebih besar sekitar 280-480 px jika kualitas gambar mendukung.
- Alternatifnya, gunakan portrait tetap kecil tetapi tambahkan visual proyek utama di sisi kanan hero.

### 3. Terlalu bergantung pada teks dan kartu

Selain portrait, hampir tidak ada gambar nyata dalam halaman utama. Sebagian besar isi divisualisasikan dengan teks, border, kartu, statistik, dan WebGL yang saat ini tidak terlihat.

Saran visual:

- Screenshot dashboard.
- Grafik hasil analisis.
- Peta spasial.
- Cuplikan notebook.
- Diagram arsitektur sistem.
- Visual before-and-after pengolahan data.

Gunakan visual yang berasal dari proyek nyata dan aman dipublikasikan.

### 4. Ritme section terlalu berulang

Banyak section menggunakan pola yang sama:

1. Label uppercase monospace.
2. Heading besar.
3. Paragraf penjelas.
4. Kumpulan kartu dengan border tipis.

Pola tersebut konsisten, tetapi setelah beberapa section mulai terasa monoton.

Saran:

- Kurangi jumlah eyebrow atau label uppercase.
- Gunakan variasi layout berdasarkan fungsi konten.
- Gunakan case study besar untuk proyek utama.
- Gunakan timeline untuk pengalaman.
- Gunakan grouped list atau compact matrix untuk skills.
- Gunakan kartu hanya ketika benar-benar membantu pengelompokan.

### 5. Graph berpotensi menjadi gimmick

Graph dapat menjadi signature interaction yang menarik, tetapi harus menjawab kebutuhan pengguna. Perekrut terutama ingin menemukan proyek relevan dan memahami kompetensi secara cepat.

Saran:

- Pertahankan graph hanya jika interaksi stabil, cepat, dan menuntun ke proyek relevan.
- Berikan judul dan penjelasan singkat sebelum graph.
- Sediakan fallback sederhana yang tetap berguna.
- Pertimbangkan menjadikannya halaman `Explore all projects`, bukan penutup wajib halaman utama.

### 6. Light theme dikunci secara permanen

CSS menetapkan `color-scheme: light`. Ini bukan masalah utama, tetapi dark mode dapat cocok dengan graph dan karakter teknis website.

Saran:

- Prioritaskan perbaikan build dan UX terlebih dahulu.
- Tambahkan dark mode hanya jika benar-benar mendukung identitas visual dan dapat diuji dengan baik.
- Jangan menambah theme toggle sebelum masalah utama selesai.

## Konsep Navigasi yang Direkomendasikan

### Design direction

Website ini sebaiknya diposisikan sebagai portfolio profesional untuk recruiter dan hiring manager dengan karakter riset, data, dan technical-editorial.

Keseimbangan desain yang disarankan:

- Design variance: 6/10.
- Motion intensity: 5/10.
- Visual density: 5/10.

Arah tersebut cukup unik untuk memberikan kesan kuat, tetapi tetap cepat dipahami dan nyaman digunakan.

### Konsep utama: Guided Evidence Navigation

Navigasi tidak hanya berfungsi sebagai daftar section. Navigasi harus memandu recruiter melalui urutan pengambilan keputusan:

```text
Siapa kandidatnya
        ↓
Apa kompetensi utamanya
        ↓
Apa bukti pekerjaan terbaiknya
        ↓
Apa pengalaman profesionalnya
        ↓
Apakah keahliannya sesuai
        ↓
Bagaimana cara menghubunginya
```

Pengunjung tidak boleh dipaksa memahami istilah internal atau struktur portfolio terlebih dahulu. Setiap menu harus menggunakan istilah yang langsung dikenali recruiter.

### Arsitektur halaman yang disarankan

#### Halaman utama `/`

```text
Hero
↓
Core Expertise
↓
Selected Work
↓
Professional Experience
↓
Skills & Education
↓
Contact
```

#### Halaman proyek `/projects`

```text
Featured Projects
↓
Search & Filter
↓
Full Project Atlas
↓
Interactive Graph
```

Memindahkan Atlas dan graph ke halaman proyek akan membuat homepage jauh lebih ringkas. Recruiter dapat menyelesaikan homepage dalam beberapa menit, sedangkan pengunjung teknis tetap dapat mengeksplorasi seluruh repository.

Jika penambahan halaman baru belum diinginkan, Atlas masih dapat berada di homepage, tetapi harus diposisikan setelah pengalaman, skill, dan pendidikan. Graph tetap sebaiknya menjadi eksplorasi opsional.

### Navigasi desktop

Struktur yang direkomendasikan:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ JULI YANDI RAHMAN   Work   Experience   Skills   Projects  [Discuss a role]│
└────────────────────────────────────────────────────────────────────────────┘
                            active indicator
```

Karakter navigasi desktop:

- Sticky di bagian atas halaman.
- Tinggi tetap 64-72 px.
- Nama di kiri berfungsi sebagai tombol kembali ke hero.
- Empat menu utama saja agar tetap satu baris pada lebar 1024 px.
- CTA `Discuss a role` selalu terlihat di sisi kanan.
- Section aktif ditandai garis hijau yang bergerak halus.
- Scroll progress line setebal 1-2 px dapat ditempatkan di bawah navbar.
- Background porcelain semi-transparan dengan blur ringan dapat dipertahankan.
- Tidak menggunakan dropdown, mega menu, atau navigasi bertingkat.

Label navigasi yang disarankan:

| Label sekarang | Label yang disarankan | Alasan |
|---|---|---|
| Trajectory | Work | Lebih cepat dipahami |
| Practice | Experience | Tidak ambigu |
| Atlas | Projects | Istilah yang umum bagi recruiter |
| Formation | Skills | Lebih relevan terhadap perekrutan |
| Contact | Discuss a role | CTA lebih spesifik |

`Trajectory`, `Practice`, dan `Formation` dapat dipertahankan sebagai istilah editorial di dalam section, tetapi sebaiknya tidak dipakai sebagai label navigasi utama.

### Navigasi mobile

Header mobile yang direkomendasikan:

```text
┌──────────────────────────────────┐
│ JYR          [Discuss a role] [☰]│
└──────────────────────────────────┘
```

Saat menu dibuka:

```text
┌──────────────────────────────────┐
│ Juli Yandi Rahman             [×]│
│                                  │
│ Selected Work                    │
│ Experience                       │
│ Skills & Education               │
│ Projects                         │
│                                  │
│ [ Discuss a role ]               │
│                                  │
│ GitHub  LinkedIn  Email          │
└──────────────────────────────────┘
```

Gunakan full-screen menu atau large navigation sheet, bukan dropdown kecil. Pendekatan ini memberikan ruang untuk target sentuh yang besar, label yang jelas, dan informasi kontak tanpa membuat tampilan terasa sempit.

Perilaku mobile menu yang wajib:

- Setiap target sentuh minimal 44 x 44 px, disarankan 48-56 px.
- Menu dapat ditutup melalui tombol close, tombol Escape, atau setelah memilih link.
- Fokus keyboard dikunci di dalam menu selama menu terbuka.
- Setelah menu ditutup, fokus dikembalikan ke tombol pembuka.
- Background page tidak dapat di-scroll selama menu terbuka.
- Link aktif diberi penanda visual selain warna saja.
- Menu bekerja pada mode reduced motion.
- CTA tetap menggunakan label `Discuss a role` agar intent konsisten.

Bottom navigation permanen tidak direkomendasikan karena menutup sebagian area baca dan membuat portfolio terasa seperti aplikasi mobile. Sticky top header dan navigation sheet lebih sesuai untuk konteks profesional.

### Perilaku anchor dan scrollspy

Setiap menu harus memenuhi aturan berikut:

- Mendarat dengan heading section terlihat penuh.
- Memperhitungkan tinggi sticky navbar.
- Menggunakan `scroll-margin-top` sekitar 80-96 px.
- Dapat dibuka langsung dari URL hash.
- Bekerja dengan tombol browser Back dan Forward.
- Tidak ditempatkan di dalam parent yang mendapat transformasi 3D.
- Tidak menyebabkan perubahan lebar halaman.
- Tetap bekerja saat JavaScript motion dinonaktifkan.
- Tetap bekerja ketika `prefers-reduced-motion` aktif.

Scrollspy dapat memperbarui section aktif berdasarkan IntersectionObserver. Jika hash URL ikut diperbarui saat scroll, gunakan `history.replaceState` agar setiap perpindahan section tidak memenuhi riwayat browser.

### CTA utama

Gunakan satu label CTA yang konsisten:

> Discuss a role

CTA dapat muncul pada:

- Navbar.
- Hero.
- Setelah Selected Work.
- Contact section.

Semua CTA tersebut menuju tujuan yang sama. Hindari menggunakan `Contact`, `Let's talk`, `Hire me`, dan `Get in touch` secara bersamaan untuk intent yang sama.

Jika nanti tersedia CV publik yang sudah disanitasi, `View résumé` dapat ditambahkan sebagai CTA sekunder. Jangan menautkan PDF yang masih memuat informasi sensitif.

### Efek yang dapat memberikan kesan premium

Navigasi sebaiknya tetap sederhana. Kesan premium dapat diberikan melalui detail berikut:

1. Sliding active indicator dengan spring motion ringan sekitar 200-300 ms.
2. Scroll progress line yang bergerak halus tanpa angka persentase.
3. Perubahan background navbar dari transparan menjadi porcelain semi-opaque setelah hero.
4. Full-screen mobile menu dengan animasi opacity dan transform yang singkat.
5. Transisi menuju halaman Projects yang sederhana, tanpa zoom 3D atau scroll hijacking.

Efek tersebut harus menghormati `prefers-reduced-motion`. Kesan utama tetap harus datang dari kualitas proyek, screenshot nyata, dan penjelasan kontribusi, bukan dari menu yang kompleks.

### Pola navigasi yang tidak disarankan

- Zoom 3D pada seluruh section.
- Scroll hijacking.
- Navbar yang menghilang saat graph muncul.
- Bottom navigation permanen.
- MacOS-style dock.
- Menu radial.
- Custom cursor.
- Dropdown bertingkat.
- Mega menu.
- Command palette.
- Nomor section dekoratif.
- Animasi yang mengurangi opacity teks saat sedang dibaca.

## Rekomendasi Desain Mobile

Desain mobile tidak cukup hanya dengan menumpuk layout desktop menjadi satu kolom. Setiap section perlu disusun ulang berdasarkan prioritas baca, ukuran sentuh, dan keterbatasan ruang layar.

### 1. Mobile hero

- Gunakan header ringkas dengan monogram `JYR`, CTA, dan tombol menu.
- Pastikan headline, subheadline, dan CTA utama terlihat tanpa perjalanan scroll yang berlebihan.
- Headline idealnya 3-4 baris pada perangkat kecil.
- CTA dapat ditumpuk vertikal pada layar sempit jika dua tombol tidak muat dengan nyaman.
- Tombol utama mempunyai lebar penuh pada perangkat sekitar 320-360 px.
- Portrait dapat diperbesar menjadi 80-112 px atau diposisikan sebagai bagian visual terpisah.
- Statistik 301, 13, dan 16 dapat menggunakan tiga kolom hanya jika label tetap terbaca. Jika tidak, gunakan horizontal scroll-snap atau stack 2+1.

### 2. Spacing dan tipografi mobile

- Gunakan padding horizontal 16-20 px.
- Gunakan jarak vertikal section sekitar 64-88 px, bukan ruang kosong setinggi beberapa viewport.
- Body text minimal 16 px dengan line-height sekitar 1.5-1.7.
- Metadata monospace minimal 11-12 px dan harus tetap memenuhi contrast ratio.
- Hindari headline atau label panjang dalam uppercase penuh.
- Batasi panjang baris agar teks tidak memenuhi seluruh lebar secara padat.

### 3. Selected Work pada mobile

- Tampilkan 3-5 proyek utama sebelum tombol menuju semua proyek.
- Setiap proyek mempunyai screenshot atau grafik nyata dengan rasio yang stabil.
- Informasi utama harus terlihat tanpa hover.
- Urutan informasi: visual, nama proyek, masalah, peran, hasil, teknologi, tautan.
- Seluruh kartu boleh menjadi link jika state fokusnya jelas.
- Jangan menyembunyikan informasi penting di tooltip atau hover interaction.

### 4. Experience dan Skills pada mobile

- Timeline berubah menjadi single-column list.
- Jangan menggunakan garis timeline rumit yang menyita lebar.
- Role, organisasi, dan periode harus terlihat sebelum detail tanggung jawab.
- Skills dikelompokkan berdasarkan fungsi, maksimal 4-6 item yang terlihat per kelompok.
- Daftar panjang dapat menggunakan accordion dengan label dan jumlah yang jelas.
- Pendidikan sekolah dasar dan menengah tetap collapsed secara default.

### 5. Project Atlas pada mobile

- Search ditempatkan paling atas.
- Filter menggunakan tombol `Filter` yang membuka bottom sheet atau dialog.
- Tampilkan jumlah filter aktif pada tombol.
- Sediakan `Clear filters` yang mudah ditemukan.
- Project card menggunakan satu kolom.
- Pagination mempunyai tombol minimal 44 px.
- URL filter tetap dapat dibagikan.
- Hindari menampilkan 13 method tabs dalam satu kolom panjang sebelum daftar proyek.
- Jika tab tetap digunakan, pakai horizontal scroll-snap dengan indikator bahwa daftar dapat digeser.

### 6. Graph pada mobile

- Graph tidak menjadi bagian wajib dari alur homepage.
- Tampilkan setelah pengguna secara eksplisit memilih `Explore graph`.
- Berikan fallback berupa daftar atau filter jika WebGL tidak tersedia.
- Jangan memerlukan scroll sepanjang `240vh` untuk mencapai kondisi interaktif.
- Kontrol graph ditempatkan sebagai bottom sheet agar dapat dijangkau ibu jari.
- Node yang dipilih harus mempunyai ringkasan teks yang jelas.
- Sediakan tombol kembali ke daftar proyek.

### 7. Motion mobile

- Gunakan opacity dan translate dengan jarak kecil.
- Jangan menggunakan positive-Z zoom pada container utama.
- Hindari parallax berat, scroll hijacking, dan perpetual animation.
- Animasi maksimal sekitar 200-400 ms untuk interaksi biasa.
- Semua animasi harus mempunyai fallback reduced motion.
- Tidak boleh muncul horizontal overflow selama atau setelah animasi.

### 8. Mobile accessibility

- Target sentuh minimal 44 x 44 px.
- Jarak antar-target cukup untuk mencegah salah tekan.
- Focus ring terlihat jelas.
- Menu dan dialog dapat digunakan dengan keyboard.
- Background dikunci saat navigation sheet atau filter dialog terbuka.
- Screen reader menerima nama tombol yang jelas.
- Orientasi portrait dan landscape sama-sama diuji.
- Lakukan pengujian pada lebar 320, 360, 390, 412, dan 768 px.
- Lakukan pengujian zoom browser 200%.

### 9. Kriteria selesai desain mobile

- Tidak ada horizontal scrollbar.
- Header tidak menutupi heading section.
- CTA tidak terpotong atau membungkus menjadi beberapa baris.
- Semua informasi penting dapat diakses tanpa hover.
- Tidak ada section kosong akibat animasi.
- Project Atlas dapat dicari dan difilter dengan satu tangan.
- Graph mempunyai fallback dan tidak mengunci alur navigasi.
- Lighthouse mobile accessibility memenuhi target.
- Semua menu anchor menuju posisi yang benar.

## Aksesibilitas

### Hasil Lighthouse

| Kategori | Nilai |
|---|---:|
| Accessibility | 97 |
| Best Practices | 100 |
| SEO | 100 |
| Agentic Browsing | 100 |

### Masalah kontras akibat animasi opacity

Lighthouse menemukan kegagalan color contrast pada bagian Trajectory. Beberapa teks mempunyai rasio kontras sekitar 1,55-1,94:1 saat parent DepthLayer berada dalam kondisi semi-transparan.

Warna dasar sebenarnya relatif baik. Masalah muncul karena seluruh section dianimasikan dengan opacity, sehingga teks kehilangan kontras saat masih berada di area yang dapat dilihat pengguna.

Saran:

- Jangan mengubah opacity seluruh section yang berisi konten penting.
- Animasikan elemen dekoratif atau gunakan reveal yang selesai sebelum konten masuk area baca.
- Pastikan teks yang sedang berada dalam viewport selalu memenuhi WCAG AA.
- Uji keyboard navigation ketika motion aktif dan reduced motion aktif.

### Hal aksesibilitas yang perlu diuji kembali

- Semua menu anchor setelah DepthLayer diperbaiki.
- Fokus keyboard pada navigation, tabs, filters, pagination, accordion, dan graph.
- Kontras kontrol graph pada latar final.
- Mobile menu dengan keyboard dan screen reader.
- Project popup dan proses menutup popup dengan Escape.
- Reduced-motion mode tanpa pinning dan transformasi.
- Zoom browser 200%.

## Performa dan Kompleksitas

### Hasil lokal

- LCP: 896 ms.
- CLS: 0,00.
- Tidak tersedia data CrUX atau data pengguna nyata.
- Pengujian dilakukan tanpa network throttling.

### Catatan performa

Performance trace mendeteksi forced reflow. Website menggunakan:

- GSAP ScrollTrigger.
- Transformasi 3D pada setiap content layer.
- Pinned trajectory.
- Scroll listener untuk GraphStage.
- React Three Fiber dan Three.js.
- Canvas global berukuran viewport.

Kompleksitas tersebut cukup tinggi untuk sebuah portfolio satu halaman. Karena fitur utamanya adalah komunikasi profesional, semua animasi harus mempunyai manfaat yang jelas.

Saran:

- Gunakan static server-rendered sections sebanyak mungkin.
- Pertahankan satu jenis scroll animation ringan.
- Lazy-load graph hanya ketika mendekati viewport.
- Hindari scroll handler yang membaca layout pada setiap event jika dapat diganti dengan IntersectionObserver, Motion value, atau ScrollTrigger yang sudah ada.
- Audit ulang production bundle setelah build berhasil.
- Lakukan Lighthouse dengan mobile throttling setelah versi production dapat dijalankan.

## Pengujian Teknis

### Hasil yang lulus

```text
ESLint:  lulus
Unit test: 40 dari 40 lulus
Test files: 4 dari 4 lulus
```

### Hasil yang gagal

```text
TypeScript check: gagal
Production build: gagal karena TypeScript error pada Trajectory.tsx
```

### End-to-end test

Delapan Playwright test sudah tersedia, tetapi belum dapat dijalankan di komputer ini karena Chromium Playwright belum terpasang. Kegagalan tersebut berasal dari environment pengujian, bukan hasil assertion test.

Setelah masalah source diperbaiki, jalankan:

```powershell
npx playwright install chromium
npm run test:e2e
npm run typecheck
npm run build
```

## Rencana Perbaikan Bertahap

### Tahap 1: Stabilitas dan kesiapan deployment

1. Perbaiki tipe `markerRefs` atau hapus ref yang tidak digunakan.
2. Pastikan `npm run typecheck` lulus.
3. Pastikan `npm run build` lulus.
4. Pasang Chromium Playwright dan jalankan seluruh end-to-end test.

Kriteria selesai:

- Tidak ada TypeScript error.
- Production build berhasil.
- Semua unit test dan end-to-end test lulus.

### Tahap 2: Perbaikan scroll dan navigasi

1. Hapus positive-Z exit zoom pada DepthLayer.
2. Hindari transformasi seluruh section.
3. Hilangkan horizontal overflow pada desktop dan mobile.
4. Tambahkan `scroll-margin-top` pada semua anchor section.
5. Terapkan sticky navigation desktop dengan label `Work`, `Experience`, `Skills`, dan `Projects`.
6. Terapkan header ringkas dan full-screen navigation sheet pada mobile.
7. Tambahkan scrollspy atau indikator section aktif yang tetap mudah dibaca.
8. Gunakan satu CTA konsisten, misalnya `Discuss a role`, pada hero dan navigasi.
9. Pastikan menu mobile mengunci scroll halaman, memindahkan fokus ke menu, dapat ditutup dengan Escape, dan mengembalikan fokus ke tombol pembuka.
10. Uji seluruh menu pada lebar 320, 360, 390, 412, 768, 1024, dan 1440 piksel.

Kriteria selesai:

- Tidak ada horizontal scrollbar.
- Semua judul section terlihat setelah menu diklik.
- Indikator aktif mengikuti section yang sedang dibaca tanpa berkedip saat batas section terlewati.
- Navigasi desktop tetap satu baris pada lebar 1024 piksel.
- Menu mobile dapat digunakan dengan sentuhan dan keyboard.
- Target sentuh utama berukuran minimal 44 x 44 piksel.
- Label CTA utama konsisten di seluruh halaman.
- Konten tidak memudar saat sedang dibaca.
- Reduced motion bekerja tanpa perubahan urutan konten.

### Tahap 3: Perbaikan graph

1. Render canvas di dalam GraphStage.
2. Berikan background gelap yang eksplisit.
3. Perbaiki z-index dan pointer-event.
4. Pastikan graph terlihat pada desktop dan mobile.
5. Pastikan fallback WebGL tetap terbaca.
6. Kurangi tinggi section jika `240vh` tidak diperlukan.

Kriteria selesai:

- Graph terlihat jelas.
- Kontrol mempunyai kontras yang cukup.
- Graph dapat digunakan dengan pointer dan keyboard.
- Tidak ada ruang kosong panjang ketika WebGL gagal.

### Tahap 4: Restrukturisasi konten

1. Tentukan positioning profesional utama.
2. Pilih 4-6 proyek flagship.
3. Tulis case study singkat untuk setiap proyek unggulan.
4. Pindahkan pengalaman kerja ke bagian atas.
5. Pindahkan Atlas setelah pengalaman, skill, dan pendidikan.
6. Kurangi pengulangan angka 301, 13, dan 16.
7. Gunakan istilah `repositories` dan `projects` secara konsisten.

Kriteria selesai:

- Perekrut memahami peran utama dalam 10-20 detik.
- Proyek unggulan menjelaskan masalah, metode, peran, dan hasil.
- Full Atlas tetap tersedia tanpa mendominasi halaman.

### Tahap 5: Penyempurnaan visual dan bahasa

1. Tentukan satu bahasa utama.
2. Perbesar portrait atau tambahkan visual proyek pada hero.
3. Tambahkan screenshot atau grafik proyek nyata.
4. Kurangi eyebrow uppercase yang berulang.
5. Variasikan layout sesuai fungsi section.
6. Audit kembali color contrast.

### Tahap 6: Privacy review dan publikasi

1. Periksa seluruh data pada `lib/content.ts`.
2. Tentukan apakah nomor telepon akan tetap publik.
3. Tinjau detail jabatan, pangkat, unit, dan tanggal pengangkatan.
4. Periksa metadata dan JSON-LD.
5. Pastikan PDF, `.env`, token, cache, build output, dan `node_modules` tidak terlacak Git.
6. Gunakan repository private sampai privacy review selesai.

## Checklist Sebelum Push atau Deployment Publik

- [ ] `cv.pdf` tidak terlacak Git.
- [ ] `DRH Terbaru.pdf` tidak terlacak Git.
- [ ] `.env` dan token GitHub tidak terlacak Git.
- [ ] Data pribadi sudah mendapat persetujuan untuk publikasi.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run test:e2e` lulus.
- [ ] `npm run build` lulus.
- [ ] Tidak ada horizontal overflow.
- [ ] Semua anchor navigation menuju posisi yang benar.
- [ ] Navigasi desktop tetap satu baris pada lebar 1024 piksel.
- [ ] Menu mobile dapat dibuka, ditutup, dan mengembalikan fokus dengan benar.
- [ ] Section aktif pada navigasi terbaca jelas saat halaman digulir.
- [ ] Semua target sentuh utama minimal 44 x 44 piksel.
- [ ] Tidak ada informasi penting yang hanya muncul melalui hover.
- [ ] CTA utama menggunakan label dan tujuan yang konsisten.
- [ ] Graph terlihat atau sudah dihapus dari halaman utama.
- [ ] Kontras memenuhi WCAG AA.
- [ ] Tampilan mobile sudah diperiksa pada lebar 320, 360, 390, 412, dan 768 piksel.
- [ ] Hero, kartu proyek, timeline, filter Atlas, dan graph tetap terbaca tanpa zoom pada mobile.
- [ ] Mode reduced motion dan keyboard navigation sudah diuji.
- [ ] Canonical URL sesuai domain deployment final.
- [ ] Open Graph image dan favicon dapat dimuat.
- [ ] Semua tautan proyek dan kontak sudah diverifikasi.

## Rekomendasi Akhir

Fondasi website layak dipertahankan. Tidak diperlukan redesign total. Pendekatan terbaik adalah targeted evolution:

1. Stabilkan build.
2. Sederhanakan animasi depth.
3. Perbaiki graph dan anchor navigation.
4. Susun ulang konten untuk kebutuhan perekrut.
5. Ubah proyek unggulan menjadi case study yang menjelaskan nilai dan dampak.
6. Lakukan privacy review sebelum repository atau website dibuat public.

Elemen yang sebaiknya dipertahankan:

- Palet warna.
- Tipografi utama.
- Struktur dasar hero.
- Project Atlas beserta filter dan URL state.
- Metadata SEO.
- Accessibility foundation.

Elemen yang sebaiknya disederhanakan atau diperbaiki:

- Depth animation pada semua section.
- Pinned scroll yang mengganggu anchor.
- Repetisi statistik repository.
- Daftar proyek yang terlalu panjang.
- Graph global dengan z-index negatif.
- Detail pribadi yang belum diaudit untuk publikasi.
