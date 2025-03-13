// Script to use mock events for development
const path = require('path');
const fs = require('fs');

// Path to mock events
const mockEventsPath = path.resolve(process.cwd(), 'src/data/mock-events.json');

console.log('================================');
console.log('Using Mock Facebook Events Data');
console.log('================================');

try {
  // Read mock events
  const mockEventsData = fs.readFileSync(mockEventsPath, 'utf8');
  const mockEvents = JSON.parse(mockEventsData);
  
  console.log(`✅ Successfully loaded ${mockEvents.length} mock events!`);
  console.log('\nSample events:');
  
  // Display a preview of the mock events
  mockEvents.slice(0, 3).forEach((event, index) => {
    console.log(`\n[Event ${index + 1}] ${event.name || 'Unnamed Event'}`);
    if (event.start_time) console.log(`Date: ${new Date(event.start_time).toLocaleString()}`);
    if (event.description) console.log(`Description: ${event.description.substring(0, 70)}${event.description.length > 70 ? '...' : ''}`);
  });
  
  if (mockEvents.length > 3) {
    console.log(`\n... and ${mockEvents.length - 3} more events`);
  }
  
  console.log('\n✅ These mock events are ready to use in your app development.');
  console.log('To use them in your components/pages, import them like this:');
  console.log('\nimport mockEvents from \'../data/mock-events.json\';');
  
} catch (error) {
  console.error('❌ Error loading mock events:', error.message);
} 