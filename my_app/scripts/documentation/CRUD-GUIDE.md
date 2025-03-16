# CRUD Operations Guide

This guide explains how to use the server action utilities to implement CRUD operations for your models.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Using the Model Generator](#using-the-model-generator)
4. [Manual Creation](#manual-creation)
5. [Using Server Actions](#using-server-actions)
6. [UI Integration](#ui-integration)
7. [Error Handling](#error-handling)
8. [Validation](#validation)
9. [Advanced Usage](#advanced-usage)
10. [Troubleshooting](#troubleshooting)

## Overview

The CRUD utilities provide a standardized way to implement Create, Read, Update, and Delete operations for your Prisma models. The system is built on:

- **Model Factory**: Generate Zod schemas for your models
- **Action Factory**: Create standardized server actions
- **API Response**: Standardized response format
- **Error Handling**: Consistent error handling
- **Validation**: Input validation using Zod

## Setup

Before using these utilities, ensure you have the required dependencies:

```bash
# Install dependencies
pnpm add zod

# Make scripts executable
chmod +x scripts/generate-model-actions.ts
chmod +x scripts/fix-dependencies.ts

# Fix any dependency issues 
pnpm exec ts-node scripts/fix-dependencies.ts
```

## Using the Model Generator

The easiest way to implement CRUD operations is to use the model generator script:

```bash
# Generate for all models
pnpm exec ts-node scripts/generate-model-actions.ts

# Generate for a specific model
pnpm exec ts-node scripts/generate-model-actions.ts User
```

This will:
1. Analyze your Prisma schema
2. Generate Zod schemas for your models in `src/app/models/{model}.ts`
3. Create server actions in `src/app/actions/{model}-actions.ts`

## Manual Creation

If you prefer to create these files manually, follow these steps:

### 1. Create a Model Schema

```typescript
// src/app/models/user.ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
});

const UserCreateSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

const UserUpdateSchema = UserSchema.partial().extend({
  id: z.string().min(1, { message: "ID is required" })
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export {
  UserSchema,
  UserCreateSchema,
  UserUpdateSchema
};
```

### 2. Create Server Actions

```typescript
// src/app/actions/user-actions.ts
"use server";

import { UserSchema, UserCreateSchema, UserUpdateSchema } from "@/app/models/user";
import { createModelActions } from "@/lib/server/action-factory";

const UserActions = createModelActions(
  "user", // Prisma model name (camelCase)
  UserCreateSchema,
  UserUpdateSchema,
  {
    defaultSortField: "updatedAt",
    relations: [] // Add relation names here
  }
);

export const createUser = UserActions.create;
export const getUser = UserActions.getById;
export const updateUser = UserActions.update;
export const deleteUser = UserActions.remove;
export const listUsers = UserActions.list;
```

## Using Server Actions

Once you've generated the server actions, you can use them in your components:

### Create

```typescript
import { createUser } from "@/app/actions/user-actions";

// In a React component
async function handleCreateUser(formData: FormData) {
  const result = await createUser({
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    // other fields...
  });
  
  if (result.success) {
    // Handle success
    console.log("User created:", result.data);
  } else {
    // Handle error
    console.error("Error creating user:", result.error);
  }
}
```

### Read

```typescript
import { getUser, listUsers } from "@/app/actions/user-actions";

// Get a single user
const userResult = await getUser("user-id-123");
if (userResult.success) {
  const user = userResult.data;
  // Use user data
}

// List users with pagination
const usersResult = await listUsers({ 
  page: 1, 
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "desc" 
});

if (usersResult.success) {
  const users = usersResult.data;
  const pagination = usersResult.pagination;
  // Use users data and pagination
}
```

### Update

```typescript
import { updateUser } from "@/app/actions/user-actions";

const result = await updateUser({
  id: "user-id-123",
  name: "New Name",
  // other fields to update...
});

if (result.success) {
  // Handle success
}
```

### Delete

```typescript
import { deleteUser } from "@/app/actions/user-actions";

const result = await deleteUser("user-id-123");
if (result.success) {
  // Handle success
}
```

## UI Integration

### Form Example

```tsx
"use client";

import { useState } from "react";
import { createUser } from "@/app/actions/user-actions";
import type { UserCreate } from "@/app/models/user";

export default function UserForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const userData: UserCreate = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
    };
    
    const result = await createUser(userData);
    
    setLoading(false);
    
    if (result.success) {
      // Reset form or redirect
    } else {
      setError(result.error);
    }
  }
  
  return (
    <form action={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

### Data Table Example

```tsx
import { listUsers } from "@/app/actions/user-actions";

export default async function UserList() {
  const result = await listUsers({ page: 1, pageSize: 10 });
  
  if (!result.success) {
    return <div>Error loading users: {result.error}</div>;
  }
  
  const { data: users, pagination } = result;
  
  return (
    <div>
      <h1>Users</h1>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <a href={`/users/${user.id}/edit`}>Edit</a>
                {/* Delete button/action */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        {/* Pagination controls */}
      </div>
    </div>
  );
}
```

## Error Handling

The API responses are standardized to make error handling consistent:

```typescript
// Success response
{
  success: true,
  data: { /* your data */ },
  message?: "Optional success message"
}

// Error response
{
  success: false,
  error: "Error message",
  code?: "ERROR_CODE",
  details?: { /* additional error details */ }
}
```

For validation errors, the details will include field-specific errors:

```typescript
{
  success: false,
  error: "Validation error",
  code: "VALIDATION_ERROR",
  details: {
    "email": "Invalid email address",
    "name": "Name is required"
  }
}
```

## Validation

The system uses Zod for validation. You can customize the validation rules in your model schema files:

```typescript
const UserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
});
```

## Advanced Usage

### Custom Filtering

```typescript
import { listUsers } from "@/app/actions/user-actions";

// Filter by name containing "John"
const result = await listUsers(
  { page: 1, pageSize: 10 },
  [{ field: "name", condition: "contains", value: "John" }]
);
```

### Soft Delete

When creating your server actions, you can enable soft delete:

```typescript
const UserActions = createModelActions(
  "user",
  UserCreateSchema,
  UserUpdateSchema,
  {
    softDelete: true // Requires a deletedAt field in your model
  }
);
```

### Including Relations

You can include related models in the response:

```typescript
const UserActions = createModelActions(
  "user",
  UserCreateSchema,
  UserUpdateSchema,
  {
    relations: ["posts", "profile"] // Include these relations in responses
  }
);
```

### Custom Server Actions

You can extend the generated server actions with custom ones:

```typescript
"use server";

import { createModelActions } from "@/lib/server/action-factory";
import { UserSchema, UserCreateSchema, UserUpdateSchema } from "@/app/models/user";
import { createSuccessResponse, safeAsync } from "@/lib/utils/api-response";
import { prisma } from "@/lib/prisma";

const UserActions = createModelActions(
  "user",
  UserCreateSchema, 
  UserUpdateSchema
);

// Re-export standard CRUD actions
export const createUser = UserActions.create;
export const getUser = UserActions.getById;
export const updateUser = UserActions.update;
export const deleteUser = UserActions.remove;
export const listUsers = UserActions.list;

// Add custom actions
export async function getUserWithPosts(userId: string) {
  return safeAsync(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { posts: true }
    });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return createSuccessResponse(user);
  });
}
```

## Troubleshooting

### Zod Module Not Found

If you're seeing errors like "Cannot find module 'zod' or its corresponding type declarations", run the dependency fixer:

```bash
pnpm exec ts-node scripts/fix-dependencies.ts
```

This will:
1. Check for common import issues
2. Install missing dependencies
3. Fix common linter errors

### Type Errors with Server Actions

If you're seeing TypeScript errors with server action responses, make sure you're properly checking the `success` property:

```typescript
const result = await createUser(userData);

if (result.success) {
  // Safe to access result.data here
  console.log(result.data);
} else {
  // Safe to access result.error here
  console.error(result.error);
}
```

### Prisma PaginatedResponse Type Error

If you're seeing errors with the paginated response, ensure you're using type assertions or properly typing your variables:

```typescript
type PaginatedUsers = PaginatedResponse<User>;

// When using listUsers
const result = await listUsers({ page: 1 }) as ApiResponse<PaginatedUsers>;

if (result.success) {
  const users = result.data;
  // Now typescript knows users is User[]
}
``` 