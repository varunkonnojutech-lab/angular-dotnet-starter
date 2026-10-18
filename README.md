# Angular + .NET Starter

[![Build](https://github.com/varunkonnojutech-lab/angular-dotnet-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/varunkonnojutech-lab/angular-dotnet-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4)](https://dotnet.microsoft.com/)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/varunkonnojutech-lab/angular-dotnet-starter)

A full-stack starter: an ASP.NET Core 8 Web API backend with JWT authentication and an Angular 18 frontend (standalone components) that logs in and manages a per-user todo list.

## Who is this for

Full-stack developers who want a working Angular + .NET template with real auth — register, log in, and call protected endpoints — without wiring it all up from scratch.

## What you'll learn

- JWT auth end to end: register/login on the API, token storage, and automatic `Authorization` headers
- Angular 18 standalone components (no NgModules), routing, and route guards
- HTTP interceptors that attach the JWT to every request
- Per-user data scoping on the backend via the token's `sub` claim
- Reactive forms for login/register

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) with npm — or click **Open in GitHub Codespaces** above for a ready-made environment in your browser, no install needed.

## Quick start

```bash
git clone https://github.com/varunkonnojutech-lab/angular-dotnet-starter.git
cd angular-dotnet-starter
```

### 1. Start the backend

```bash
cd backend
dotnet run
```

Swagger is available at `https://localhost:7299/swagger` (fixed dev port via `launchSettings.json`).

### 2. Start the frontend

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

## How it works

The Angular app calls the .NET API with `fetch`/HttpClient. On login, the API returns a JWT; an HTTP interceptor attaches it as a `Bearer` token to every subsequent request. The backend validates the token and scopes all todo operations to the user id in the token's `sub` claim — users can only see and change their own todos. An Angular route guard keeps logged-out visitors on the login page.

## Demo flow

1. On the login page, click **"No account? Register"** and create a user.
2. You land on the todo list — add a todo, tick it done, delete it.
3. Click **Logout**, then try visiting `http://localhost:4200/todos` directly — the auth guard bounces you back to `/login`.

## Backend endpoints

| Method | Route               | Auth | Description                    |
|--------|---------------------|------|--------------------------------|
| POST   | /api/auth/register  | —    | Register → returns JWT         |
| POST   | /api/auth/login     | —    | Login → returns JWT            |
| GET    | /api/todos          | JWT  | List the current user's todos  |
| GET    | /api/todos/{id}     | JWT  | Get one todo                   |
| POST   | /api/todos          | JWT  | Create a todo                  |
| PUT    | /api/todos/{id}     | JWT  | Update title / done state      |
| DELETE | /api/todos/{id}     | JWT  | Delete a todo                  |

Example:

```bash
# Register
TOKEN=$(curl -sk -X POST https://localhost:7299/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"varun","password":"secret123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Add a todo
curl -sk -X POST https://localhost:7299/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the starter"}'
```

## Project structure

```
angular-dotnet-starter/
├── backend/                      # ASP.NET Core 8 Web API
│   ├── Controllers/              # AuthController, TodosController
│   ├── Data/                     # AppDbContext (EF Core InMemory)
│   ├── Dtos/                     # Register/Login/AuthResponse/Todo DTOs
│   ├── Models/                   # User, Todo
│   ├── Services/                 # PasswordHasher, JwtTokenService
│   ├── Program.cs                # DI, JWT, CORS, Swagger wiring
│   ├── Properties/launchSettings.json  # Fixed dev ports (https 7299)
│   └── appsettings.json          # JWT settings
├── frontend/                     # Angular 18 (standalone)
│   └── src/
│       ├── main.ts               # bootstrapApplication
│       ├── index.html
│       ├── styles.css
│       └── app/
│           ├── app.config.ts     # provideRouter + HTTP interceptor
│           ├── app.routes.ts     # login / todos / guard
│           ├── app.component.ts  # router-outlet shell
│           ├── core/             # auth.service, auth.interceptor, auth.guard, todo.service
│           └── features/
│               ├── login/        # login.component.ts (reactive forms)
│               └── todos/        # todos.component.ts (list/add/toggle/delete)
├── .devcontainer/                # One-click GitHub Codespaces setup (.NET + Node)
├── .github/workflows/ci.yml      # CI: builds the backend on push
└── LICENSE
```

## Security notes

- `PasswordHasher` uses salted SHA-256 — fine for a demo, **not** for production. Use PBKDF2, bcrypt, or ASP.NET Core Identity's `PasswordHasher` for real apps.
- The JWT signing key in `appsettings.json` is a dev default. Override it in production via the `Jwt__Key` environment variable.

## Next steps

Prefer React? Continue with [react-dotnet-starter](https://github.com/varunkonnojutech-lab/react-dotnet-starter) — the same JWT backend pattern with a React 18 + Vite frontend.

## License

MIT — see [LICENSE](LICENSE).
