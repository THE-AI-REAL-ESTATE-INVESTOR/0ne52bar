```mermaid
graph TD
    subgraph "Customer Flow"
        A[Customer Browses Menu] -->|Selects Items| B[Cart]
        B -->|Checkout| C[Enter Info]
        C -->|Submit| D[Create Order]
        D -->|Success| E[Redirect to Merch]
        D -->|Has Phone| F[Check Customer]
        F -->|Existing| G[Link to User]
        F -->|New| H[Create User]
        H --> I[Link Order]
        G --> I
    end

    subgraph "Order Processing"
        D -->|New Order| J[Staff Notification]
        J -->|View| K[Order Details]
        K -->|Update| L[Status Changes]
        L -->|Complete| M[Points Added]
        M -->|If Member| N[Update Member]
    end

    subgraph "Admin Panel"
        O[Admin Dashboard] -->|View| P[All Orders]
        O -->|View| Q[All Customers]
        P -->|Select| K
        Q -->|Select| R[Customer Details]
        R -->|View| S[Order History]
        R -->|If Member| T[Member Details]
    end

    subgraph "Database Relations"
        U[User] -->|has many| V[Orders]
        W[Member] -->|extends| U
        W -->|has many| V
        W -->|has many| X[Visits]
        W -->|has many| Y[Rewards]
    end
```

```mermaid
erDiagram
    User ||--o{ Order : "places"
    User {
        string id PK
        string name
        string email UK
        string phoneNumber UK
        datetime emailVerified
        string image
    }

    Member ||--o{ Order : "places"
    Member ||--o{ Visit : "records"
    Member ||--o{ Reward : "earns"
    Member {
        string id PK
        string memberId UK
        string name
        string email UK
        string phoneNumber
        datetime birthday
        enum membershipLevel
        int points
        int visitCount
        datetime lastVisit
    }

    Order {
        string id PK
        json items
        float total
        string status
        string memberId FK
        string customerId FK
        string phoneNumber IDX
        string customerName
        boolean marketingConsent
        int points
    }

    Visit {
        string id PK
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

    MenuItem ||--o{ Category : "belongs to"
    MenuItem {
        string id PK
        string name
        string description
        string price
        string imageUrl
        boolean isActive
        int sortOrder
        string categoryId FK
        enum status
    }

    Category {
        string id PK
        string name UK
        string description
        int sortOrder
    }
``` 