# Database Schema Documentation

## Core Models Relationship

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User {
        string id PK "cuid"
        string name "optional"
        string email "unique, optional"
        string phoneNumber "optional"
        datetime emailVerified
        string image
    }

    Member ||--o{ Order : places
    Member ||--o{ Visit : records
    Member ||--o{ Reward : earns
    Member {
        string id PK "cuid"
        string memberId UK "TapPass ID"
        string name
        string email UK
        string phoneNumber
        datetime birthday
        boolean agreeToTerms
        enum membershipLevel "BRONZE/SILVER/GOLD/PLATINUM"
        int points
        int visitCount
        datetime lastVisit
    }

    Order {
        string id PK "cuid"
        json items
        float total
        enum status "PENDING/PREPARING/READY/COMPLETED/CANCELLED"
        string memberId FK "optional"
        string phoneNumber
        string customerName
        boolean marketingConsent
        int points
    }
```

## Menu System

```mermaid
erDiagram
    Category ||--o{ MenuItem : contains
    MenuItem {
        string id PK "uuid"
        string name
        string price
        string description
        boolean isActive
        int sortOrder
        string imageUrl
        enum status "AVAILABLE/NEEDS_PRICING/COMING_SOON/ARCHIVED"
    }
    Category {
        string id PK "uuid"
        string name UK
        string description
        int sortOrder
    }
```

## Merchandise System

```mermaid
erDiagram
    MerchandiseCategory ||--o{ Merchandise : contains
    Merchandise {
        string id PK "cuid"
        string name
        string description
        string price
        string imagePath
        boolean inStock
        boolean comingSoon
        int sortOrder
    }
    MerchandiseCategory {
        string id PK "cuid"
        string name UK
        string description
    }
```

## Events System

```mermaid
erDiagram
    Event ||--o{ EventAttendee : has
    Event }o--|| EventTag : tagged_with
    Event {
        string id PK "cuid"
        string title
        string date
        string time
        string description
        string image
        string facebookEventUrl
    }
    EventTag {
        string id PK "cuid"
        string name
        string color
    }
    EventAttendee {
        string id PK "cuid"
        string name
        string email
    }
```

## Rewards & Visits

```mermaid
erDiagram
    Member ||--o{ Visit : records
    Member ||--o{ Reward : earns
    Visit {
        string id PK "cuid"
        string memberId FK
        datetime visitDate
        float amount
        int points
    }
    Reward {
        string id PK
        string memberId FK
        string rewardType
        string description
        float value
        boolean isRedeemed
        datetime redeemedAt
        datetime expiresAt
    }
```

## Key Points

1. **Authentication & Users**
   - Base `User` model for authentication
   - Extended `Member` model for TapPass members
   - Secure session handling with `Account` and `Session` models

2. **Order System**
   - Orders can be linked to Members (TapPass) optionally
   - All orders require phone number and customer name
   - Points system integrated with orders

3. **Menu Management**
   - Hierarchical menu with categories
   - Detailed item status tracking
   - Price and availability management

4. **Merchandise System**
   - Separate from menu items
   - Category-based organization
   - Stock and availability tracking

5. **Events & Attendance**
   - Event management with tagging
   - Attendee tracking
   - Social media integration

6. **Loyalty System**
   - Visit tracking with points
   - Reward management
   - Member levels (BRONZE to PLATINUM)

## Current Schema Status

- All models have proper timestamps (`createdAt`/`updatedAt`)
- Unique constraints on critical fields
- Proper indexing on foreign keys
- Enum types for status fields
- JSON storage for order items

## Proposed Improvements

1. **Phone Number Handling**
   - Make phone numbers unique in Member model
   - Add phone number validation
   - Standardize phone number format

2. **Order-Customer Relationship**
   - Add direct link between Orders and Users
   - Maintain phone number for quick lookups
   - Improve customer history tracking

3. **Points System Enhancement**
   - Add points calculation rules
   - Implement points expiry
   - Track points history

Would you like me to:
1. Detail any specific part of the schema?
2. Create migration files for the proposed improvements?
3. Add more documentation about specific features? 