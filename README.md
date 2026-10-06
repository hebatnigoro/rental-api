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
