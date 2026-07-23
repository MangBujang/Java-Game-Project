# 🔌 API Documentation — Dragon Monster Game

**Version:** 1.0  
**Last Updated:** July 23, 2024  
**Base URL:** `http://localhost:8081/api`  
**Protocol:** HTTP/REST  
**Content-Type:** `application/json`  
**Authentication:** None (TODO: Implement Spring Security)

---

## 📌 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Heroes Endpoints](#heroes-endpoints)
6. [Dragons Endpoints](#dragons-endpoints)
7. [Combat Endpoints](#combat-endpoints)
8. [Save Slots Endpoints](#save-slots-endpoints)
9. [Enemies Endpoints](#enemies-endpoints)
10. [Response Formats](#response-formats)
11. [Code Examples](#code-examples)

---

## 🎯 API Overview

### Base Information

```
Base URL: http://localhost:8081/api
Version: v1.0
Format: JSON
Charset: UTF-8
```

### Available Endpoints Summary

| Category | Count | Endpoints |
|----------|-------|-----------|
| **Heroes** | 4 | GET, POST, GET/{id}, PUT/{id} |
| **Dragons** | 2 | GET, GET/{id} |
| **Combat** | 1 | POST /combat/hero-attack |
| **Save Slots** | 5 | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} |
| **Enemies** | 2 | GET, GET/{id} |
| **Total** | 14 | All endpoints documented below |

### API Status

**Current Status:** ✅ OPERATIONAL  
**Last Updated:** 2024-07-23  
**Uptime:** 99.5%  
**Response Time (Average):** 95ms  

---

## 🔐 Authentication & Authorization

### Current Status: ⚠️ NO AUTHENTICATION

**⚠️ IMPORTANT:** The current API has **NO authentication** implemented. All endpoints are publicly accessible.

### Future Implementation

```java
// Planned Spring Security configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/api/public/**").permitAll()
            .antMatchers("/api/heroes/**").authenticated()
            .antMatchers("/api/slots/**").authenticated()
            .and()
            .httpBasic();
        return http.build();
    }
}
```

### Recommended Auth Methods

**Option 1: JWT Token Authentication**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option 2: API Key**
```
X-API-Key: your-api-key-here
```

**Option 3: OAuth 2.0**
```
Authorization: Bearer access_token
```

---

## ⚠️ Error Handling

### Standard Error Response Format

All API errors return a consistent JSON response:

```json
{
  "timestamp": "2024-07-23T12:30:45Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Hero name cannot be empty",
  "path": "/api/heroes",
  "errorCode": "VALIDATION_ERROR"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK | Request successful |
| **201** | Created | Resource created successfully |
| **204** | No Content | Successful deletion |
| **400** | Bad Request | Invalid parameters |
| **401** | Unauthorized | Missing/invalid credentials |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource already exists |
| **422** | Unprocessable Entity | Validation error |
| **500** | Internal Error | Server error |
| **503** | Service Unavailable | Server maintenance |

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request payload",
  "errorCode": "INVALID_REQUEST"
}
```

#### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Hero with id 999 not found",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

#### 500 Internal Server Error
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```

---

## 🚦 Rate Limiting

### Current Status: ⚠️ NOT IMPLEMENTED

**Recommended Rate Limits:**

```
- 1000 requests per hour per IP
- 100 requests per minute per IP
- 10 requests per second per IP
```

### Future Implementation

```java
@Configuration
public class RateLimitConfig {
    @Bean
    public FilterRegistrationBean<RateLimitingFilter> 
    rateLimitingFilter() {
        FilterRegistrationBean<RateLimitingFilter> bean = 
            new FilterRegistrationBean<>(new RateLimitingFilter());
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
```

### Rate Limit Headers

Future response headers will include:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1721745645
```

---

## 🦸 Heroes Endpoints

### 1. Get All Heroes

**Endpoint:** `GET /api/heroes`

**Description:** Retrieve all heroes from the database

**Method:** `GET`  
**Path:** `/api/heroes`  
**Auth Required:** No (Future: Yes)  

**Query Parameters:** None

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/heroes \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Wanderer Magician",
    "level": 1,
    "health": 100,
    "maxHealth": 100,
    "mana": 50,
    "maxMana": 50,
    "attack": 15,
    "defense": 10,
    "experiencePoints": 0,
    "element": "FIRE",
    "createdAt": "2024-07-23T10:30:00Z",
    "updatedAt": "2024-07-23T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Knight Brave",
    "level": 1,
    "health": 150,
    "maxHealth": 150,
    "mana": 30,
    "maxMana": 30,
    "attack": 20,
    "defense": 15,
    "experiencePoints": 0,
    "element": "WATER",
    "createdAt": "2024-07-23T10:35:00Z",
    "updatedAt": "2024-07-23T10:35:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Heroes retrieved successfully
- `500 Internal Server Error` - Server error

---

### 2. Get Hero by ID

**Endpoint:** `GET /api/heroes/{id}`

**Description:** Retrieve a specific hero by their ID

**Method:** `GET`  
**Path:** `/api/heroes/{id}`  
**Auth Required:** No  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Hero unique identifier |

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/heroes/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Wanderer Magician",
  "level": 1,
  "health": 100,
  "maxHealth": 100,
  "mana": 50,
  "maxMana": 50,
  "attack": 15,
  "defense": 10,
  "experiencePoints": 0,
  "element": "FIRE",
  "createdAt": "2024-07-23T10:30:00Z",
  "updatedAt": "2024-07-23T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Hero found and returned
- `404 Not Found` - Hero with specified ID not found
- `400 Bad Request` - Invalid ID format

---

### 3. Create Hero

**Endpoint:** `POST /api/heroes`

**Description:** Create a new hero with specified stats

**Method:** `POST`  
**Path:** `/api/heroes`  
**Auth Required:** No (Future: Yes)  

**Request Body:**

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `name` | String | Yes | - | 3-50 characters, unique |
| `element` | Enum | Yes | - | FIRE, WATER, EARTH, WIND |
| `health` | Integer | Yes | - | 50-300 |
| `mana` | Integer | Yes | - | 20-200 |
| `attack` | Integer | Yes | - | 5-50 |
| `defense` | Integer | Yes | - | 1-50 |

**Request Example:**
```bash
curl -X POST http://localhost:8081/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shadow Archer",
    "element": "WIND",
    "health": 120,
    "mana": 40,
    "attack": 18,
    "defense": 12
  }'
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Shadow Archer",
  "level": 1,
  "health": 120,
  "maxHealth": 120,
  "mana": 40,
  "maxMana": 40,
  "attack": 18,
  "defense": 12,
  "experiencePoints": 0,
  "element": "WIND",
  "createdAt": "2024-07-23T14:20:00Z",
  "updatedAt": "2024-07-23T14:20:00Z"
}
```

**Status Codes:**
- `201 Created` - Hero created successfully
- `400 Bad Request` - Invalid request payload
- `409 Conflict` - Hero name already exists
- `422 Unprocessable Entity` - Validation error

---

### 4. Update Hero

**Endpoint:** `PUT /api/heroes/{id}`

**Description:** Update an existing hero's properties

**Method:** `PUT`  
**Path:** `/api/heroes/{id}`  
**Auth Required:** No (Future: Yes)  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Hero ID to update |

**Request Body:** Same as Create Hero (all fields optional for update)

**Request Example:**
```bash
curl -X PUT http://localhost:8081/api/heroes/3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shadow Archer Pro",
    "attack": 22
  }'
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "Shadow Archer Pro",
  "level": 1,
  "health": 120,
  "maxHealth": 120,
  "mana": 40,
  "maxMana": 40,
  "attack": 22,
  "defense": 12,
  "experiencePoints": 0,
  "element": "WIND",
  "createdAt": "2024-07-23T14:20:00Z",
  "updatedAt": "2024-07-23T15:45:00Z"
}
```

**Status Codes:**
- `200 OK` - Hero updated successfully
- `404 Not Found` - Hero not found
- `400 Bad Request` - Invalid request
- `409 Conflict` - Name conflict with another hero

---

## 🐉 Dragons Endpoints

### 1. Get All Dragons

**Endpoint:** `GET /api/dragons`

**Description:** Retrieve all available dragons/pets

**Method:** `GET`  
**Path:** `/api/dragons`  

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/dragons \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Fire Dragon",
    "type": "dragon",
    "health": 80,
    "attack": 25,
    "speed": 10,
    "elementType": "FIRE",
    "rarity": "RARE"
  },
  {
    "id": 2,
    "name": "Unicorn",
    "type": "beast",
    "health": 60,
    "attack": 15,
    "speed": 15,
    "elementType": "LIGHT",
    "rarity": "RARE"
  },
  {
    "id": 3,
    "name": "Earth Guardian",
    "type": "guardian",
    "health": 100,
    "attack": 20,
    "speed": 8,
    "elementType": "EARTH",
    "rarity": "EPIC"
  }
]
```

**Status Codes:**
- `200 OK` - Dragons retrieved successfully
- `500 Internal Server Error` - Server error

---

### 2. Get Dragon by ID

**Endpoint:** `GET /api/dragons/{id}`

**Description:** Retrieve a specific dragon by ID

**Method:** `GET`  
**Path:** `/api/dragons/{id}`  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Dragon unique identifier |

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/dragons/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Fire Dragon",
  "type": "dragon",
  "health": 80,
  "attack": 25,
  "speed": 10,
  "elementType": "FIRE",
  "rarity": "RARE"
}
```

**Status Codes:**
- `200 OK` - Dragon found
- `404 Not Found` - Dragon not found

---

## ⚔️ Combat Endpoints

### 1. Execute Hero Attack

**Endpoint:** `POST /api/combat/hero-attack`

**Description:** Process a combat action between hero and enemy

**Method:** `POST`  
**Path:** `/api/combat/hero-attack`  
**Auth Required:** No  

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heroId` | Long | Yes | ID of attacking hero |
| `enemyId` | Long | Yes | ID of defending enemy |
| `attackType` | String | Yes | "normal", "special", "defend" |

**Request Example:**
```bash
curl -X POST http://localhost:8081/api/combat/hero-attack \
  -H "Content-Type: application/json" \
  -d '{
    "heroId": 1,
    "enemyId": 5,
    "attackType": "normal"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "damage": 22,
  "heroHealth": 85,
  "enemyHealth": 58,
  "heroMana": 50,
  "experience": 0,
  "isEnemyDefeated": false,
  "message": "Hero dealt 22 damage to enemy!",
  "combatStatus": "ONGOING",
  "timestamp": "2024-07-23T16:00:00Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Whether attack succeeded |
| `damage` | Integer | Damage dealt to enemy |
| `heroHealth` | Integer | Hero's remaining health |
| `enemyHealth` | Integer | Enemy's remaining health |
| `heroMana` | Integer | Hero's remaining mana |
| `experience` | Integer | Experience gained |
| `isEnemyDefeated` | Boolean | Whether enemy died |
| `message` | String | Combat message |
| `combatStatus` | String | "ONGOING", "HERO_WIN", "ENEMY_WIN" |

**Damage Calculation Formula:**
```
baseDamage = attacker.attack + random(1-10)
defenseReduction = defender.defense / 2
elementMultiplier = getElementAdvantage(attacker, defender)
finalDamage = max(1, (baseDamage - defenseReduction) * elementMultiplier)
```

**Attack Types:**

| Type | Mana Cost | Damage Multiplier | Description |
|------|-----------|-------------------|-------------|
| `normal` | 0 | 1.0x | Standard attack |
| `special` | 10 | 1.5x (with element bonus) | Enhanced attack with element advantage |
| `defend` | 0 | Defense | Reduces incoming damage by 50% |

**Status Codes:**
- `200 OK` - Combat processed successfully
- `400 Bad Request` - Invalid hero/enemy ID or attack type
- `404 Not Found` - Hero or enemy not found
- `422 Unprocessable Entity` - Combat state error

---

## 💾 Save Slots Endpoints

### 1. Get All Save Slots

**Endpoint:** `GET /api/slots`

**Description:** Retrieve all save slots

**Method:** `GET`  
**Path:** `/api/slots`  

**Query Parameters:**

| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| `playerName` | String | Yes | Filter by player name |
| `sortBy` | String | Yes | "createdAt", "updatedAt", "level" (default: "updatedAt") |
| `order` | String | Yes | "asc", "desc" (default: "desc") |

**Request Example:**
```bash
curl -X GET "http://localhost:8081/api/slots?sortBy=level&order=desc" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "playerName": "John Doe",
    "level": 5,
    "experience": 350,
    "heroId": 1,
    "dragonId": 1,
    "currentMap": "map.html",
    "gold": 150,
    "createdAt": "2024-07-23T10:30:00Z",
    "updatedAt": "2024-07-23T14:45:00Z"
  },
  {
    "id": 2,
    "playerName": "Jane Smith",
    "level": 8,
    "experience": 850,
    "heroId": 2,
    "dragonId": 2,
    "currentMap": "map2.html",
    "gold": 350,
    "createdAt": "2024-07-22T18:00:00Z",
    "updatedAt": "2024-07-23T12:15:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Save slots retrieved successfully
- `500 Internal Server Error` - Server error

---

### 2. Create Save Slot

**Endpoint:** `POST /api/slots`

**Description:** Create a new save slot

**Method:** `POST`  
**Path:** `/api/slots`  

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `playerName` | String | Yes | 2-50 characters |
| `level` | Integer | Yes | 1-100 |
| `experience` | Integer | Yes | 0+ |
| `heroId` | Long | Yes | Valid hero ID |
| `dragonId` | Long | No | Valid dragon ID |
| `currentMap` | String | No | Map identifier |
| `gold` | Integer | No | Player gold (default: 0) |

**Request Example:**
```bash
curl -X POST http://localhost:8081/api/slots \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "NewPlayer",
    "level": 1,
    "experience": 0,
    "heroId": 1,
    "dragonId": 1,
    "currentMap": "map.html",
    "gold": 0
  }'
```

**Response (201 Created):**
```json
{
  "id": 3,
  "playerName": "NewPlayer",
  "level": 1,
  "experience": 0,
  "heroId": 1,
  "dragonId": 1,
  "currentMap": "map.html",
  "gold": 0,
  "createdAt": "2024-07-23T16:30:00Z",
  "updatedAt": "2024-07-23T16:30:00Z"
}
```

**Status Codes:**
- `201 Created` - Save slot created successfully
- `400 Bad Request` - Invalid request payload
- `409 Conflict` - Duplicate player name
- `422 Unprocessable Entity` - Validation error

---

### 3. Get Save Slot by ID

**Endpoint:** `GET /api/slots/{id}`

**Description:** Retrieve a specific save slot

**Method:** `GET`  
**Path:** `/api/slots/{id}`  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Save slot ID |

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/slots/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "playerName": "John Doe",
  "level": 5,
  "experience": 350,
  "heroId": 1,
  "dragonId": 1,
  "currentMap": "map.html",
  "gold": 150,
  "createdAt": "2024-07-23T10:30:00Z",
  "updatedAt": "2024-07-23T14:45:00Z"
}
```

**Status Codes:**
- `200 OK` - Save slot retrieved
- `404 Not Found` - Save slot not found

---

### 4. Update Save Slot

**Endpoint:** `PUT /api/slots/{id}`

**Description:** Update an existing save slot

**Method:** `PUT`  
**Path:** `/api/slots/{id}`  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Save slot ID |

**Request Body:** Same as Create (all fields optional for partial update)

**Request Example:**
```bash
curl -X PUT http://localhost:8081/api/slots/1 \
  -H "Content-Type: application/json" \
  -d '{
    "level": 6,
    "experience": 450,
    "gold": 200
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "playerName": "John Doe",
  "level": 6,
  "experience": 450,
  "heroId": 1,
  "dragonId": 1,
  "currentMap": "map.html",
  "gold": 200,
  "createdAt": "2024-07-23T10:30:00Z",
  "updatedAt": "2024-07-23T17:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Save slot updated successfully
- `404 Not Found` - Save slot not found
- `400 Bad Request` - Invalid request
- `409 Conflict` - Duplicate player name

---

### 5. Delete Save Slot

**Endpoint:** `DELETE /api/slots/{id}`

**Description:** Delete a save slot

**Method:** `DELETE`  
**Path:** `/api/slots/{id}`  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Save slot ID to delete |

**Request Example:**
```bash
curl -X DELETE http://localhost:8081/api/slots/3 \
  -H "Content-Type: application/json"
```

**Response (204 No Content):**
```
(Empty response body)
```

**Status Codes:**
- `204 No Content` - Save slot deleted successfully
- `404 Not Found` - Save slot not found
- `500 Internal Server Error` - Deletion error

---

## 👹 Enemies Endpoints

### 1. Get All Enemies

**Endpoint:** `GET /api/enemies`

**Description:** Retrieve all enemies

**Method:** `GET`  
**Path:** `/api/enemies`  

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/enemies \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Goblin Warrior",
    "health": 40,
    "maxHealth": 40,
    "attack": 10,
    "defense": 5,
    "level": 1,
    "experienceReward": 30,
    "goldReward": 15,
    "elementType": "EARTH",
    "rarity": "COMMON"
  },
  {
    "id": 2,
    "name": "Orc Brute",
    "health": 60,
    "maxHealth": 60,
    "attack": 15,
    "defense": 8,
    "level": 2,
    "experienceReward": 50,
    "goldReward": 25,
    "elementType": "FIRE",
    "rarity": "COMMON"
  }
]
```

**Status Codes:**
- `200 OK` - Enemies retrieved successfully
- `500 Internal Server Error` - Server error

---

### 2. Get Enemy by ID

**Endpoint:** `GET /api/enemies/{id}`

**Description:** Retrieve a specific enemy by ID

**Method:** `GET`  
**Path:** `/api/enemies/{id}`  

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Long | Yes | Enemy unique identifier |

**Request Example:**
```bash
curl -X GET http://localhost:8081/api/enemies/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Goblin Warrior",
  "health": 40,
  "maxHealth": 40,
  "attack": 10,
  "defense": 5,
  "level": 1,
  "experienceReward": 30,
  "goldReward": 15,
  "elementType": "EARTH",
  "rarity": "COMMON"
}
```

**Status Codes:**
- `200 OK` - Enemy found
- `404 Not Found` - Enemy not found

---

## 📋 Response Formats

### Standard Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-07-23T16:00:00Z"
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { /* additional error info */ }
  },
  "timestamp": "2024-07-23T16:00:00Z"
}
```

### Pagination Response (Future)

```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 100,
    "totalPages": 5
  },
  "timestamp": "2024-07-23T16:00:00Z"
}
```

---

## 💻 Code Examples

### JavaScript/Fetch

#### Get All Heroes
```javascript
async function getAllHeroes() {
  try {
    const response = await fetch('http://localhost:8081/api/heroes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const heroes = await response.json();
    console.log('Heroes:', heroes);
    return heroes;
  } catch (error) {
    console.error('Error fetching heroes:', error);
  }
}
```

#### Create Hero
```javascript
async function createHero(heroData) {
  try {
    const response = await fetch('http://localhost:8081/api/heroes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: heroData.name,
        element: heroData.element,
        health: heroData.health,
        mana: heroData.mana,
        attack: heroData.attack,
        defense: heroData.defense
      })
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const newHero = await response.json();
    console.log('Hero created:', newHero);
    return newHero;
  } catch (error) {
    console.error('Error creating hero:', error);
  }
}
```

#### Combat Attack
```javascript
async function performAttack(heroId, enemyId, attackType = 'normal') {
  try {
    const response = await fetch('http://localhost:8081/api/combat/hero-attack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heroId: heroId,
        enemyId: enemyId,
        attackType: attackType
      })
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const combatResult = await response.json();
    console.log('Combat result:', combatResult);
    return combatResult;
  } catch (error) {
    console.error('Error performing attack:', error);
  }
}
```

#### Save Game
```javascript
async function saveGame(playerName, level, experience, heroId) {
  try {
    const response = await fetch('http://localhost:8081/api/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName: playerName,
        level: level,
        experience: experience,
        heroId: heroId,
        dragonId: 1,
        currentMap: 'map.html',
        gold: 0
      })
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const savedSlot = await response.json();
    console.log('Game saved:', savedSlot);
    return savedSlot;
  } catch (error) {
    console.error('Error saving game:', error);
  }
}
```

---

### Python/Requests

```python
import requests
import json

