## 🚀 Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org) (Versi 22 atau terbaru)
*   [NPM](https://npmjs.com) atau [Yarn](https://yarnpkg.com)
*   GIT 
*   buka Fil: package.json dan install semua dependencies

### Langkah Instalasi

1. **Klon repositori ini** ke komputer Anda:
   ```bash
   git clone https://github.com/Fuj1io/kasir_backend.git
   cd nama-repositori
   ```

2. **Instal semua dependensi** yang dibutuhkan:
   ```bash
   npm install nama_dependencies
   # atau jika menggunakan yarn: yarn install
   ```

3. **Konfigurasi Environment Variables (`.env`)**:
   Proyek ini menggunakan file `.env` untuk menyimpan konfigurasi sensitif. Salin file `.env.example` yang sudah disediakan dan ubah namanya menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   *Catatan untuk pengguna Windows (Command Prompt):* `copy .env.example .env`

4. **Isi nilai di dalam file `.env`**:
   Buka file `.env` yang baru dibuat, lalu isi variabel di dalamnya sesuai dengan lingkungan (*environment*) Anda. Contoh isi file:
   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/nama_db
   API_KEY=isi_dengan_api_key_anda
   ```

5. **Import data produk dari terlebih dahulu**
buka folder `seeds` dan import ke database
```
- database ini menggunakan mysql, dan jika menggunakan phpmyadmin maka
- buka server lokal
- masuk browser buka : localhost:"port phpmyadmin"/phpmyadmin
- login 
- pilih database yang sudah dimasukan ke file .env.example di bagian DB_NAME
- klik table "produk" -> import file produk.ods -> checklist : The first line of the file contains the table column names (if this is unchecked, the first line will become part of the data)
- lalu import
- jika gagal silahkan browsing cara importnya
``` 

6. **Jalankan aplikasi**:
   ```bash
   - npm run dev
   - atau sesuaikan dengan package manager yang dipakai 
   ```
7. ** untuk akses butuh akun **
````
pada url tambahkan /register
contoh : http://localhost:5173/register
````