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
  image?: string;
  featured: boolean;
}

export default function EventsManagement() {
  const { status } = useSession();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    time: '',
    image: '',
    featured: false
  });

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };


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
      image: '',
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
      image: event.image || '',
      featured: event.featured
    });
    setIsFormOpen(true);
  };

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      if (editingEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to update event');
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Failed to create event');
      }
      
      // Refresh events list
      await fetchEvents();
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      // Refresh events list
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
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
                {event.image && (
                  <div className="h-48 relative">
                    <Image 
                      src={event.image || '/placeholder-event.jpg'} 
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
                  <label htmlFor="image" className="block text-gray-300 mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
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