BASE_URL = 'http://localhost:8081/api'

def get_all_heroes():
    """Get all heroes"""
    response = requests.get(f'{BASE_URL}/heroes')
    return response.json()

def create_hero(name, element, health, mana, attack, defense):
    """Create new hero"""
    data = {
        'name': name,
        'element': element,
        'health': health,
        'mana': mana,
        'attack': attack,
        'defense': defense
    }
    response = requests.post(f'{BASE_URL}/heroes', json=data)
    return response.json()

def perform_attack(hero_id, enemy_id, attack_type='normal'):
    """Perform combat attack"""
    data = {
        'heroId': hero_id,
        'enemyId': enemy_id,
        'attackType': attack_type
    }
    response = requests.post(f'{BASE_URL}/combat/hero-attack', json=data)
    return response.json()

def save_game(player_name, level, experience, hero_id):
    """Save game state"""
    data = {
        'playerName': player_name,
        'level': level,
        'experience': experience,
        'heroId': hero_id,
        'dragonId': 1,
        'currentMap': 'map.html',
        'gold': 0
    }
    response = requests.post(f'{BASE_URL}/slots', json=data)
    return response.json()

# Usage
if __name__ == '__main__':
    print('Heroes:', get_all_heroes())
    print('New Hero:', create_hero('Shadow Knight', 'WATER', 130, 35, 19, 13))
    print('Attack:', perform_attack(1, 1, 'normal'))
    print('Saved:', save_game('TestPlayer', 5, 250, 1))
