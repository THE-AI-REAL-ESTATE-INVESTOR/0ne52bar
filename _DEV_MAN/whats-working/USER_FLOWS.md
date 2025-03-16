# ONE-52 Bar & Grill - User Flows

## Overview
This document outlines the primary user flows for both customers and administrators of the ONE-52 Bar & Grill web application. It provides a clear understanding of how users interact with the system and how different components work together.

## Customer User Flows

### Website Navigation

```mermaid
graph TD
    HomePage[Home Page] --> Menu[Menu]
    HomePage --> Events[Events]
    HomePage --> Merch[Merchandise]
    HomePage --> TapPass[TapPass Membership]
    Menu --> ItemDetails[Menu Item Details]
    Events --> EventCalendar[Event Calendar]
    EventCalendar --> EventDetails[Event Details]
    EventDetails --> RSVP[RSVP Form]
    TapPass --> Registration[Registration Form]
    TapPass --> MemberLookup[Member Lookup]
    MemberLookup --> MemberDetails[Member Details]
```

### TapPass Membership Flow

```mermaid
sequenceDiagram
    participant Customer
    participant UI as Web Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Customer->>UI: Navigate to TapPass registration
    UI->>Customer: Show registration form
    Customer->>UI: Fill form and submit
    UI->>ServerAction: registerTapPassMember(formData)
    ServerAction->>DB: Create new Member
    DB->>ServerAction: Return created Member
    ServerAction->>UI: Return success + memberId
    UI->>Customer: Show success message & membership details
    UI->>ServerAction: Generate membership card
    ServerAction->>Customer: Email membership card
```

### Menu Browsing Flow

```mermaid
sequenceDiagram
    participant Customer
    participant UI as Web Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Customer->>UI: Navigate to Menu
    UI->>ServerAction: getMenuCategories()
    ServerAction->>DB: Query MenuCategory
    DB->>ServerAction: Return categories
    ServerAction->>UI: Display categories
    Customer->>UI: Select category
    UI->>ServerAction: getMenuItems(categoryId)
    ServerAction->>DB: Query MenuItems
    DB->>ServerAction: Return menu items
    ServerAction->>UI: Display menu items
    Customer->>UI: View item details
```

### Event RSVP Flow

```mermaid
sequenceDiagram
    participant Customer
    participant UI as Web Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Customer->>UI: Navigate to Events
    UI->>ServerAction: getEvents()
    ServerAction->>DB: Query Events
    DB->>ServerAction: Return events
    ServerAction->>UI: Display event calendar
    Customer->>UI: Click on event
    UI->>ServerAction: getEventById(id)
    ServerAction->>DB: Query Event
    DB->>ServerAction: Return event details
    ServerAction->>UI: Display event details
    Customer->>UI: Click RSVP
    UI->>Customer: Show RSVP form
    Customer->>UI: Fill form and submit
    UI->>ServerAction: rsvpToEvent(formData)
    ServerAction->>DB: Create EventAttendee
    DB->>ServerAction: Return confirmation
    ServerAction->>UI: Show confirmation
    UI->>Customer: Display success & confirmation details
```

### Merchandise Browsing Flow

```mermaid
sequenceDiagram
    participant Customer
    participant UI as Web Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Customer->>UI: Navigate to Merchandise
    UI->>ServerAction: getCategories()
    ServerAction->>DB: Query MerchandiseCategory
    DB->>ServerAction: Return categories
    ServerAction->>UI: Display categories
    UI->>ServerAction: getMerchandise()
    ServerAction->>DB: Query Merchandise
    DB->>ServerAction: Return merchandise items
    ServerAction->>UI: Display merchandise with "Coming Soon"
    Customer->>UI: Browse merchandise
```

## Admin User Flows

### Admin Navigation

