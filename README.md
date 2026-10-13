# SKL 2 — Recipe Finder API

## Identitas
- **Nama:** Fudhail Alatsary
- **Kelas:** 10 B
- **Semester:** 1
- **Periode:** 28 September – 5 Oktober 2026
- **Project:** Recipe Finder

## API
Project menggunakan DummyJSON Recipes:

`https://dummyjson.com/recipes`

JavaScript mengambil seluruh data recipe dengan Fetch API melalui endpoint:

`https://dummyjson.com/recipes?limit=0`

## Fitur yang berhasil dibuat

1. Menampilkan daftar recipe dari DummyJSON.
2. Search recipe berdasarkan nama.
3. Filter berdasarkan cuisine.
4. Filter berdasarkan difficulty.
5. Tombol Reset untuk mengembalikan tampilan awal.
6. Melihat detail recipe:
   - gambar
   - rating
   - jumlah review
   - waktu memasak
   - servings
   - difficulty
   - kalori
   - ingredients
   - instructions
7. Menambahkan dan menghapus favorite.
8. Favorite disimpan menggunakan LocalStorage sehingga tetap tersimpan setelah halaman direfresh.
9. Tampilan favorite dapat dibuka melalui tombol Favorites.
10. Responsive untuk desktop dan mobile.
11. Loading state, error state, dan empty state.

## Cara menjalankan

1. Extract ZIP.
2. Buka folder project di VS Code.
3. Jalankan `index.html` menggunakan Live Server.
4. Pastikan perangkat memiliki koneksi internet karena data diambil dari API DummyJSON.
5. Gunakan search, filter, detail, dan tombol ❤️ untuk mencoba fitur.

> Jika browser membatasi Fetch ketika file dibuka langsung dengan `file://`, gunakan extension **Live Server** di VS Code.

## Alur JavaScript

Secara sederhana alurnya:

**Fetch API → simpan data → tampilkan card → search/filter → detail → favorite → LocalStorage**

### 1. Fetch API

Function `fetchRecipes()` menggunakan `async/await` dan `fetch()` untuk mengambil data dari API.

### 2. Menampilkan data

Data recipe disimpan ke variable `recipes`, kemudian `applyFilters()` menentukan data yang akan ditampilkan dan `renderRecipes()` membuat HTML card.

### 3. Search dan filter

`applyFilters()` membaca:
- keyword dari search
- cuisine yang dipilih
- difficulty yang dipilih
- mode Favorites

Kemudian `Array.filter()` digunakan untuk mencari recipe yang sesuai.

### 4. Detail

Saat tombol **View Detail** diklik, ID recipe dicari menggunakan `find()`. Informasi recipe kemudian dimasukkan ke `<dialog>`.

### 5. Favorite

ID recipe favorite disimpan dalam array `favoriteIds`.

Saat favorite berubah, function `saveFavorites()` menyimpan array tersebut ke LocalStorage dengan `JSON.stringify()`.

Saat halaman dibuka kembali, `loadFavorites()` mengambil data menggunakan `localStorage.getItem()` lalu mengubahnya kembali menggunakan `JSON.parse()`.

## Bagian JavaScript yang paling saya pahami

Bagian yang paling saya pahami adalah **search dan filter**.

Function `applyFilters()` mengambil nilai dari input search dan dua select filter. Setelah itu, `recipes.filter()` memeriksa setiap recipe. Recipe hanya dimasukkan ke hasil jika nama cocok dengan keyword, cuisine cocok jika dipilih, dan difficulty cocok jika dipilih.

Dengan cara ini satu function bisa menangani search, filter, dan tampilan Favorites sekaligus.

## Kendala yang ditemukan

Kendala yang mungkin ditemui saat mengerjakan project adalah data tidak tampil jika Fetch API gagal atau browser dijalankan tanpa server lokal. Saya mencoba menyelesaikannya dengan `try...catch`, mengecek `response.ok`, menyediakan tampilan error, dan menjalankan project menggunakan Live Server.

Kendala lain adalah data favorite harus tetap ada setelah refresh. Solusinya adalah menggunakan LocalStorage dengan `JSON.stringify()` saat menyimpan dan `JSON.parse()` saat mengambil data.

## Bagian yang masih belum dipahami

Bagian yang masih ingin saya pelajari lebih dalam adalah cara kerja `async/await`, Promise pada Fetch API, dan bagaimana browser menangani `<dialog>` secara internal.

## Struktur File

```text
recipe-finder-skl2/
├── index.html
├── style.css
├── script.js
└── README.md
```
