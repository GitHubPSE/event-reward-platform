# 🎁 Event Reward Platform

NestJS + MongoDB + JWT + Docker 기반의 이벤트 보상 시스템입니다.  
유저는 이벤트에 참여하고, 조건을 만족하면 보상을 요청할 수 있으며, 요청 내역은 유저와 관리자가 각각 확인할 수 있습니다.

총 3개의 서비스가 실행됩니다.
1. **Auth 서비스** - 유저 등록 및 JWT 인증 (포트: `3001`)
2. **Event 서비스** - 이벤트 등록 및 조회, 보상 처리 (포트: `3002`)
3. **Gateway 서비스** - API 요청 라우팅 및 권한 처리 (포트: `3000`)

---

## 📦 실행 방법
### 🔧 사전 준비 사항

- **Docker & Docker Compose 설치**
- **포트 충돌 없음 확인**
  - 다음 포트를 사용합니다:
    - Auth 서비스: `3001`
    - Gateway 서비스: `3000`
    - Event 서비스: `3002`
    - MongoDB: `27017`

### 🛠️ 실행 절차

```bash
# 1. GitHub에서 레포지토리 클론
git clone https://github.com/your-name/event-reward-platform.git
cd event-reward-platform

# 2. 도커로 모든 서비스 빌드 및 실행
docker-compose up --build

# 3.아래 주소에서 각 서비스 확인 가능
1. Auth 서비스 (회원가입, 로그인) : http://localhost:3001 -> "Hello World!" 응답 (정상)
2. Gateway 서비스 (모든 API 진입점) : http://localhost:3000 -> 404 Not Found` (정상)
3. Event 서비스 (직접 접근은 차단됨) : http://localhost:3002 -> 비정상 접근입니다 (정상)
```

---

## 🔍 API 테스트 방법
Postman 또는 REST Client에서 아래 API들을 직접 테스트할 수 있습니다.
---

### 1. 🧑‍💻 회원가입
```
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
“username”: “abc1234”,
“password”: “pass1234”,
“role”: “USER”
}
```
---

### 2. 🔐 로그인 (JWT 발급)
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
“username”: “abc1234”,
“password”: “pass1234”
}
- ✅ 성공 시 `accessToken` 발급됨
- 이후 API 요청에 아래와 같이 헤더 추가
Authorization: Bearer <Token> 
x-from-gateway: true
```

❓ x-from-gateway: true 헤더를 추가한 이유 : 

✅ 이벤트 서버에 직접 접근하는 것을 방지하고, 반드시 게이트웨이(3000번 포트)를 통해서만 요청이 오도록 제한하기 위함입니다.

하위 서비스에서는 이 헤더가 없는 요청은 “비정상 접근”으로 간주하고 차단합니다.
 
---

### 3. 📬 프로필 확인
```
GET http://localhost:3000/api/profile
Headers:
Authorization: Bearer <Token> 
x-from-gateway: true
```
---

### 4. 📝 이벤트 등록 (운영자, 관리자 권한 필요)
```
POST http://localhost:3000/api/events
Headers:
Authorization: Bearer <운영자 또는 관리자 토큰>
x-from-gateway: true

Body:
{
“title”: “출석 이벤트”,
“description”: “7일 연속 출석 시 보상 지급”
}
```
---

### 5. 🔍 이벤트 전체 조회
```
GET http://localhost:3000/api/events
Headers:
Authorization: Bearer <Token>
x-from-gateway: true
```
---

### 6. 🧾 이벤트 상세 조회
```
GET http://localhost:3000/api/events/{id}
Headers:
Authorization: Bearer <Token>
x-from-gateway: true
```
---

### 7. 🎁 보상 요청
```
POST http://localhost:3000/api/rewards/requests/claim
Headers:
Authorization: Bearer <Token>
x-from-gateway: true

Body:
{
“userId”: “abc1234”,
“eventId”: “<이벤트 ID>”
}
```
---

### 8. 🧾 내 보상 요청 이력 조회
```
GET http://localhost:3000/api/rewards/requests/my?userId=abc1234
Headers:
Authorization: Bearer <Token>
x-from-gateway: true
```
---

