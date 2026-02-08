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