```mermaid
graph TD
    AdminLogin[Admin Login] --> Dashboard[Dashboard]
    Dashboard --> TapPassAdmin[TapPass Management]
    Dashboard --> MenuAdmin[Menu Management]
    Dashboard --> MerchAdmin[Merchandise Management]
    Dashboard --> EventAdmin[Event Management]
    Dashboard --> SettingsAdmin[Settings]
    
    TapPassAdmin --> MembersList[Members List]
    TapPassAdmin --> VisitTracking[Visit Tracking]
    TapPassAdmin --> RewardManagement[Reward Management]
    
    MenuAdmin --> CategoryManagement[Category Management]
    MenuAdmin --> ItemManagement[Item Management]
    
    MerchAdmin --> MerchCategoryManagement[Category Management]
    MerchAdmin --> MerchItemManagement[Item Management]
    
    EventAdmin --> EventManagement[Event Management]
    EventAdmin --> TagManagement[Tag Management]
    EventAdmin --> AttendeeManagement[Attendee Management]
```

### TapPass Member Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UI as Admin Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Admin->>UI: Navigate to TapPass admin
    UI->>ServerAction: getAllMembers()
    ServerAction->>DB: Query all Members
    DB->>ServerAction: Return members
    ServerAction->>UI: Display members list
    
    alt View Member Details
        Admin->>UI: Click on member
        UI->>ServerAction: getMemberById(id)
        ServerAction->>DB: Query Member
        DB->>ServerAction: Return member details
        ServerAction->>UI: Display member details
    else Add Visit
        Admin->>UI: Click "Add Visit"
        UI->>Admin: Show visit form
        Admin->>UI: Enter visit details
        UI->>ServerAction: recordVisit(formData)
        ServerAction->>DB: Create Visit
        DB->>ServerAction: Return updated details
        ServerAction->>UI: Show updated member info
    else Edit Member
        Admin->>UI: Click "Edit"
        UI->>Admin: Show edit form
        Admin->>UI: Update member details
        UI->>ServerAction: updateMember(formData)
        ServerAction->>DB: Update Member
        DB->>ServerAction: Return updated member
        ServerAction->>UI: Show success message
    end
```

### Menu Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UI as Admin Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Admin->>UI: Navigate to Menu admin
    UI->>ServerAction: getMenuCategories()
    ServerAction->>DB: Query MenuCategories
    DB->>ServerAction: Return categories
    ServerAction->>UI: Display categories
    
    alt Add Category
        Admin->>UI: Click "Add Category"
        UI->>Admin: Show category form
        Admin->>UI: Enter category details
        UI->>ServerAction: createMenuCategory(formData)
        ServerAction->>DB: Create MenuCategory
        DB->>ServerAction: Return new category
        ServerAction->>UI: Show updated category list
    else Manage Items
        Admin->>UI: Click "View Items" for category
        UI->>ServerAction: getMenuItems(categoryId)
        ServerAction->>DB: Query MenuItems
        DB->>ServerAction: Return items
        ServerAction->>UI: Display items list
        
        alt Add Item
            Admin->>UI: Click "Add Item"
            UI->>Admin: Show item form
            Admin->>UI: Enter item details
            UI->>ServerAction: createMenuItem(formData)
            ServerAction->>DB: Create MenuItem
            DB->>ServerAction: Return new item
            ServerAction->>UI: Show updated item list
        else Edit Item
            Admin->>UI: Click "Edit" on item
            UI->>ServerAction: getMenuItem(id)
            ServerAction->>DB: Query MenuItem
            DB->>ServerAction: Return item details
            ServerAction->>UI: Show edit form
            Admin->>UI: Update item details
            UI->>ServerAction: updateMenuItem(formData)
            ServerAction->>DB: Update MenuItem
            DB->>ServerAction: Return updated item
            ServerAction->>UI: Show success message
        else Delete Item
            Admin->>UI: Click "Delete" on item
            UI->>Admin: Show confirmation dialog
            Admin->>UI: Confirm deletion
            UI->>ServerAction: deleteMenuItem(id)
            ServerAction->>DB: Delete MenuItem
            DB->>ServerAction: Confirm deletion
            ServerAction->>UI: Remove item from list
        end
    end
```

