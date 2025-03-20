# Events System Documentation

## Overview
The events system currently uses a hybrid approach with both hardcoded events and Facebook event integration capabilities. This document explains how events are managed, sorted, and displayed across different parts of the application.

## Current Date Definition

### 1. Date Source
The current date is defined in the `EventsClient` component with the following logic:

```typescript
const [appDate, setAppDate] = useState<Date | null>(null);

useEffect(() => {
  // Check if there's a date parameter for demo/testing purposes
  const dateParam = searchParams.get('demoDate');
  
  if (dateParam) {
    // If date parameter exists, use it
    const parsedDate = new Date(dateParam);
    
    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      setAppDate(parsedDate);
    } else {
      setAppDate(new Date());
    }
  } else {
    // Use the current date
    setAppDate(new Date());
  }
}, [searchParams]);
```

### 2. Date Normalization
For consistent date comparisons, the time component is set to midnight:
```typescript
const today = new Date(appDate);
today.setHours(0, 0, 0, 0);
```

### 3. Development Mode Date Controls
In development mode, there are controls to override the current date for testing:
- Default: Uses actual current date (`new Date()`)
- Demo dates available:
  - Current Date
  - March 14, 2025
  - October 30, 2024
  - April 1, 2025

### 4. Date Usage
The normalized date (`today`) is used to:
1. Split events into upcoming and past categories
2. Sort events within each category
3. Display the current date in the UI for development purposes

## Data Sources

### 1. Hardcoded Events (`src/data/events.ts`)
- Contains a static array of upcoming events
- Each event has properties:
  - `id`: Unique identifier
  - `title`: Event name
  - `date`: Date in YYYY-MM-DD format
  - `time`: Time in HH:MM AM/PM format
  - `description`: Event details
  - `image`: Path to event image
  - `facebookEventUrl`: Link to Facebook event

### 2. Facebook Events (`src/components/EventsList.tsx`)
- Component designed to display Facebook events
- Currently using mock data but structured for Facebook API integration
- Different data structure from hardcoded events:
  - Uses `start_time` instead of separate date/time
  - Includes Facebook-specific fields like `attending_count`, `cover`, `place`

## Date Sorting Logic

### 1. Events Page (`/events`)
The events page uses a sophisticated date sorting system:

1. **Initial Data Loading**:
   ```typescript
   const allEvents = getAllEvents();
   ```

2. **Date Processing**:
   - Current date is normalized (time set to midnight) for consistent comparison
   - Events are split into two categories:
     - Upcoming Events: Events with dates >= today
     - Past Events: Events with dates < today

3. **Sorting Rules**:
   - Upcoming Events: Sorted by date (earliest first)
   - Past Events: Sorted by date (most recent first)

### 2. Main Page Events Display
The main page uses the `EventsList` component which:
- Displays events in a grid layout
- Formats dates using `toLocaleDateString` with options:
  ```typescript
  {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  ```

## Date Handling

### 1. Date Formatting
- Input format: YYYY-MM-DD (from events.ts)
- Display format: "Weekday, Month Day, Year" (e.g., "Friday, March 14, 2025")
- Time is displayed separately in 12-hour format with AM/PM

### 2. Date Comparisons
- All date comparisons are done with normalized dates (time set to midnight)
- This ensures consistent sorting regardless of event time
- Example:
  ```typescript
  const today = new Date(appDate);
  today.setHours(0, 0, 0, 0);
  ```

## Current Event Dates (as of last update)
- KOBY ALLEN LIVE: March 14, 2025
- St. Paddy's Bash: March 17, 2025
- Country Western Live: March 21, 2025
- Halloween Karaoke: October 31, 2024
- New Year's Eve Party: December 31, 2024

## Development Notes
1. The system is designed to handle both hardcoded and Facebook events
2. Date sorting is consistent across the application
3. All dates are preserved as specified in the events.ts file
4. The system can handle future dates for upcoming events
5. Past events are automatically filtered and displayed in a separate section

## Future Considerations
1. Facebook API integration for real-time event data
2. Database storage for events
3. Admin interface for event management
4. Event categories and filtering
5. Recurring events support