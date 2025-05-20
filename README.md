# 🎁 Event Reward Platform

NestJS + MongoDB + JWT + Docker 기반의 이벤트 보상 시스템입니다.  
유저는 이벤트에 참여하고, 조건을 만족하면 보상을 요청할 수 있으며, 요청 내역은 유저와 관리자가 각각 확인할 수 있습니다.

총 3개의 서비스가 실행됩니다.
1. Auth 서비스
2. Event 서비스
3. Gateway 서비스

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
1. Auth 서비스 (회원가입, 로그인) : http://localhost:3001
2. Gateway 서비스 (모든 API 진입점) : http://localhost:3000
3. Event 서비스 (직접 접근은 차단됨) : http://localhost:3002
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
---

### 3. 📬 프로필 확인
```
GET http://localhost:3000/api/profile
Headers:
Authorization: Bearer <Token> 
x-from-gateway: true
```
---

### 4. 📝 이벤트 등록 (OPERATOR 권한 필요)
```
POST http://localhost:3000/api/events
Headers:
Authorization: Bearer <OPERATOR 토큰>
x-from-gateway: true

Body:
{
“title”: “출석 이벤트”,
“description”: “7일 연속 출석 시 보상 지급”
}
```
