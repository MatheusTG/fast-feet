![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-in%20development-darkgreen?style=for-the-badge)
![Architecture](https://img.shields.io/badge/architecture-DDD%20%2B%20Clean%20Architecture-purple?style=for-the-badge)

# 🚀 Fast Feet API

This is the **API application** of the Fast Feet monorepo.  
It is built with a strong focus on **Domain-Driven Design (DDD)**, **Clean Architecture**, and long-term maintainability.

This README documents **only the API**, while global tooling, monorepo setup, and shared configuration are described in the **root README**.

---

## 🎯 Purpose

The goal of this API is to demonstrate how to design a backend application that:

- Encapsulates complex business rules using **DDD**
- Separates concerns through **Clean Architecture**
- Remains framework-agnostic at its core
- Is easy to test, evolve, and scale over time

This project prioritizes **clarity of intent over CRUD simplicity**.

---

## 🧠 Architectural Principles

This API follows these core rules:

1. **Domain is independent**  
   The domain layer has no knowledge of frameworks, databases, or external services.

2. **Application orchestrates business rules**  
   Use cases coordinate entities, value objects, and repositories.

3. **Infrastructure is replaceable**  
   HTTP, database, cache, and external services live at the edges.

4. **Dependencies always point inward**  
    Infra → Application → Domain

---

## 🧩 Architecture Overview

The API is structured using **DDD + Clean Architecture** concepts.

```bash
src/
├── core/                    # Shared kernel (framework-agnostic)
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   └── errors/
│
├── domain/                  # Business domain (bounded contexts)
│   └── forum/
│       ├── enterprise/      # Pure domain logic
│       │   ├── entities/
│       │   ├── value-objects/
│       │   └── events/
│       │
│       └── application/     # Use cases
│           ├── use-cases/
│           ├── repositories/
│           └── services/
│
├── infra/                   # Technical implementations
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── mappers/
│   │   │   └── prisma.service.ts
│   │   └── repositories/
│   │
│   ├── http/
│   │   ├── controllers/
│   │   ├── presenters/
│   │   └── http.module.ts
│   │
│   └── app.module.ts
│
└── main.ts                  # Application entry point
```

## 📜 Functional Requirements

Functional requirements describe what the system must do.

- [ ] **FR001 - Users:** The system must allow users to be created with roles: `admin` and `deliveryman`.
- [ ] **FR002 - Authentication:** The system must allow users to authenticate using CPF and password.
- [ ] **FR003 - Authentication:** The system must identify the authenticated user across requests (e.g., JWT tokens).
- [ ] **FR004 - Users:** The system must allow listing, updating, and deleting deliverymen (admin only).
- [ ] **FR005 - Recipients:** The system must allow CRUD operations for recipients (admin only).
- [ ] **FR006 - Orders:** The system must allow CRUD operations for orders (admin only).
- [ ] **FR007 - Orders:** The system must allow assigning a deliveryman to an order.
- [ ] **FR008 - Orders:** The system must allow marking an order as “waiting” (available for pickup).
- [ ] **FR009 - Orders:** The system must allow a deliveryman to pick up an order.
- [ ] **FR010 - Orders:** The system must allow a deliveryman to mark an order as delivered, requiring a photo upload.
- [ ] **FR011 - Orders:** The system must allow marking an order as returned.
- [ ] **FR012 - Orders:** The system must allow listing orders near the deliveryman’s location.
- [ ] **FR013 - Orders:** The system must allow a deliveryman to list only their own deliveries.
- [ ] **FR014 - Notifications:** The system must notify the recipient whenever the order status changes.

---

## 📐 Business Rules

Business rules define mandatory constraints and behaviors.

- [ ] **BR001 - Roles:** Only users with the `admin` role can manage deliverymen, recipients, and orders.
- [ ] **BR002 - Ownership:** An order must be assigned to exactly one deliveryman.
- [ ] **BR003 - Delivery Proof:** To mark an order as delivered, a delivery photo is mandatory.
- [ ] **BR004 - Delivery Control:** Only the assigned deliveryman can mark an order as delivered.
- [ ] **BR005 - Visibility:** A deliveryman must not see orders assigned to other deliverymen.
- [ ] **BR006 - Password Management:** Only admins can change another user’s password.
- [ ] **BR007 - Pickup Flow:** An order must be marked as “waiting” before it can be picked up.
- [ ] **BR008 - Status Flow:** Order status must follow a valid lifecycle (waiting → picked up → delivered/returned).

---

## ⚙️ Non-Functional Requirements

Non-functional requirements describe how the system should operate.

- [ ] **NFR001 - Architecture:** The API must follow RESTful principles.
- [ ] **NFR002 - Security:** The system must ensure authentication and authorization using JWT.
- [ ] **NFR003 - Access Control:** The system must use role-based access control (RBAC).
- [ ] **NFR004 - Data Management:** Data must be persisted in a relational database.
- [ ] **NFR005 - Maintainability:** The codebase must be clean, modular, and maintainable.
- [ ] **NFR006 - Testability:** The application must support automated unit and integration tests.
- [ ] **NFR007 - File Storage:** Delivery photos must be stored using a scalable storage solution.
- [ ] **NFR008 - Performance:** The API must handle concurrent requests efficiently.
