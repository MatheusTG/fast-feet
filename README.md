![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-darkgreen)
![Monorepo](https://img.shields.io/badge/Monorepo-PNPM%20Workspaces-F59E0B)

# 🚚 FastFeet — Logistics Platform (Monorepo)

FastFeet is a fullstack logistics platform designed to manage deliveries, couriers, and administrators in a structured and scalable way.

This project was built as part of my backend specialization studies, focusing on Clean Architecture, Domain-Driven Design (DDD), and scalable monorepo architecture.

The repository is organized as a PNPM workspace monorepo, sharing tooling and configuration across applications.

---

## 🚀 Technologies Used

| Technology | Description |
|------------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | JavaScript runtime environment for scalable backend applications. |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Strongly typed JavaScript superset improving maintainability and safety. |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) | Progressive Node.js framework for building scalable server-side applications. |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) | Modern ORM for type-safe database access. |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | Relational database system used to store logistics data. |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) | In-memory data store used for caching. |
| ![AWS S3](https://img.shields.io/badge/AWS%20S3-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white) | Object storage service used for delivery proof uploads. |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | Containerization platform for consistent environments. |
| ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) | Modern testing framework for unit and E2E tests. |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white) | Schema validation for safe input parsing. |
| ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white) | Task orchestration and build system for monorepos. |

---

## 🎯 Purpose

This project was built to demonstrate:

- Clean Architecture with clear separation of layers
- Domain-Driven Design (DDD)
- Role-Based Access Control (RBAC)
- JWT authentication using RS256
- Scalable monorepo architecture with shared tooling
- Test-driven mindset with unit and E2E tests
- Integration with external services (S3, Redis)

---

## 📦 Applications

- **API** – NestJS backend responsible for business rules, authentication, delivery flow and integrations.
- **Web** – Next.js frontend (in development).

---

## 🌍 Monorepo Overview

```bash
  fast-feet/
  ├── apps/
  │   ├── api/                # Backend API (NestJS, Clean Architecture)
  │   └── web/                # Frontend application (UI layer)
  ├── packages/               # Shared internal packages
  │   └── config/             # Shared configurations (eslint, tsconfig, etc.)
  ├── docker/                 # Docker-related files (images, scripts)
  ├── docker-compose.yaml
  ├── turbo.json
  ├── pnpm-workspace.yaml
  └── package.json
```
---

## 📡 API Structure (apps/api)

<details open>
  <summary>
    <strong>🚀 Base Structure</strong>
  </summary>

  <p/>

  ```bash
    api/
    ├── prisma/              # Prisma schema, migrations and seed files
    ├── src/
    │   ├── core/            # Shared abstractions (Either, errors, etc.)
    │   ├── domain/          # Business rules (entities, use-cases)
    │   ├── infra/           # External implementations (DB, HTTP, etc.)
    │   ├── app.module.ts    # Root NestJS module
    │   └── main.ts
    ├── test/                # Testing utilities
    ├── Dockerfile
    └── package.json
  ```
</details>

<details open>
  <summary>
    <strong>📦 Domain Layer</strong>
  </summary>

  <p/>

  ```bash
    domain/
    ├── logistics/                    # Logistics bounded context
    │   ├── application/
    │   │   ├── repositories/         # Repository contracts (interfaces)
    │   │   ├── storage/              # Storage contracts
    │   │   └── use-cases/            # Application use-cases (business flows)
    │   └── enterprise/
    │       └── entities/
    │           ├── errors/           # Domain-specific errors
    │           ├── events/           # Domain events
    │           ├── value-objects/    # Value Objects (CPF, Address, etc.)
    │           ├── order.ts          # Order aggregate root
    │           └── recipient.ts      # Recipient entity
    ├── notification/                 # Notification bounded context
    └── user/                         # User bounded context
  ```
</details>

<details open>
  <summary>
    <strong>🔌 Infra Structure</strong>
  </summary>

  <p/>

  ```bash
    infra/
    ├── auth/                       # Authentication strategies & guards
    ├── cache/                      # Cache providers (Redis, memory, etc.)
    ├── cryptography/               # Hashing & encryption implementations
    ├── database/
    │   ├── prisma/
    │   │   ├── mappers/            # Prisma ↔ Domain mappers
    │   │   ├── repositories/       # Repository implementations
    │   │   └── prisma.service.ts
    │   └── database.module.ts
    ├── env/                        # Environment validation & config
    ├── events/                     # Event dispatchers & listeners
    ├── http/
    │   ├── controllers/            # REST controllers
    │   ├── errors/                 # HTTP error handlers
    │   ├── helpers/                # HTTP helpers (resolveUseCase, etc.)
    │   ├── pipes/                  # Validation pipes (Zod, etc.)
    │   ├── presenters/             # Response presenters (DTO mapping)
    │   └── http.module.ts
    ├── mail/                       # Mail providers
    ├── storage/                    # File storage providers
    ├── app.module.ts
    └── main.ts
  ```
</details>

---

## 🧠 Core Features

### 👤 Users