### Merchandise Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UI as Admin Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Admin->>UI: Navigate to Merchandise admin
    UI->>ServerAction: getCategories()
    ServerAction->>DB: Query MerchandiseCategories
    DB->>ServerAction: Return categories
    ServerAction->>UI: Display categories tab
    
    UI->>ServerAction: getMerchandise()
    ServerAction->>DB: Query Merchandise
    DB->>ServerAction: Return items
    ServerAction->>UI: Display items tab
    
    alt Manage Categories
        Admin->>UI: View Categories tab
        
        alt Add Category
            Admin->>UI: Click "Add Category"
            UI->>Admin: Show category form
            Admin->>UI: Enter category details
            UI->>ServerAction: createCategory(formData)
            ServerAction->>DB: Create MerchandiseCategory
            DB->>ServerAction: Return new category
            ServerAction->>UI: Show updated category list
        else Edit Category
            Admin->>UI: Click "Edit" on category
            UI->>ServerAction: getCategoryById(id)
            ServerAction->>DB: Query Category
            DB->>ServerAction: Return category details
            ServerAction->>UI: Show edit form
            Admin->>UI: Update category details
            UI->>ServerAction: updateCategory(formData)
            ServerAction->>DB: Update Category
            DB->>ServerAction: Return updated category
            ServerAction->>UI: Show success message
        else Delete Category
            Admin->>UI: Click "Delete" on category
            UI->>Admin: Show confirmation dialog
            Admin->>UI: Confirm deletion
            UI->>ServerAction: deleteCategory(id)
            ServerAction->>DB: Check if category has items
            ServerAction->>UI: Show error if items exist
            ServerAction->>DB: Delete Category if no items
            DB->>ServerAction: Confirm deletion
            ServerAction->>UI: Update category list
        end
    else Manage Items
        Admin->>UI: View Items tab
        
        alt Add Item
            Admin->>UI: Click "Add Item"
            UI->>Admin: Show item form
            Admin->>UI: Enter item details
            UI->>ServerAction: createMerchandise(formData)
            ServerAction->>DB: Create Merchandise
            DB->>ServerAction: Return new item
            ServerAction->>UI: Show updated item list
        else Edit Item
            Admin->>UI: Click "Edit" on item
            UI->>ServerAction: getMerchandiseById(id)
            ServerAction->>DB: Query Merchandise
            DB->>ServerAction: Return item details
            ServerAction->>UI: Show edit form
            Admin->>UI: Update item details
            UI->>ServerAction: updateMerchandise(formData)
            ServerAction->>DB: Update Merchandise
            DB->>ServerAction: Return updated item
            ServerAction->>UI: Show success message
        else Delete Item
            Admin->>UI: Click "Delete" on item
            UI->>Admin: Show confirmation dialog
            Admin->>UI: Confirm deletion
            UI->>ServerAction: deleteMerchandise(id)
            ServerAction->>DB: Delete Merchandise
            DB->>ServerAction: Confirm deletion
            ServerAction->>UI: Remove item from list
        else Bulk Update
            Admin->>UI: Select multiple items
            Admin->>UI: Click "Update Status"
            UI->>Admin: Show status options
            Admin->>UI: Select status (Coming Soon/In Stock)
            UI->>ServerAction: updateMerchandiseStatus(ids, status)
            ServerAction->>DB: Update multiple items
            DB->>ServerAction: Confirm updates
            ServerAction->>UI: Show updated status
        end
    end
