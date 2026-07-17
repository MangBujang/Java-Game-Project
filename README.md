# Dragon Monster — Java Game Project

> Backend + static frontend untuk game berbasis web. Aplikasi ini menyediakan REST API untuk entitas permainan (hero, dragon, save slot) dan endpoint pertempuran, serta beberapa halaman HTML statis yang disajikan langsung oleh Spring Boot.

---

## 1. Deskripsi Project

Proyek ini adalah backend server untuk permainan "Dragon Monster" (paket Java: `com.dragonworld.game`) yang dibangun dengan Spring Boot. Backend menyediakan API untuk mengambil daftar hero/dragon, menyimpan/menghapus save slot, dan menjalankan mekanik pertempuran melalui endpoint `/api/combat`. Frontend berupa halaman HTML/JS statis (ditempatkan di `src/main/resources/static`) yang dapat berinteraksi dengan API menggunakan fetch().

Tujuan umum:
- Menyediakan RESTful API untuk game (CRUD save slot, list hero/dragon, pertempuran).
- Menyajikan halaman statis yang menjalankan UI game / peta / setup.
- Demonstrasi arsitektur Controller → Service → Repository dengan Spring Data JPA.

---

## 2. Preview (halaman statis di /static)

Halaman yang ada di repo (src/main/resources/static):
- `game.html` — halaman utama game
- `map.html`, `map2.html`, `map3.html` — variasi peta/level
- `setup.html` — halaman konfigurasi/setup
- `index.html` — file placeholder
- direktori `css/`, `js/`, `assets/` untuk aset frontend

Frontend bersifat statis (vanilla HTML + JavaScript) dan dilayani oleh Spring Boot dari folder `static`.

---

## 3. Cara Kerja (ringkasan alur)

1. Server menjalankan Spring Boot (entrypoint: `com.dragonworld.game.DragonMonsterApplication`).
2. Endpoint REST tersedia di:
   - GET /api/dragons — ambil semua dragon (controller: `DragonController`)
   - GET /api/heroes — ambil semua hero (controller: `HeroController`)
   - POST /api/combat/hero-attack — jalankan logika pertempuran antara hero dan musuh (controller: `CombatController`)
   - GET /api/slots — ambil semua save slot (controller: `SaveSlotController`)
   - POST /api/slots — buat/ubah save slot
   - DELETE /api/slots/{id} — hapus save slot
3. Controller menerima request, memanggil Service/Repository (logika pertempuran dan persistence), lalu mengembalikan JSON.
4. Halaman statis memanggil API menggunakan fetch() untuk menampilkan/menyimpan state permainan.

Contoh alur pertempuran: frontend POST JSON ke `/api/combat/hero-attack` (request DTO `AttackRequest`), service memproses serangan, mengembalikan `AttackResponse` berisi hasil serangan / EXP / perubahan HP.

---

## 4. Tech Stack

- Bahasa: Java (project POM menyebutkan `java.version=25`)
- Framework: Spring Boot 4.x (pom parent: `spring-boot-starter-parent` 4.0.5)
- Notable libraries:
  - spring-boot-starter-webmvc
  - spring-boot-starter-data-jpa (Hibernate)
  - spring-boot-h2console (opsional / dev)
  - PostgreSQL JDBC driver (runtime)
  - Lombok (annotation processor, optional)
- Build: Maven (Maven Wrapper `mvnw` / `mvnw.cmd`)
- Frontend: HTML + JavaScript + CSS (statis)
- DB: PostgreSQL (HikariCP connection pooling configured)

---

## 5. Struktur Project (penyorotan direktori penting)
```bash
dragon-monster-adventure/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── dragonworld/
        │           └── game/
        │               ├── DragonMonsterApplication.java  # Entrypoint Spring Boot
        │               ├── controller/
        │               │   ├── CombatController.java
        │               │   ├── DragonController.java
        │               │   ├── HeroController.java
        │               │   └── SaveSlotController.java
        │               ├── service/                       # Business logic (combat, dll.)
        │               ├── model/                         # Entitas JPA (Dragon, Hero, SaveSlot, ...)
        │               └── repository/                    # Spring Data JPA repositories
        └── resources/
            ├── application.properties                     # Konfigurasi (datasource, jpa)
            └── static/
                ├── game.html
                ├── map.html
                ├── map2.html
                ├── map3.html
                ├── setup.html
                └── assets/
                └── css/
                └── js/
```


