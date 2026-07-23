# 📖 User Manual — Dragon Monster Game

**Version:** 1.0  
**Last Updated:** July 23, 2024  
**Language:** Indonesian / English  
**Target Audience:** Players, Developers, Testers

---

## 📌 Daftar Isi

1. [Pengenalan Game](#pengenalan-game)
2. [Panduan Instalasi & Setup](#panduan-instalasi--setup)
3. [Memulai Game](#memulai-game)
4. [Kontrol & Interface](#kontrol--interface)
5. [Game Mechanics](#game-mechanics)
6. [Combat System](#combat-system)
7. [Manajemen Save/Load](#manajemen-saveload)
8. [Tips & Trik](#tips--trik)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## 🎮 Pengenalan Game

### Apa itu Dragon Monster Game?

**Dragon Monster Game** adalah sebuah web-based RPG (Role-Playing Game) berbasis turn-based combat system. Dalam game ini, Anda berperan sebagai seorang petualang (hero) yang:

- 🧙 **Memilih hero** dengan kemampuan unik
- 🐉 **Memilih pet dragon** sebagai pendamping
- ⚔️ **Bertarung** dengan musuh dalam sistem pertempuran berbasis giliran
- 🗺️ **Menjelajahi maps** dengan level yang berbeda
- 💾 **Menyimpan progress** dalam save slots

### Target Pemain

- Pemain casual yang menyukai RPG ringan
- Penggemar strategy-based combat
- Developer yang ingin belajar Spring Boot + JavaScript games

### Fitur Utama

✨ **Hero Customization** — Pilih atau buat hero dengan stat unik  
✨ **Pet Dragon System** — Pilih dragon companion dengan kemampuan berbeda  
✨ **Multi-Level Maps** — Jelajahi 3 peta dengan difficulty berbeda  
✨ **Turn-Based Combat** — Strategi pertempuran yang fair dan balanced  
✨ **Experience & Leveling** — Tingkatkan level dan stats hero Anda  
✨ **Save System** — Simpan hingga 10 game slot  
✨ **Smooth Animations** — Grafis HD dengan animation 60 FPS  

---

## 🚀 Panduan Instalasi & Setup

### Prasyarat Sistem

Sebelum bermain, pastikan sistem Anda memenuhi persyaratan:

#### Hardware Minimum
- **RAM:** 2 GB
- **Storage:** 500 MB
- **Internet:** Koneksi lokal atau internet (untuk multiplayer features - future)

#### Software yang Diperlukan
- **Browser Modern:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Java 25** (untuk menjalankan backend)
- **PostgreSQL** (opsional untuk production)

### Langkah 1: Instal Java 25

**Windows:**
1. Download dari [oracle.com](https://www.oracle.com/java/technologies/downloads/)
2. Jalankan installer `.exe`
3. Ikuti wizard instalasi

**macOS:**
```bash
brew tap homebrew/cask-versions
brew install java25
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-25-jdk
```

### Langkah 2: Clone Repository

```bash
git clone https://github.com/MangBujang/Java-Game-Project.git
cd Java-Game-Project
```

### Langkah 3: Jalankan Backend Server

**macOS/Linux:**
```bash
./mvnw spring-boot:run
```

**Windows (PowerShell):**
```powershell
.\mvnw.cmd spring-boot:run
```

**Windows (Command Prompt):**
```cmd
mvnw.cmd spring-boot:run
```

**Output yang diharapkan:**
```
Started DragonMonsterApplication in 5.123 seconds
Server berjalan di http://localhost:8081
```

### Langkah 4: Buka Game di Browser

Ketika server sudah running, buka browser dan akses:

```
http://localhost:8081/game.html
```

Selesai! Game siap dimainkan. 🎉

---

## 🎯 Memulai Game

### First Time Setup

Ketika Anda membuka game untuk pertama kali:

1. **Loading Screen** → Tunggu assets selesai dimuat (biasanya 2-3 detik)
2. **Main Menu** → Pilih "New Game" atau "Load Game"

### Membuat Hero Baru

Jika memilih "New Game":

```
┌─────────────────────────────────┐
│   SELECT YOUR HERO              │
├─────────────────────────────────┤
│ 1. Wanderer Magician            │
│    - Health: 100                │
│    - Mana: 50                   │
│    - Attack: 15                 │
│    - Defense: 10                │
│    - Element: FIRE              │
├─────────────────────────────────┤
│ 2. Knight Brave                 │
│    - Health: 150                │
│    - Mana: 30                   │
│    - Attack: 20                 │
│    - Defense: 15                │
│    - Element: WATER             │
├─────────────────────────────────┤
│ 3. Forest Ranger                │
│    - Health: 120                │
│    - Mana: 40                   │
│    - Attack: 18                 │
│    - Defense: 12                │
│    - Element: WIND              │
└─────────────────────────────────┘

Tekan angka untuk memilih hero, atau SPACE untuk lihat lebih banyak
```

### Memilih Pet Dragon

Setelah memilih hero, pilih dragon companion:

```
┌─────────────────────────────────┐
│   SELECT YOUR PET               │
├─────────────────────────────────┤
│ 1. Fire Dragon (RARE)           │
│    - Health: 80                 │
│    - Attack: 25                 │
│    - Ability: Flame Strike      │
├─────────────────────────────────┤
│ 2. Unicorn (RARE)               │
│    - Health: 60                 │
│    - Attack: 15                 │
│    - Ability: Heal              │
├─────────────────────────────────┤
│ 3. Earth Guardian (EPIC)        │
│    - Health: 100                │
│    - Attack: 20                 │
│    - Ability: Stone Shield      │
└─────────────────────────────────┘

Tekan angka untuk memilih pet
```

### Memilih Difficulty

```
┌─────────────────────────────────┐
│   SELECT DIFFICULTY             │
├─────────────────────────────────┤
│ EASY        → Musuh lemah       │
│ NORMAL      → Balanced          │
│ HARD        → Musuh kuat        │
│ NIGHTMARE   → Sangat sulit      │
└─────────────────────────────────┘
```

Setelah memilih, tekan **ENTER** untuk mulai game!

---

## 🎮 Kontrol & Interface

### Keyboard Controls

| Tombol | Aksi | Konteks |
|--------|------|---------|
| **A** atau **← Left Arrow** | Bergerak ke kiri | Gameplay |
| **D** atau **→ Right Arrow** | Bergerak ke kanan | Gameplay |
| **W** atau **↑ Up Arrow** | Lompat | Gameplay |
| **Space** | Lompat (alternatif) | Gameplay |
| **Mouse Click** | Pilih menu | Menu/Dialog |
| **Enter** | Konfirmasi pilihan | Menu |
| **Esc** | Buka pause menu | Gameplay |

### Game Interface

#### Top-Left: Player Stats
```
┌─────────────────────────────┐
│ HERO: Wanderer Magician     │
│ Level: 1 | EXP: 0/100       │
├─────────────────────────────┤
│ HP:     [████████░░] 100/100│
│ Mana:   [████░░░░░░]  50/50 │
│ Attack: 15 | Defense: 10    │
└─────────────────────────────┘
```

#### Bottom-Left: Pet Info
```
┌─────────────────────────────┐
│ PET: Fire Dragon            │
│ HP: [████░░░░░░] 80/80      │
│ Status: Following           │
└─────────────────────────────┘
```

#### Center: Game World
- Player character (dengan sprite animation)
- Pet dragon (mengikuti di belakang)
- Enemies (jika ada di map)
- Interactive objects (treasure, NPCs)

#### Bottom-Right: Minimap
```
┌──────────┐
│ Map 1/3  │
│ █ . . .  │
│ . . E .  │
│ . . . .  │
└──────────┘
█ = Hero position
E = Enemy
. = Empty space
```

#### Top-Right: Quick Actions
```
[S] Save Game
[L] Load Game
[M] Map Select
[P] Pause
[I] Inventory (Future)
```

---

## 🕹️ Game Mechanics

### Movement & Navigation

#### Bergerak Horizontal
- Tekan **A** atau **← Left** untuk bergerak ke kiri
- Tekan **D** atau **→ Right** untuk bergerak ke kanan
- Hero akan terus bergerak selama tombol ditekan

#### Lompat
- Tekan **W** atau **Space** untuk lompat
- Gravity effect membuat hero jatuh kembali
- Maximum jump height ≈ 150 pixel
- Dapat lompat sambil bergerak untuk kombinasi pergerakan

#### Platform Collision
- Hero tidak bisa menembus ground/platform
- Ada gravity yang menarik hero ke bawah
- Jatuh dari platform membuat hero respawn di spawn point

### Parallax Scrolling

Map menggunakan parallax background untuk menciptakan depth effect:

```
[Sky]              → 0% speed (stationary)
[Background Ruins] → 20% speed (slow)
[Hills & Trees]    → 40% speed
[Ruins]            → 60% speed
[Foreground]       → 80% speed
[Ground]           → 100% speed (fastest)
```

Saat Anda bergerak, layer yang lebih jauh bergerak lebih lambat, menciptakan efek 3D.

### Enemy Encounters

#### Deteksi Enemy
- Ketika player sprite menyentuh enemy sprite → combat dimulai
- Layar otomatis switch ke combat mode
- Music berubah ke combat theme

#### Multiple Enemies
- Map dapat memiliki multiple enemies spawn
- Enemy baru dapat spawn setelah defeat musuh sebelumnya
- Difficulty meningkat seiring progress

---

## ⚔️ Combat System

### Combat Flow

```
┌─────────────────────────────────────────┐
│ 1. ENCOUNTER ENEMY                      │
│    └─ Hero sprite touches enemy         │
├─────────────────────────────────────────┤
│ 2. COMBAT START                         │
│    ├─ Hero stats displayed              │
│    ├─ Enemy stats displayed             │
│    └─ Turn order determined (speed)     │
├─────────────────────────────────────────┤
│ 3. TURN PHASE                           │
│    ├─ Hero selects action (Attack, etc) │
│    ├─ Damage calculated                 │
│    ├─ Enemy takes damage                │
│    ├─ Enemy AI takes action             │
│    └─ Hero takes counter-damage         │
├─────────────────────────────────────────┤
│ 4. REPEAT until one defeated            │
├─────────────────────────────────────────┤
│ 5. COMBAT END                           │
│    ├─ Victory → Get rewards             │
│    └─ Defeat → Respawn or load save     │
└─────────────────────────────────────────┘
```

### Combat Screen Layout

```
┌──────────────────────────────────────────────────┐
│            COMBAT INITIATED                      │
├──────────────────────────────────────────────────┤
│  HERO: Wanderer Magician          ENEMY: Goblin │
│  Level: 1  HP: [████░░] 100/100   HP: [███░░░░] │
│  Attack: 15  Defense: 10          Attack: 10    │
│  Element: FIRE                    Element: EARTH│
├──────────────────────────────────────────────────┤
│ Your Turn! Select Action:                        │
│                                                  │
│ [1] ATTACK      - Deal normal damage           │
│ [2] SPECIAL     - Use element advantage (5 MP) │
│ [3] DEFEND      - Reduce incoming damage       │
│ [4] ITEM        - Use consumable (future)      │
│                                                  │
│ ► Your choice: _                                │
└──────────────────────────────────────────────────┘
```

### Combat Actions

#### 1. Attack (Normal)
- **Cost:** None
- **Effect:** Deal `(Attack + random(1-10)) - (Enemy Defense / 2)` damage
- **Description:** Serangan normal tanpa efek khusus

**Contoh:**
```
Your Attack: 15 + 5 (random) = 20
Enemy Defense reduction: 10 / 2 = 5
Final Damage: 20 - 5 = 15 damage
Enemy HP: 40 → 25
```

#### 2. Special Attack
- **Cost:** 10 Mana (MP)
- **Effect:** Damage × 1.5 jika element advantage
- **Description:** Serangan khusus dengan bonus element

**Element Advantage:**
- FIRE beats EARTH → 1.5x damage
- WATER beats FIRE → 1.5x damage
- EARTH beats WATER → 1.5x damage
- WIND beats WATER → 1.5x damage

**Contoh:**
```
Fire Hero vs Earth Enemy:
Normal Attack: 15 damage
Special Attack: 15 × 1.5 = 22 damage (using 10 MP)
```

#### 3. Defend
- **Cost:** None
- **Effect:** Reduce incoming damage by 50%
- **Description:** Posisi defensive untuk mengurangi damage

**Contoh:**
```
Normal Enemy Attack: 10 damage
While Defending: 10 × 0.5 = 5 damage (reduced)
```

#### 4. Item (Future)
- Planned feature untuk consumable items
- Currently disabled

### Damage Calculation Formula

```
Base Damage = Attacker Attack Power + Random(1-10)
Defense Reduction = Defender Defense / 2
Element Multiplier = Check Element Advantage (1.0x or 1.5x)

Final Damage = (Base Damage - Defense Reduction) × Element Multiplier

Minimum Damage = 1 (never 0 or negative)
Maximum Damage = Unlimited (based on stats)
```

### Example Combat Scenario

```
Turn 1:
Hero (Wanderer Magician) vs Goblin

Hero: "Attack!"
→ Damage: 20
→ Goblin HP: 40 → 20

Goblin: "Attack!"
→ Damage: 8 (counter-attack)
→ Hero HP: 100 → 92

Turn 2:
Hero: "Special Attack!" (FIRE vs EARTH)
→ Damage: 30 (with 1.5x element advantage)
→ Goblin HP: 20 → 0 (DEFEATED!)

Hero wins!
Rewards:
+ 30 Experience Points
+ 15 Gold
+ Health Potion (item)

Hero EXP: 0 → 30
Next Level: 30/100
```

### Victory & Defeat

#### Victory Screen
```
┌──────────────────────────────────────┐
│          VICTORY!                    │
├──────────────────────────────────────┤
│ You defeated Goblin Warrior          │
│                                      │
│ Rewards:                             │
│ + 30 Experience Points               │
│ + 15 Gold                            │
│ + Health Potion                      │
│                                      │
│ Hero EXP: 0 → 30                     │
│ Level: 1/2 (30/100 XP to level up)  │
├──────────────────────────────────────┤
│ [CONTINUE] [SAVE & CONTINUE]         │
└──────────────────────────────────────┘
```

#### Defeat Screen
```
┌──────────────────────────────────────┐
│          YOU LOST!                   │
├──────────────────────────────────────┤
│ You were defeated by Goblin Warrior  │
│                                      │
│ Consolation:                         │
│ + 5 Experience Points (50% penalty)  │
│ + 0 Gold                             │
│                                      │
│ Hero EXP: 0 → 5                      │
├──────────────────────────────────────┤
│ [RETRY] [LOAD SAVE] [MAIN MENU]     │
└──────────────────────────────────────┘
```

---

## 📊 Experience & Leveling

### Experience System

#### Gaining Experience
- **Victory:** Full reward (50 XP base)
- **Defeat:** 50% penalty (25 XP)
- **XP varies by enemy level and difficulty**

#### Leveling Progression
```
Level 1 → Level 2: Requires 100 XP
Level 2 → Level 3: Requires 200 XP
Level 3 → Level 4: Requires 300 XP
Level n → Level n+1: Requires n × 100 XP

Formula: Required XP = Current Level × 100
```

#### Stat Increases per Level
```
On Level Up:
+ 10 Health Points (HP)
+ 2 Attack Power
+ 1 Defense
+ Mana regenerates to max
```

#### Level Cap
- Maximum level: 100
- After level 100, EXP still counts but no further stat growth

### Level-Up Example

```
Status: Level 1
Current EXP: 80 / 100 XP

After defeating 3 enemies (50 XP each):
Current EXP: 80 + 50 + 50 + 50 = 230 XP

Level Up! 🎉
Level 1 → Level 2
EXP carries over: 230 - 100 = 130 / 200 XP

Stats Updated:
HP:     100 → 110
Attack: 15 → 17
Defense: 10 → 11
```

---

## 💾 Manajemen Save/Load

### Save System Overview

Anda dapat menyimpan progress di hingga **10 save slots**.

### Cara Menyimpan Game

#### Method 1: In-Game Save
1. Tekan **S** atau pilih **[Save Game]** di menu
2. Pilih save slot (1-10) atau buat slot baru
3. Masukkan nama save (misal: "Progress Map 1")
4. Tekan **SAVE** untuk confirm

#### Method 2: Quick Save
1. Tekan **Ctrl+S** (quick save)
2. Otomatis menyimpan ke slot terbaru

### Cara Memuat Game

#### Method 1: Main Menu
1. Di main menu, pilih **[Load Game]**
2. Pilih save yang ingin dimuat
3. Tekan **LOAD**

#### Method 2: In-Game Load
1. Tekan **L** atau pilih **[Load Game]**
2. Pilih save yang ingin dimuat
3. Konfirmasi

### Save Slot Information

```
┌──────────────────────────────────────────────┐
│         SAVE SLOTS                           │
├──────────────────────────────────────────────┤
│ [1] Progress Map 1                           │
│     Level: 5 | EXP: 45/500 | Gold: 150      │
│     Hero: Wanderer Magician | Pet: Fire Drg │
│     Created: 2024-07-23 10:30                │
│     Last Saved: 2024-07-23 12:45             │
├──────────────────────────────────────────────┤
│ [2] Boss Defeated!                           │
│     Level: 12 | EXP: 230/1200 | Gold: 500   │
│     Hero: Knight Brave | Pet: Unicorn       │
│     Created: 2024-07-22 18:00                │
│     Last Saved: 2024-07-22 23:30             │
├──────────────────────────────────────────────┤
│ [3] Empty Slot                               │
│     Click to create new save                 │
└──────────────────────────────────────────────┘

Navigation: ← → to select | ENTER to load | DELETE to remove
```

### What Gets Saved

Save slot menyimpan:
- ✅ Hero stats (level, health, experience)
- ✅ Pet/dragon selection
- ✅ Current position on map
- ✅ Inventory (items/gold)
- ✅ Map progression
- ✅ Combat state
- ❌ Chat history (tidak tersimpan)
- ❌ Settings (tidak tersimpan per save)

---

## 🗺️ Maps Overview

### Map 1: Ruins
**Difficulty:** Easy  
**Location:** Ancient Ruins of Fire  
**Theme:** Desert with ancient structures  
**Enemy Type:** Goblins, Fire Elementals  

```
┌─────────────────────────────────┐
│ MAP 1: RUINS                    │
├─────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │
│  ▓           ▓                  │
│  ▓  ◆ ▲ ◆    ▓       ▲ ◆        │
│  ▓           ▓                  │
│  ▓▓▓▓▓  ▓▓▓▓▓▓▓                 │
│          ▓         ◆            │
│          ▓  ▲              ◆    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │
│  ▓ S    ▓   ◆      ▓            │
│  ▓            ▓    ▓            │
└─────────────────────────────────┘
S = Start Point
▲ = Hero
◆ = Enemy
▓ = Platform
```

**Objectives:**
- Defeat 3 enemies
- Reach map end
- Unlock Map 2

### Map 2: Forest
**Difficulty:** Normal  
**Location:** Ancient Forest  
**Theme:** Forest with trees and water  
**Enemy Type:** Forest Beasts, Water Spirits  

**Objectives:**
- Defeat 5 enemies
- Find treasure chest
- Unlock Map 3

### Map 3: Castle
**Difficulty:** Hard  
**Location:** Dragon's Castle  
**Theme:** Dark castle with flying enemies  
**Enemy Type:** Knights, Dragons, Dark Sorcerers  

**Objectives:**
- Defeat boss (Dragon)
- Complete final challenge
- Unlock endgame content

---

## 💡 Tips & Trik

### Combat Strategy

#### Tip 1: Manfaatkan Element Advantage
- Ketahui elemen lawan sebelum bertarung
- Gunakan special attack jika ada advantage
- Element advantage memberikan 1.5x damage!

#### Tip 2: Manajemen Mana
```
Mana = Resource berharga
- Gunakan special attack hanya saat diperlukan
- Kumpulkan mana dengan tidak bertarung
- Mana regenerates fully setelah combat
```

#### Tip 3: Pertahankan HP
- Jangan berhemat dengan defend action
- Defend mengurangi damage 50%
- Lebih baik 1 turn defend dari 2 turn damage

#### Tip 4: Pilih Pet yang Tepat
- Fire Dragon: Damage output tinggi
- Unicorn: Support & healing
- Earth Guardian: Tank & defense
- **Tip:** Sesuaikan dengan playstyle Anda

### Progression Tips

#### Leveling Cepat
```
1. Pilih difficulty HARD
2. Setiap victory memberikan 50+ XP
3. Defeat enemies di level terakhir yang sudah dikuasai
4. Farm XP selama 10-15 menit per level
```

#### Save Management
```
- Save sebelum boss fight
- Jangan overwrite save slot penting
- Rotate antara 3-4 save slots
- Backup save slot setiap achievement
```

#### Gold Farming
```
- Enemies memberikan gold setiap defeat
- Difficulty HARD → More gold
- Level map terakhir → Most gold
- Farming 30 min = 500+ gold
```

### Quality of Life Tips

1. **Gunakan Keyboard Shortcuts**
   - S = Save
   - L = Load
   - Esc = Pause menu
   - M = Map select

2. **Optimize Graphics**
   - Disable background animations jika lag
   - Browser fullscreen untuk immersion
   - Brightness +10% untuk visibility

3. **Audio Settings**
   - Mute background music jika playing sambil konsentrasi
   - Sound effects untuk feedback
   - Volume: 50-70% ideal

---

## 🐛 Troubleshooting

### Issue 1: Game Tidak Bisa Diakses

**Error:** "Cannot connect to localhost:8081"

**Solusi:**
```bash
# Check if server running
ps aux | grep java

# If not running, start server
./mvnw spring-boot:run

# Wait for "Started DragonMonsterApplication" message
# Then try http://localhost:8081 again
```

---

### Issue 2: Assets Tidak Loading

**Error:** "Failed to load image: assets/..."

**Solusi:**
1. Check browser console (F12 → Console tab)
2. Verify assets folder exists at `src/main/resources/static/assets/`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Reload page (Ctrl+Shift+R)

---

### Issue 3: Combat Damage Tidak Terhitung

**Error:** "Damage shows 0"

**Solusi:**
1. Verify hero attack stat > 0
2. Enemy defense tidak melebihi hero attack
3. Minimum damage selalu 1
4. Check browser console untuk error API

---

### Issue 4: Save/Load Tidak Bekerja

**Error:** "Save failed" atau "Load failed"

**Solusi:**
```bash
# Check database connection
# In application.properties, verify:
spring.datasource.url=jdbc:postgresql://localhost:5432/dragon_monster
spring.datasource.username=game_user
spring.datasource.password=correct_password

# Restart server if database changed
./mvnw spring-boot:run
```

---

### Issue 5: Game Lag atau FPS Rendah

**Symptoms:** Stutter, choppy animation, slow response

**Solusi:**
1. Close other browser tabs
2. Disable browser extensions
3. Lower graphics quality (if available)
4. Restart browser
5. Check RAM usage (Task Manager / Activity Monitor)

---

### Issue 6: Keyboard Controls Tidak Responsive

**Error:** Hero tidak bergerak meski tombol ditekan

**Solusi:**
1. Click pada game canvas dulu (focus element)
2. Check NUM LOCK status
3. Try mouse controls (if available)
4. Restart browser

---

### Issue 7: Browser Compatibility

**Error:** "Game crashes" atau "Features not working"

**Solusi:**
- Gunakan browser modern yang didukung:
  - ✅ Chrome 90+
  - ✅ Firefox 88+
  - ✅ Safari 14+
  - ✅ Edge 90+
- ❌ Hindari: IE11, old Safari versions

---

## ❓ FAQ (Frequently Asked Questions)

### Q1: Berapa lama game ini?

**A:** Tergantung playstyle:
- **Casual:** 3-5 jam untuk complete all maps
- **Speedrun:** 1-2 jam
- **100% with all achievements:** 10+ jam

---

### Q2: Berapa max level yang bisa dicapai?

**A:** Maximum level adalah **100**. Setelah mencapai level 100:
- Stat tidak bertambah lagi
- Experience masih bisa dikumpulkan (untuk leaderboard future)
- Bonus achievement unlocked

---

### Q3: Apakah ada multiplayer?

**A:** Saat ini, game ini **single-player only**. Fitur multiplayer direncanakan untuk versi future.

---

### Q4: Berapa banyak save slots?

**A:** Anda dapat membuat hingga **10 save slots**. Setelah penuh, Anda perlu delete slot lama untuk membuat yang baru.

---

### Q5: Apakah save bisa corrupt?

**A:** Save slot disimpan di database PostgreSQL dan jarang corrupt. Tapi untuk safety:
- Backup important saves
- Jangan force-close browser saat saving
- Jangan ubah database files manual

---

### Q6: Bisakah saya reset character?

**A:** Ya, dengan cara:
1. Delete save slot yang ingin direset
2. Buat new game

---

### Q7: Apa elemen yang paling kuat?

**A:** Tidak ada elemen "paling kuat" karena balance:
- **FIRE** → beats EARTH (DPS tinggi)
- **WATER** → beats FIRE (Balanced)
- **EARTH** → beats WATER (Tank)
- **WIND** → beats WATER (Speed)

Pilih berdasarkan playstyle!

---

### Q8: Bagaimana cara mendapat banyak gold?

**A:** Tips farming gold:
1. Play on HARD difficulty
2. Defeat high-level enemies
3. Complete map 3 repeatedly
4. Average: 50-100 gold per enemy

---

### Q9: Apakah ada hidden content?

**A:** Tidak ada hidden content di versi 1.0. Tapi stay tuned untuk:
- Secret boss battles
- Legendary items
- Unlock able area
- Easter eggs

---

### Q10: Support & Bug Report?

**A:** Untuk report bug atau suggest feature:
1. Buka GitHub issue: [MangBujang/Java-Game-Project/issues](https://github.com/MangBujang/Java-Game-Project/issues)
2. Deskripsikan bug dengan detail
3. Include screenshot/video jika possible
4. Include system info (OS, browser, Java version)

---

## 📞 Kontak & Support

### Untuk Pemain
- **Bug Report:** [GitHub Issues](https://github.com/MangBujang/Java-Game-Project/issues)
- **Discussion:** [GitHub Discussions](https://github.com/MangBujang/Java-Game-Project/discussions)
- **Email:** roffi1404@gmail.com

### Untuk Developer
- **Installation Guide:** [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- **Functional Requirements:** [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md)
- **Documentation:** [README.md](./README.md)

---

## 🎓 Learning Resources

### Untuk Belajar Spring Boot
- [Spring Boot Official Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [RESTful Web Services](https://spring.io/guides/gs/rest-service/)

### Untuk Belajar JavaScript Gaming
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Game Development Basics](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser)

### Untuk Belajar Game Design
- [Game Mechanics 101](https://www.gamasutra.com/)
- [Balance in Game Design](https://www.youtube.com/watch?v=e31SCULXPU0)
- [Combat System Design](https://www.youtube.com/watch?v=c38qBCgXqTM)

---

## ✅ Checklist First Time Player

- [ ] Server sudah running di localhost:8081
- [ ] Browser terbuka di http://localhost:8081/game.html
- [ ] Assets sudah loading (tidak ada red X di console)
- [ ] Pilih hero untuk dimulai
- [ ] Pilih pet dragon
- [ ] Coba combat pertama
- [ ] Save game pertama
- [ ] Jelajahi map 2 & 3
- [ ] Capai level 5+
- [ ] Defeat boss akhir
- [ ] Baca FAQ jika ada pertanyaan

---

## 🎉 Selamat Bermain!

Anda sudah siap menjadi ultimate dragon monster master! 

**Tips akhir:**
- Nikmati gameplay dan jangan terburu-buru
- Experiment dengan hero dan pet berbeda
- Challenge diri dengan HARD difficulty
- Share progress Anda dengan teman!

**Terima kasih sudah memainkan Dragon Monster Game!** 🐉⚔️✨

---

**Version:** 1.0 | **Last Updated:** July 23, 2024  
**Developed by:** MangBujang Development Team  
**License:** Open Source