- Admin and Deliveryman roles
- Authentication with JWT
- Password hashing with bcrypt
- RBAC authorization

### 📦 Orders

- Create, update, and delete deliveries
- Assign deliveries to deliverymen
- Mark delivery as:
  - Available
  - Awaiting
  - Picked up
  - In transit
  - Delivered (with proof image upload)
  - Returned
  - Canceled
- Delivery status change notifications (email)

### 🗄️ Storage & Performance

- Redis caching layer
- AWS S3 integration for proof-of-delivery images
- PostgreSQL with Prisma ORM

---

## 📋 Requirements

Before running the project locally, make sure your environment meets the following requirements:

### 🧰 System & Runtime
- **Node.js ≥ 20**  
  Required for Turborepo, Prisma 7.x, and modern TypeScript tooling.
- **pnpm ≥ 10**  
  Monorepo package manager used across the entire project.

### 🐳 Infrastructure
- **Docker & Docker Compose**  
  Used to run PostgreSQL and ensure a consistent development environment.

### 🗄️ Database
- **PostgreSQL ≥ 14**  
  Relational database accessed via Prisma ORM.

### 🧑‍💻 Development Environment (Optional but Recommended)

- Visual Studio Code

- **VS Code Dev Containers extension**  
  Enables running the project inside a preconfigured development container, ensuring a consistent environment across machines.

---

## 🛠️ Installation & Usage

Follow the steps below to run the project locally.

### 1️⃣ Create a projects directory (WSL)

Open your WSL Ubuntu terminal and create a directory to store your projects:

```bash
mkdir -p ~/projects
cd ~/projects
```

### 2️⃣ Clone the repository

Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/MatheusTG/fast-feet.git
cd fast-feet
```

### 3️⃣ Open the project in VS Code

From the project root, open the workspace in VS Code:

```bash
code .
```

### 4️⃣ Configure Environment Variables

Create a `.env` file inside `apps/api`.

<details>
 
<summary><b>Click to view full .env example</b></summary>

###
 
```env
# ======================================================
# Application Environment
# ======================================================
NODE_ENV="development"
PORT=3333

# ======================================================
# Prisma (Database)
# ======================================================
DATABASE_URL="postgresql://user:password@postgres:5432/fastfeet"
DATABASE_SCHEMA="public"

# ======================================================
# Security (Password Hashing)
# ======================================================
HASH_SALT_ROUNDS=10

# ======================================================
# Email (SMTP / Nodemailer)
# ======================================================
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM_NAME="FastFeet"
EMAIL_FROM_ADDRESS=

# ======================================================
# Cloudflare (File Storage / R2 / CDN)
# ======================================================
CLOUDFLARE_ACCOUNT_ID=

# ======================================================
# AWS S3 (File Uploads)
# ======================================================
AWS_BUCKET_NAME="fast-feet"
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# ======================================================
# Redis (Cache)
# ======================================================
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_DB=0