### 9. 🧾 전체 보상 요청 이력 조회 (ADMIN or AUDITOR)
```
GET http://localhost:3000/api/rewards/requests/all
Headers:
Authorization: Bearer <ADMIN or AUDITOR 토큰>
x-from-gateway: true
```
---

✅ `회원가입/로그인`은 `http://localhost:3001`에서 직접 호출합니다.  
✅ 나머지 API는 반드시 `http://localhost:3000`(Gateway 서버)을 통해 호출해야 합니다.  
❌ `http://localhost:3002`(event-server) 직접 접근 시 요청이 차단됩니다.

---

### 💡 프로젝트 진행 간 고민

이 프로젝트에서 가장 중점적으로 고민한 부분은 **서비스 간 명확한 역할 분리**와 **보안 경계 설정**이었습니다.

#### 🔒 이벤트 서버 직접 접근 차단

- 이벤트 서버(`3002`)는 모든 API가 외부에서 직접 호출되지 않도록 제한했습니다.

- `x-from-gateway: true` 헤더가 포함되지 않으면 `403 Forbidden` 응답을 반환합니다.

- 이는 Gateway 서버를 통하지 않는 **비정상 요청을 사전에 차단**하고, **보안 경계를 명확히 하기 위한 설계**입니다.

#### ✅ 기대 효과

- **보안성 강화**: 이벤트 서버가 외부에 노출되지 않음으로써 무단 접근을 차단할 수 있습니다.  
- **유지보수 용이**: API 흐름이 Gateway 하나로 모이므로 장애 추적 및 기능 개선이 수월합니다.  
- **역할 분리 명확화**: 인증은 Auth 서버, 도메인 처리는 Event 서버, 요청 흐름 관리는 Gateway 서버로 나뉘어 있어 확장성이 좋습니다.

---

### 🔐 보안 처리 흐름 (JWT + Gateway + 헤더 조합)

본 시스템은 다음과 같은 **3단계 보안 흐름**을 기반으로 설계되었습니다:

1. **JWT 발급**  
   Auth 서버에서 로그인 성공 시 `accessToken`을 발급합니다.  
   이 토큰에는 사용자 정보 및 권한(Role)이 포함되어 있습니다.

2. **Gateway 인증 및 역할 검사**  
   클라이언트는 API 요청 시 Gateway(`3000`)로 요청을 보내고,  
   `Authorization: Bearer <token>`과 `x-from-gateway: true` 헤더를 함께 전송합니다.  
   Gateway는 토큰 유효성 및 Role 정보를 검사한 후,  
   요청이 허용된 경우에만 하위 서비스로 요청을 프록시합니다.

3. **Event 서버 직접 접근 차단**  
   Event 서버는 오직 Gateway에서 프록시된 요청만 처리합니다.  
   `x-from-gateway` 헤더가 누락되거나 값이 `"true"`가 아니면 `403 Forbidden` 응답을 반환하여 직접 접근을 차단합니다.

---

### 🧩 API 모듈 구조 및 분리 이유

API는 **기능 및 보안 관점**에서 다음과 같이 모듈화하여 구성되었습니다:

| 서비스  | 주요 기능                    | 비고                                |
|--------|-----------------------------|-------------------------------------|
| **Auth**   | 회원가입, 로그인, JWT 발급         | MongoDB `auth-db` 사용               |
| **Gateway**| 요청 라우팅, 토큰 검증, 권한 확인    | 모든 API 요청은 이곳을 통해야 함           |
| **Event**  | 이벤트 등록, 조회, 보상 관리        | 직접 접근 차단, MongoDB `event-db` 사용 |

#### 🧭 각 서비스의 역할

- **Auth 서버**는 인증과 관련된 기능만 수행하며, 인증 실패 시 즉시 차단이 가능합니다.

- **Gateway 서버**는 보안의 중심으로, 요청 흐름 제어 및 권한 분기 처리를 담당합니다.

- **Event 서버**는 이벤트 관련 로직만 담당하며, 인증 및 권한 검사는 신경 쓰지 않도록 설계했습니다.

👉 이렇게 각 서버가 **역할에 충실하게 구성**됨으로써,  
**유지보수성과 확장성**이 크게 향상되었습니다.
