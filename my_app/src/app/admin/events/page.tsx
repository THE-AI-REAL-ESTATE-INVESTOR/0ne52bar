"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getEvents, updateEvent, addEvent, deleteEvent } from '@/actions/event-actions';
import type { Event } from '@/types/events';
import { transformPrismaEvent } from '@/lib/utils/event-transform';

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
    date: new Date(),
    time: '',
    image: '',
    isActive: true,
    isPublic: true,
    showPastDate: true
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
      const result = await getEvents();
      if ('success' in result && result.success && result.data) {
        setEvents(result.data.map(transformPrismaEvent));
      } else {
        throw new Error('Failed to fetch events');
      }
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
    } else if (type === 'datetime-local') {
      const dateValue = new Date(value);
      const timeString = dateValue.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      setFormData({ 
        ...formData, 
        date: dateValue,
        time: timeString
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date(),
      time: '',
      image: '',
      isActive: true,
      isPublic: true,
      showPastDate: true
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
    const dateObj = new Date(event.date);
    
    setFormData({
      title: event.title,
      description: event.description,
      date: dateObj,
      time: event.time,
      image: event.image || '',
      isActive: event.isActive,
      isPublic: event.isPublic,
      showPastDate: event.showPastDate
    });
    setIsFormOpen(true);
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.description) {
      alert('Please fill out all required fields');
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      image: formData.image || '',
      isActive: formData.isActive ?? true,
      isPublic: formData.isPublic ?? true,
      showPastDate: formData.showPastDate ?? true,
      facebookEventUrl: undefined,
      eventTagId: undefined
    };

    try {
      if (editingEvent) {
        // Update existing event
        const result = await updateEvent(editingEvent.id, eventData);
        if (!('success' in result) || !result.success) {
          throw new Error('Failed to update event');
        }
      } else {
        // Create new event
        const result = await addEvent(eventData);
        if (!('success' in result) || !result.success) {
          throw new Error('Failed to create event');
        }
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
      const result = await deleteEvent(id);
      if (!('success' in result) || !result.success) {
        throw new Error('Failed to delete event');
      }
      
      // Refresh events list
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Event Management</h1>
          <button
            onClick={handleAddNewEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Event
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Events List */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {event.image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <Image
                              src={event.image}
                              alt={event.title || ''}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {event.title}
                          </div>
                          {event.description && (
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.date ? formatDate(event.date) : 'No date set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.time || 'No time set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date ? formData.date.toISOString().slice(0, 16) : ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Display Time</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 8:00 PM"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                      id="isActive"
                    />
                    <label htmlFor="isActive" className="text-gray-300">Active</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="mr-2"
                      id="isPublic"
                    />
                    <label htmlFor="isPublic" className="text-gray-300">Public</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showPastDate"
                      checked={formData.showPastDate}
                      onChange={handleInputChange}
                      className="mr-2"
                      id="showPastDate"
                    />
                    <label htmlFor="showPastDate" className="text-gray-300">Show Past Date</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 