# ======================================================
# Auth (JWT - RS256)
# ======================================================
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
```
</details>

### 5️⃣ Open the project in a Dev Container

Reopen the workspace inside a Dev Container to ensure a fully configured development environment:

- Open the Command Palette (Ctrl + Shift + P)

- Select Dev Containers: Open Folder in Container

### 6️⃣ Install dependencies

Using pnpm, install all project dependencies:

```bash
pnpm install
```

### 7️⃣ Setup project (database + Prisma)

Run the Turbo setup command to prepare the project environment, including database synchronization and required client generation.

```bash
pnpm turbo setup
```

> [!WARNING]
> This command runs prisma migrate and prisma generate inside the infrastructure app.

### 6️⃣ Run the project

Using pnpm, start the development environment:

```bash
pnpm turbo start:dev
```

> [!IMPORTANT]
> Make sure you have **Docker**, **pnpm**, and the **Dev Containers** extension installed in Visual Studio Code.
> This project is intended to run inside a Dev Container for consistency across environments.

---

## 🔐 Generate JWT Keys (RS256)

This project uses **RS256 (asymmetric encryption)** for JWT authentication.
You must generate a private and public RSA key pair before running the application.

### Windows (PowerShell or CMD)

#### 1️⃣ Generate the private key (RSA 2048)

``` bash
openssl genrsa -out private.key 2048
```

#### 2️⃣ Generate the public key from the private key

``` bash
openssl rsa -in private.key -pubout -out public.key
```

This will generate:

    private.key
    public.key

#### 🔄 Convert Keys to Base64

To avoid line break issues in .env files, convert both keys to Base64.

##### Convert private key
```bash
base64 -w 0 private.key
```

##### Convert public key
```bash
base64 -w 0 public.key
```

This will output a single long string without line breaks.

#### 3️⃣ Add the Base64 keys to your `.env`
```bash
JWT_PRIVATE_KEY_BASE64=MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGB...
JWT_PUBLIC_KEY_BASE64=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
```

---

## 📜 Available Scripts (Turborepo)

The monorepo uses Turborepo for task orchestration and caching across all applications.

### 🏗️ Build

- `pnpm turbo build` – Builds all applications and packages (depends on parent builds). Outputs `dist/` and `.next/`.

### ▶️ Runtime

- `pnpm turbo start` – Starts applications in runtime mode (no cache).
- `pnpm turbo start:dev` – Starts applications in development mode (persistent, no cache).
- `pnpm turbo start:debug` – Starts applications in debug mode (persistent, no cache).
- `pnpm turbo start:prod` – Runs production mode (depends on `build`).

### 🧹 Code Quality

- `pnpm turbo lint` – Runs ESLint across the monorepo.
- `pnpm turbo format` – Formats the entire codebase using Prettier.
- `pnpm turbo format:check` – Checks formatting without applying changes.

### 🧪 Tests

- `pnpm turbo test` – Runs unit tests and generates coverage artifacts.
- `pnpm turbo test:watch` – Runs tests in watch mode (persistent).
- `pnpm turbo test:cov` – Generates coverage reports.
- `pnpm turbo test:debug` – Runs tests in debug mode.
- `pnpm turbo test:e2e` – Runs end-to-end tests.
- `pnpm turbo test:e2e:watch` – Runs E2E tests in watch mode.

---

## 📜 Functional Requirements

Functional requirements describe what the system must do.

- [x] **FR001 - Users:** The system must allow users to be created with roles: `admin` and `deliveryman`.
- [x] **FR002 - Authentication:** The system must allow users to authenticate using CPF and password.
- [x] **FR003 - Authentication:** The system must identify the authenticated user across requests (e.g., JWT tokens).
- [x] **FR004 - Users:** The system must allow listing, updating, and deleting deliverymen (admin only).
- [x] **FR005 - Recipients:** The system must allow CRUD operations for recipients (admin only).
- [x] **FR006 - Orders:** The system must allow CRUD operations for orders (admin only).
- [x] **FR007 - Orders:** The system must allow assigning a deliveryman to an order.
- [x] **FR008 - Orders:** The system must allow marking an order as “waiting” (available for pickup).
- [x] **FR009 - Orders:** The system must allow a deliveryman to pick up an order.
- [x] **FR010 - Orders:** The system must allow a deliveryman to mark an order as delivered, requiring a photo upload.
- [x] **FR011 - Orders:** The system must allow marking an order as returned.
- [x] **FR012 - Orders:** The system must allow listing orders near the deliveryman’s location.
- [x] **FR013 - Orders:** The system must allow a deliveryman to list only their own deliveries.
- [x] **FR014 - Notifications:** The system must notify the recipient whenever the order status changes.

---

## 📐 Business Rules

Business rules define mandatory constraints and behaviors.

- [x] **BR001 - Roles:** Only users with the `admin` role can manage deliverymen, recipients, and orders.
- [x] **BR002 - Ownership:** An order must be assigned to exactly one deliveryman.
- [x] **BR003 - Delivery Proof:** To mark an order as delivered, a delivery photo is mandatory.
- [x] **BR004 - Delivery Control:** Only the assigned deliveryman can mark an order as delivered.
- [x] **BR005 - Visibility:** A deliveryman must not see orders assigned to other deliverymen.
- [x] **BR006 - Password Management:** Only admins can change another user’s password.
- [x] **BR007 - Pickup Flow:** An order must be marked as “waiting” before it can be picked up.
- [x] **BR008 - Status Flow:** Order status must follow a valid lifecycle (waiting → picked up → delivered/returned).

---

## ⚙️ Non-Functional Requirements

Non-functional requirements describe how the system should operate.

- [x] **NFR001 - Architecture:** The API must follow RESTful principles.
- [x] **NFR002 - Security:** The system must ensure authentication and authorization using JWT.
- [x] **NFR003 - Access Control:** The system must use role-based access control (RBAC).
- [x] **NFR004 - Data Management:** Data must be persisted in a relational database.
- [x] **NFR005 - Maintainability:** The codebase must be clean, modular, and maintainable.
- [x] **NFR006 - Testability:** The application must support automated unit and integration tests.
- [x] **NFR007 - File Storage:** Delivery photos must be stored using a scalable storage solution.
- [x] **NFR008 - Performance:** The API must handle concurrent requests efficiently.


---

## 🤝 Contributing

Contributions are welcome and appreciated!

If you want to contribute to this project, please follow the steps below:

1. Fork the repository
2. Create a new branch (`git checkout -b feat/your-feature-name`)
3. Make your changes
4. Commit your changes following the Conventional Commits standard
5. Push your branch (`git push origin feat/your-feature-name`)
6. Open a Pull Request

---

### Commit Convention

This project follows the Conventional Commits specification:

- `feat`: A new feature
- `fix`: A bug fix
- `refactor`: Code refactoring without behavior change
- `test`: Adding or updating tests
- `chore`: Maintenance tasks and tooling changes
- `docs`: Documentation changes

Please make sure your code is well-tested and follows the existing project structure and linting rules.

## 📄 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software, provided that the original copyright
and license notice are included in all copies or substantial portions of the software.

<img src="https://github.com/MatheusTG/MatheusTG/blob/main/images/banner.svg" />
