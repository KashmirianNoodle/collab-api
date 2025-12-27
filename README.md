# Collab Backend

A production-ready collaborative backend built with **Node.js**, **Express**, **PostgreSQL**, **Redis**, **Socket.IO**, and **JWT-based authentication**.

---

## Features

- JWT Authentication + Refresh Tokens
- DB-backed Role-Based Access Control (OWNER, COLLABORATOR, VIEWER)
- Project & Workspace Management
- Asynchronous Job Processing (Redis queue)
- Real-Time Collaboration via Socket.IO
- Swagger API Documentation
- Comprehensive Tests with Coverage
- CI/CD via GitHub Actions
- Docker-ready

---

## Architecture Overview

- **API Layer**: Express REST APIs
- **Auth**: JWT + Refresh Tokens (Postgres)
- **RBAC**: Project-level roles stored in DB
- **Real-Time**: Socket.IO + Redis Pub/Sub
- **Jobs**: Redis-backed async queue
- **DB**: PostgreSQL
- **CI/CD**: GitHub Actions

![Architecture](images/architecture_overview.png)

---

## Setup & Run

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis

### Environment Variables

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/collab
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
```

### Install & Run

```bash
npm install
npm run migrate
npm run dev
```

Server runs on `http://localhost:4000`

---

## API Docs

Swagger UI:
```
http://localhost:4000/api-docs
```

---

## Testing

Run all tests:
```bash
npm test
```

Run single test file:
```bash
npx jest tests/projects.test.js
```

Run with coverage:
```bash
npm test -- --coverage
```

Coverage report:
```
coverage/lcov-report/index.html
```

---

## CI/CD

- Tests + coverage run on every PR/push
- PostgreSQL & Redis spun up via GitHub Actions services
- Docker image built & pushed after successful tests

---

## Design Decisions & Trade-offs

### Why DB-backed RBAC?
- Enables dynamic role changes
- Per-project permissions
- Auditable & scalable

### JWT + Refresh Tokens
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (revocable)

### Redis for Jobs & Realtime
- Fast pub/sub
- Simple horizontal scaling

---

## Scalability Considerations

- Stateless APIs → easy horizontal scaling
- Redis Pub/Sub allows multiple Socket.IO nodes
- DB indexes on `project_members`
- Jobs can be moved to Kafka/SQS later
- Socket.IO can scale with Redis adapter

---

## Future Improvements

- Rate limiting
- Audit logs
- Webhooks
- Fine-grained permissions
- Multi-region DB replication

---

## License

MIT
