"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl?: string;
  featured: boolean;
}

export default function EventsManagement() {
  const { status } = useSession();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New/Edit event form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    time: '',
    imageUrl: '',
    featured: false
  });
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Load events data
  useEffect(() => {
    if (status === 'authenticated') {
      // This is a placeholder - in a real implementation, you would fetch from your API
      const demoEvents: Event[] = [
        {
          id: 'event-1',
          title: 'Live Music - Classic Rock',
          description: 'Join us for a night of classic rock hits performed by local favorites The Rockers!',
          date: '2023-12-15',
          time: '20:00',
          imageUrl: '/assets/food/tacos.jpg', // Placeholder image
          featured: true
        },
        {
          id: 'event-2',
          title: 'Happy Hour Special',
          description: 'Half-price drinks and appetizers from 4-6pm every Friday!',
          date: '2023-12-08',
          time: '16:00',
          featured: false
        },
        {
          id: 'event-3',
          title: 'Sunday Football Special',
          description: 'Watch the game with us! Drink specials and free wings during NFL games.',
          date: '2023-12-10',
          time: '13:00',
          imageUrl: '/assets/food/tacos.jpg', // Placeholder image
          featured: true
        }
      ];
      
      setEvents(demoEvents);
      setLoading(false);
    }
  }, [status]);
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      imageUrl: '',
      featured: false
    });
    setEditingEvent(null);
  };
  
  // Open form for new event
  const handleAddNewEvent = () => {
    resetForm();
    setIsFormOpen(true);
  };
  
  // Open form for editing
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      imageUrl: event.imageUrl || '',
      featured: event.featured
    });
    setIsFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create or update the event
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              title: formData.title || '',
              description: formData.description || '',
              date: formData.date || '',
              time: formData.time || '',
              imageUrl: formData.imageUrl,
              featured: formData.featured || false
            } 
          : event
      );
      setEvents(updatedEvents);
    } else {
      // Create new event with a unique ID
      const newId = `event-${Date.now()}`;
      const newEvent: Event = {
        id: newId,
        title: formData.title || '',
        description: formData.description || '',
        date: formData.date || '',
        time: formData.time || '',
        imageUrl: formData.imageUrl,
        featured: formData.featured || false
      };
      setEvents([...events, newEvent]);
    }
    
    // Close form and reset
    setIsFormOpen(false);
    resetForm();
  };
  
  // Handle event deletion
  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-lg text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-lg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-amber-500">Events Management</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Control bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-lg text-gray-300">Manage your upcoming events and promotions</p>
          </div>
          
          <button
            onClick={handleAddNewEvent}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Add New Event
          </button>
        </div>
        
        {/* Events list */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {event.imageUrl && (
                  <div className="h-48 relative">
                    <Image 
                      src={event.imageUrl || '/placeholder-event.jpg'} 
                      alt={event.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-sm font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <h2 className="text-2xl font-semibold text-white mb-2">{event.title}</h2>
                  <p className="text-lg text-gray-300 mb-3">{formatDate(event.date)} at {event.time}</p>
                  <p className="text-lg text-gray-400 mb-4">{event.description}</p>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black rounded-md text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-lg text-gray-400">No events found. Create your first event!</p>
          </div>
        )}
        
        {/* Add/Edit form modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-amber-500">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-gray-300 mb-2">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-gray-300 mb-2">Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-300 mb-2">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 h-24 text-lg"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="imageUrl" className="block text-gray-300 mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    placeholder="/assets/event-image.jpg"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-500 border-gray-600 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-gray-300">Feature this event</label>
                  </div>
                  <p className="text-base text-gray-400 mt-1">Featured events will be highlighted on the events page.</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md text-lg"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-base text-gray-400">
          <p>* In this demo, changes are not persisted to a database. Refreshing the page will reset all changes.</p>
        </div>
      </div>
    </div>
  );
} 