```

### Event Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UI as Admin Interface
    participant ServerAction as Server Actions
    participant DB as Prisma Database
    
    Admin->>UI: Navigate to Events admin
    UI->>ServerAction: getEvents()
    ServerAction->>DB: Query Events
    DB->>ServerAction: Return events
    ServerAction->>UI: Display events list
    
    alt Create Event
        Admin->>UI: Click "Create Event"
        UI->>ServerAction: getEventTags()
        ServerAction->>DB: Query EventTags
        DB->>ServerAction: Return tags
        ServerAction->>UI: Show event form with tags
        Admin->>UI: Enter event details and select tags
        UI->>ServerAction: createEvent(formData)
        ServerAction->>DB: Create Event & associations
        DB->>ServerAction: Return new event
        ServerAction->>UI: Show success message
    else Edit Event
        Admin->>UI: Click on event
        UI->>ServerAction: getEventById(id)
        ServerAction->>DB: Query Event & relations
        DB->>ServerAction: Return event details
        ServerAction->>UI: Show edit form
        Admin->>UI: Update event details
        UI->>ServerAction: updateEvent(formData)
        ServerAction->>DB: Update Event
        DB->>ServerAction: Return updated event
        ServerAction->>UI: Show success message
    else Manage Attendees
        Admin->>UI: Click "View Attendees" on event
        UI->>ServerAction: getEventAttendees(eventId)
        ServerAction->>DB: Query EventAttendees
        DB->>ServerAction: Return attendees
        ServerAction->>UI: Display attendees list
        Admin->>UI: Update attendee status
        UI->>ServerAction: updateAttendeeStatus(id, status)
        ServerAction->>DB: Update EventAttendee
        DB->>ServerAction: Return updated attendee
        ServerAction->>UI: Show updated status
    else Manage Tags
        Admin->>UI: Navigate to Tags tab
        UI->>ServerAction: getEventTags()
        ServerAction->>DB: Query EventTags
        DB->>ServerAction: Return tags
        ServerAction->>UI: Display tags list
        Admin->>UI: Add/Edit/Delete tags
    end
```

## Data Flow & Relationships

### Primary Data Relationships

```mermaid
erDiagram
    Member ||--o{ Visit : has
    Member ||--o{ Reward : receives
    
    MenuCategory ||--o{ MenuItem : contains
    
    MerchandiseCategory ||--o{ Merchandise : contains
    
    Event ||--o{ EventAttendee : has
    Event }o--o{ EventTag : has
```

### Integration Points

The following diagram shows how different parts of the application integrate:

```mermaid
graph TD
    subgraph "Customer-Facing Site"
        HomePage[Home Page]
        MenuPage[Menu Page]
        MerchPage[Merchandise Page]
        EventsPage[Events Page]
        TapPassPage[TapPass Page]
    end
    
    subgraph "Admin Portal"
        AdminDashboard[Dashboard]
        TapPassAdmin[TapPass Admin]
        MenuAdmin[Menu Admin]
        MerchAdmin[Merchandise Admin]
        EventsAdmin[Events Admin]
    end
    
    subgraph "Server Actions"
        TapPassActions[TapPass Actions]
        MenuActions[Menu Actions]
        MerchActions[Merchandise Actions]
        EventActions[Event Actions]
    end
    
    subgraph "Database"
        MemberDB[Member Tables]
        MenuDB[Menu Tables]
        MerchDB[Merchandise Tables]
        EventDB[Event Tables]
    end
    
    HomePage --> MenuPage
    HomePage --> MerchPage
    HomePage --> EventsPage
    HomePage --> TapPassPage
    
    TapPassPage --> TapPassActions
    MenuPage --> MenuActions
    MerchPage --> MerchActions
    EventsPage --> EventActions
    
    AdminDashboard --> TapPassAdmin
    AdminDashboard --> MenuAdmin
    AdminDashboard --> MerchAdmin
    AdminDashboard --> EventsAdmin
    
    TapPassAdmin --> TapPassActions
    MenuAdmin --> MenuActions
    MerchAdmin --> MerchActions
    EventsAdmin --> EventActions
    
    TapPassActions --> MemberDB
    MenuActions --> MenuDB
    MerchActions --> MerchDB
    EventActions --> EventDB
```

## Summary of System Interactions

1. **Customer Interactions**:
   - Browse menu items by category
   - View merchandise items (marked as "Coming Soon")
   - Register for TapPass membership
   - View and RSVP to upcoming events
   - Receive membership cards via email

2. **Admin Interactions**:
   - Manage TapPass members and track visits
   - Create and update menu categories and items
   - Manage merchandise inventory and categories
   - Create and publish events
   - Track event attendees and RSVPs
   - Configure site settings (future)

3. **System Processes**:
   - Email delivery of membership cards
   - Points calculation for member visits
   - Reward issuance based on points (future)
   - Event calendar generation
   - Image upload and management

## Conclusion

This document provides a comprehensive overview of the user flows in the ONE-52 Bar & Grill application. It outlines how different components interact and how data flows through the system. By understanding these flows, developers can ensure that new features integrate properly with the existing system, and staff can better understand how the application supports their business operations. 