## Project Setup

### Environment Variables

The following environment variables are required to run the project:

- `PORT`: Port number for the Nest application (e.g., `3000`).
- `JWT_ACCESS_SECRET`: Secret key for JWT token generation.
- `DB_HOST`: Host address for the database (e.g., `127.0.0.1`).
- `DB_PORT`: Port number for the database (e.g., `5433`).
- `DB_USER`: Username for the database (e.g., `postgres`).
- `DB_PASSWORD`: Password for the database user (e.g., `12345678@`).
- `DB_NAME`: Name of the database (e.g., `nest-basic-auth`).

Make sure to create a `.env` file in the root directory of the project and populate it with these variables.

## Installation

```bash
$ npm install
```

## Seed Admin User

```bash
$ npm run seed
```

## Running the app

```bash
$ npm run start:dev
```

## Swagger

[http://localhost:3000/api](http://localhost:3000/api)

## Design Patterns

### Repository Pattern

The project follows the repository pattern for handling database interactions. Separate repository
classes (`UsersRepository`, `TasksRepository`) are responsible for querying and persisting entities in the database.

### DTO Pattern

Data Transfer Objects (DTOs) are used to transfer data between different parts of the application, such as between
controllers and services. This promotes decoupling of data representation from the underlying model and provides a clear
contract for data exchange.

### Guard Pattern

Guards (`JwtAuthGuard`, `LocalAuthGuard`, `IsAdminGuard`) are implemented to protect routes based on conditions like
authentication status or user roles. Guards help in implementing access control logic in a modular and reusable manner,
following the Single Responsibility Principle.

### Decorator Pattern

Custom decorators (`@IsAdmin`) are used to mark certain endpoints or methods with specific metadata, which is then
utilized by guards or other interceptors to apply behaviors or restrictions dynamically. This follows the decorator
pattern, where functionality is added to objects (or methods) dynamically.

### Singleton Pattern

NestJS services are designed as singletons by default, ensuring that there's only one instance of each service class
throughout the application. This promotes reusability and maintains state when necessary.

### Strategy Pattern

Passport.js is utilized for authentication, allowing different authentication strategies to be plugged in based on
requirements (e.g., local strategy, JWT strategy). Passport.js follows the strategy pattern, where algorithms (
strategies) can be interchangeable based on the context.

### Dependency Injection (DI) Pattern

NestJS relies heavily on dependency injection for managing dependencies of components like controllers, services, and
guards. This promotes loose coupling between components, making them easier to test and maintain.

### Facade Pattern

In controllers, services act as facades that abstract away the complexity of business logic and database operations.
This simplifies controllers, making them more focused on handling HTTP requests and responses.

# Project Structure and Organization

## Overview

The project is structured using a modular approach, with each module encapsulating related functionality and following
the principles of separation of concerns and modularity.

## Main Modules

### Authentication Module

- **Purpose**: Handles user authentication and authorization.
- **Components**:
    - Guards: Implement authentication and authorization logic.
    - Strategies: Define authentication strategies (e.g., JWT, local).
    - Controllers: Expose authentication endpoints.
    - Services: Implement business logic for authentication.
    - DTOs: Define data transfer objects for authentication-related data.

### Users Module

- **Purpose**: Manages user-related operations.
- **Components**:
    - Controllers: Expose endpoints for user management.
    - Services: Implement business logic for user-related operations.
    - Repository: Encapsulate database interactions for users.
    - Entities: Define user entity and database schema.
    - DTOs: Define data transfer objects for user-related data.

### Tasks Module

- **Purpose**: Handles task management functionalities.
- **Components**:
    - Controllers: Expose endpoints for task CRUD operations.
    - Services: Implement business logic for task management.
    - Repository: Encapsulate database interactions for tasks.
    - Entities: Define task entity and database schema.
    - DTOs: Define data transfer objects for task-related data.

## Thought Process

- **Separation of Concerns**: Each module focuses on a specific aspect of the application (e.g., authentication, user
  management, task management), ensuring clear separation of concerns and maintainability.

- **Modularity**: Modules are designed to be self-contained and reusable, allowing for easy integration into other
  projects or extension with additional functionality.

- **Scalability**: The modular structure allows for scalability by enabling the addition of new features or modules
  without impacting existing functionality.

- **Flexibility**: The modular architecture provides flexibility to swap out or upgrade individual components (e.g.,
  authentication strategies, database providers) without affecting other parts of the application.

- **Testing**: The modular structure facilitates unit testing by isolating components within each module, making it
  easier to write and maintain tests for specific functionalities.