Bagaimana komponen terhubung: Controller menerima HTTP request → Service memproses aturan permainan → Repository menyimpan/mengambil entitas dari database. Static files disajikan langsung oleh Spring Boot pada root context.

---

## 6. Persyaratan

- JDK yang sesuai (POM menyebutkan Java 25 — gunakan JDK 25 jika ingin mengikuti property proyek)
- Git
- (Opsional) PostgreSQL jika ingin menjalankan dengan DB production; H2 bisa dipakai untuk pengembangan lokal jika diaktifkan
- Tidak wajib menginstall Maven karena ada Maven Wrapper (`./mvnw`)

---

## 7. Cara Menjalankan (lokal)

Jalankan cepat dengan Maven Wrapper:

Unix / macOS:
```bash 
./mvnw spring-boot:run
```

Windows (PowerShell / CMD):
```bash
mvnw.cmd spring-boot:run
```

mvnw.cmd spring-boot:run
```bash
./mvnw -DskipTests package
java -jar target/*.jar
```
## 8. Konfigurasi (environment)

Konfigurasi utama: `src/main/resources/application.properties`

Poin penting:

- server.port ditetapkan ke 8081 (ubah jika perlu)
- Datasource saat ini dikonfigurasi untuk PostgreSQL (URL, username, password)
- HikariCP pool (max/min) sudah diatur
  
Rekomendasi keamanan:

- Saat ini repository berisi konfigurasi datasource langsung di `application.properties`. Ini berisiko karena kredensial sensitif dapat ter-commit. Sebaiknya hapus nilai sensitif dari file dan baca kredensial dari environment variables:
    - SPRING_DATASOURCE_URL
    - SPRING_DATASOURCE_USERNAME
    - SPRING_DATASOURCE_PASSWORD

Contoh override via environment (Linux/macOS):

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/dbname
export SPRING_DATASOURCE_USERNAME=dbuser
export SPRING_DATASOURCE_PASSWORD=secret
./mvnw spring-boot:run
```
Jika ingin memakai H2 untuk pengembangan offline:

- Aktifkan dependency H2 di `pom.xml` (saat ini mungkin dikomentari)
- Sesuaikan `spring.datasource.url` ke `jdbc:h2:file:./data/db` atau `jdbc:h2:mem:testdb`

## 9. Deploy ke Production

Langkah umum:

1. Siapkan environment pada platform (Railway/Heroku/GCP/AWS) dan tambahkan environment variables untuk datasource.
2. Build artifact (`./mvnw -DskipTests package`) dan jalankan `java -jar`.
3. Pastikan port yang diberikan oleh platform digunakan (contoh: set `server.port=${PORT:8081}` di `application.properties` agar otomatis mengikuti env var `PORT`).

## 10. Pengujian

Direktori `src/test` tidak terlihat berisi test otomatis. Pengujian yang ada bersifat manual:

- Uji endpoint GET (heroes, dragons, slots)
- Uji POST pertempuran dengan payload yang sesuai
- Uji pembuatan/hapus save slot via API
  
Untuk menambahkan test otomatis: gunakan `spring-boot-starter-test` (JUnit 5 + MockMvc) untuk integration tests pada controller/service.

## 11. Batasan & Catatan Keamanan

- CORS di controller dikonfigurasi `@CrossOrigin(origins = "*")` — longgar untuk production.
- Pastikan kredensial DB tidak ter-commit ke repository publik.
- Tidak ada mekanisme autentikasi/otorisasi pada endpoint (jika dibutuhkan, tambahkan Spring Security dan hashing password).
- Validasi input belum terlihat kuat (tambahkan `@Valid` dan DTO validation jika diperlukan).
- Perhatikan versi Java: POM menyebutkan `java.version=25`. Gunakan JDK yang sesuai atau sesuaikan POM jika ingin target versi lain.

