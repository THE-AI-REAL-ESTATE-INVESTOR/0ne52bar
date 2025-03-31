-- Rename the relations in the Event table
ALTER TABLE "Event" RENAME COLUMN "EventTag" TO "eventTag";
ALTER TABLE "Event" RENAME COLUMN "EventAttendee" TO "attendees";

-- Rename the relations in the EventTag table
ALTER TABLE "EventTag" RENAME COLUMN "Event" TO "events"; 