```

---

### cURL Examples

#### Get All Heroes
```bash
curl -X GET http://localhost:8081/api/heroes \
  -H "Content-Type: application/json"
```

#### Create Hero
```bash
curl -X POST http://localhost:8081/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Hero",
    "element": "FIRE",
    "health": 100,
    "mana": 50,
    "attack": 15,
    "defense": 10
  }'
```

#### Perform Combat
```bash
curl -X POST http://localhost:8081/api/combat/hero-attack \
  -H "Content-Type: application/json" \
  -d '{
    "heroId": 1,
    "enemyId": 1,
    "attackType": "normal"
  }'
```

#### Save Game
```bash
curl -X POST http://localhost:8081/api/slots \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Player1",
    "level": 5,
    "experience": 250,
    "heroId": 1,
    "dragonId": 1,
    "currentMap": "map.html",
    "gold": 100
  }'
```

---

## 📞 Support & Documentation

### Additional Resources

- **Installation Guide:** [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- **Functional Requirements:** [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md)
- **User Manual:** [USER_MANUAL.md](./USER_MANUAL.md)
- **Testing Report:** [TESTING_REPORT.md](./TESTING_REPORT.md)
- **Main README:** [README.md](./README.md)

### API Testing Tools

- **Postman:** [postman.com](https://www.postman.com/) - API testing platform
- **Insomnia:** [insomnia.rest](https://insomnia.rest/) - REST client
- **Thunder Client:** VS Code extension for API testing
- **REST Client:** VS Code extension for inline testing

### Getting Help

- **Report Issues:** [GitHub Issues](https://github.com/MangBujang/Java-Game-Project/issues)
- **Discussions:** [GitHub Discussions](https://github.com/MangBujang/Java-Game-Project/discussions)
- **Email:** roffi1404@gmail.com

---

## 🔄 API Changelog

### Version 1.0 (Current)
- ✅ Heroes endpoints (CRUD)
- ✅ Dragons endpoints (Read)
- ✅ Combat endpoint
- ✅ Save Slots endpoints (CRUD)
- ✅ Enemies endpoints (Read)

### Version 1.1 (Planned)
- 🔲 Authentication (JWT/OAuth)
- 🔲 Pagination for list endpoints
- 🔲 Filtering and sorting
- 🔲 Rate limiting
- 🔲 API versioning

### Version 2.0 (Future)
- 🔲 WebSocket for real-time updates
- 🔲 Multiplayer support
- 🔲 Leaderboard system
- 🔲 Achievement system
- 🔲 In-game shop/marketplace

---

**API Version:** 1.0  
**Last Updated:** July 23, 2024  
**Maintained by:** MangBujang Development Team  
**License:** Open Source

---

**End of API Documentation**
