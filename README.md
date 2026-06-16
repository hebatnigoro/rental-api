# Rental API

REST API sederhana untuk manajemen penyewaan barang. Dibuat pakai **NestJS + TypeScript**, datanya disimpan di **PostgreSQL**, dan autentikasinya pakai **JWT**.

Studi kasusnya: ada **Customer** (penyewa) dan **Rental** (transaksi sewa). Satu customer bisa punya banyak transaksi rental (relasi one-to-many).

## Stack

- NestJS 11 (TypeScript)
- PostgreSQL + TypeORM
- JWT (`@nestjs/jwt` + Passport)
- class-validator untuk validasi request
- Jest + Supertest untuk E2E testing

## Arsitektur / Pattern

Project ini pakai **Modular Architecture ala NestJS (Modular Monolith)**, dengan penerapan **Layered Architecture + Repository Pattern**.

Tiap fitur dibungkus jadi satu module sendiri yang berdiri sendiri:

```
src/
├── auth/        # register, login, JWT strategy, guard
├── users/       # entity user + akses datanya (dipakai auth)
├── customers/   # CRUD customer
├── rentals/     # CRUD rental (berelasi ke customer)
└── config/      # konfigurasi koneksi database
```

Di dalam tiap module, alurnya berlapis (layered):

```
Controller  ->  Service  ->  Repository  ->  Database
 (HTTP)        (logic)       (akses data)
```

### Kenapa pakai pattern ini?

- **Modular** — tiap fitur terisolasi dalam module-nya sendiri. Mau nambah fitur baru (misalnya `payments`) tinggal bikin module baru tanpa ngutak-atik yang lain. Lebih gampang dirawat kalau project makin besar.
- **Layered (Controller -> Service -> Repository)** — tanggung jawab tiap layer jelas. Controller cuma ngurus HTTP (request/response), Service ngurus business logic, Repository ngurus akses data. Jadi logic-nya gak numpuk di satu file dan lebih gampang ditest.
- **Repository Pattern** — service tidak mengakses database secara langsung, tapi lewat class repository. Kalau suatu saat query-nya berubah atau mau ganti sumber data, cukup ubah di repository tanpa menyentuh business logic di service.
- **Dependency Injection** — semua dependency (service, repository) di-inject lewat constructor, bukan `new` manual. Ini bawaan NestJS dan bikin unit test jauh lebih gampang karena dependency-nya gampang di-mock.

Pattern ini yang biasa saya pakai karena strukturnya konsisten, mudah dipahami orang lain saat kolaborasi, dan scalable tanpa harus over-engineering ke microservices.

## Cara Menjalankan

### 1. Prasyarat
- Node.js 18+
- PostgreSQL yang sudah jalan

### 2. Install dependency
```bash
npm install
```

### 3. Setup environment
Salin `.env.example` jadi `.env`, lalu sesuaikan kredensial database:
```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=rental_db
JWT_SECRET=ganti-dengan-secret-sendiri
JWT_EXPIRES_IN=1d
```

### 4. Buat database
```sql
CREATE DATABASE rental_db;
```
Tabel akan dibuat otomatis oleh TypeORM (`synchronize: true`) saat aplikasi pertama kali jalan.

### 5. Jalankan
```bash
npm run start:dev
```
Server jalan di `http://localhost:3000/api`.

## Daftar Endpoint

Base URL: `http://localhost:3000/api`

### Auth
| Method | Endpoint         | Keterangan                      | Auth |
|--------|------------------|---------------------------------|------|
| POST   | `/auth/register` | Daftar user baru, dapat token   | -    |
| POST   | `/auth/login`    | Login, dapat token              | -    |
| GET    | `/auth/profile`  | Data user dari token            | JWT  |

### Customers
| Method | Endpoint          | Keterangan          | Auth |
|--------|-------------------|---------------------|------|
| POST   | `/customers`      | Tambah customer     | JWT  |
| GET    | `/customers`      | List semua customer | JWT  |
| GET    | `/customers/:id`  | Detail customer     | JWT  |
| PATCH  | `/customers/:id`  | Update customer     | JWT  |
| DELETE | `/customers/:id`  | Hapus customer      | JWT  |

### Rentals
| Method | Endpoint        | Keterangan        | Auth |
|--------|-----------------|-------------------|------|
| POST   | `/rentals`      | Tambah rental     | JWT  |
| GET    | `/rentals`      | List semua rental | JWT  |
| GET    | `/rentals/:id`  | Detail rental     | JWT  |
| PATCH  | `/rentals/:id`  | Update rental     | JWT  |
| DELETE | `/rentals/:id`  | Hapus rental      | JWT  |

> Endpoint yang ber-Auth JWT butuh header: `Authorization: Bearer <token>`

## Contoh Request

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"password123","name":"Admin"}'
```

Tambah customer (pakai token dari login):
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"Budi","phone":"08123456789","address":"Jakarta"}'
```

## Dokumentasi API (Postman)

Import file `Rental-API.postman_collection.json` ke Postman. Token dari response login otomatis disimpan ke variable `{{token}}` lewat script di tab Tests, jadi request lain langsung kepakai tokennya.

## Testing

E2E test fokus menguji alur **JWT token**: register/login dapat token, endpoint terproteksi menolak request tanpa token / token ngaco (401), dan menerima token valid (200).

```bash
npm run test:e2e
```

> Catatan: E2E test memakai database yang sama dengan `.env`. Untuk pengujian terisolasi bisa pakai database terpisah (misal `rental_db_test`).
