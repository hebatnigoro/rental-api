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
