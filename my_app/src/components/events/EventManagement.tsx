"use client";

import React, { useState, useEffect } from 'react';
import { getEvents, updateEvent, addEvent, deleteEvent } from '@/actions/event-actions';
import type { Event } from '@/types/events';
import { transformPrismaEvent } from '@/lib/utils/event-transform';
import { EventsCard } from './EventsCard';

// Function to extract Facebook event ID from URL
function extractFacebookEventId(url: string): string | null {
  const matches = url.match(/facebook\.com\/events\/(\d+)/);
  return matches ? matches[1] : null;
}

interface FacebookEventDetails {
  id: string;
  name: string;
  description?: string;
  cover?: {
    source: string;
  };
}

// Function to fetch Facebook event details
async function fetchFacebookEventDetails(eventId: string): Promise<FacebookEventDetails | null> {
  try {
    const response = await fetch(`/api/facebook-events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Facebook event:', error);
    return null;
  }
}

// Function to convert null to undefined for API compatibility
const nullToUndefined = <T extends Record<string, any>>(obj: T): T => {
  const result = { ...obj };
  Object.keys(result).forEach(key => {
    if (result[key] === null) {
      result[key] = undefined;
    }
  });
  return result;
};

interface FormData extends Omit<Event, 'isRecurring' | 'recurringPattern'> {
  isRecurring: boolean;
  recurringPattern: string;
}

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    description: '',
    date: new Date(),
    time: '',
    image: '',
    facebookEventUrl: null,
    isActive: true,
    isPublic: true,
    showPastDate: true,
    eventTagId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRecurring: false,
    recurringPattern: ''
  });

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
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Handle Facebook URL changes
    if (name === 'facebookEventUrl' && value) {
      const eventId = extractFacebookEventId(value);
      if (eventId) {
        const eventDetails = await fetchFacebookEventDetails(eventId);
        if (eventDetails?.cover?.source) {
          setFormData(prev => ({
            ...prev,
            image: eventDetails.cover.source,
            title: eventDetails.name || prev.title,
            description: eventDetails.description || prev.description
          }));
        }
      }
    }
  };

  // Validate image URL
  const isValidImageUrl = (url: string) => {
    if (!url) return true; // Allow empty URL
    // Updated pattern to handle URLs with query parameters after the extension
    const pattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)($|\?.*$)/i;
    return pattern.test(url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.description) {
      alert('Please fill out all required fields');
      return;
    }

    // Validate image URL if provided
    if (formData.image && !isValidImageUrl(formData.image)) {
      alert('Please provide a valid direct image URL (ending in .jpg, .png, etc.)');
      return;
    }

    try {
      if (editingEvent) {
        // Update existing event
        const result = await updateEvent(editingEvent.id, nullToUndefined(formData));
        if (!('success' in result) || !result.success) {
          throw new Error('Failed to update event');
        }
      } else {
        // Create new event
        const result = await addEvent(nullToUndefined(formData));
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

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      date: new Date(),
      time: '',
      image: '',
      facebookEventUrl: null,
      isActive: true,
      isPublic: true,
      showPastDate: true,
      eventTagId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRecurring: false,
      recurringPattern: ''
    });
    setEditingEvent(null);
  };

  // Handle editing an event
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      ...event,
      isRecurring: event.isRecurring ?? false,
      recurringPattern: event.recurringPattern ?? ''
    });
    setIsFormOpen(true);
  };

  // Handle deleting an event
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const result = await deleteEvent(id);
      if (!('success' in result) || !result.success) {
        throw new Error('Failed to delete event');
      }
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  // Handle toggling showPastDate
  const handleToggleShowPastDate = async (id: string, show: boolean) => {
    try {
      const result = await updateEvent(id, { showPastDate: show });
      if (!('success' in result) || !result.success) {
        throw new Error('Failed to update event');
      }
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update event');
    }
  };

  // Handle bulk toggle of showPastDate
  const handleBulkToggleShowPastDate = async (show: boolean) => {
    try {
      await Promise.all(
        events.map(event => updateEvent(event.id, { showPastDate: show }))
      );
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update events');
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Event Management</h1>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Event
          </button>
        </div>

        {/* Global Controls */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Global Settings</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBulkToggleShowPastDate(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Show All Past Event Dates
            </button>
            <button
              onClick={() => handleBulkToggleShowPastDate(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Hide All Past Event Dates
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Events Card View */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : (
          <EventsCard
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleShowPastDate={handleToggleShowPastDate}
          />
        )}

        {/* Event Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
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
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Time</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 7:00 PM"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Image URL
                    <span className="text-sm text-gray-500 ml-2">
                      (Must be a direct image URL ending in .jpg, .png, etc.)
                    </span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    placeholder="https://example.com/image.jpg"
                    pattern="https?:\/\/.*\.(jpg|jpeg|png|gif|webp)($|\?.*$)"
                  />
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p>To get a direct image URL:</p>
                    <ul className="list-disc pl-5">
                      <li>Right-click on the image you want to use</li>
                      <li>Select &quot;Copy Image Address&quot; (not &quot;Copy Link&quot;)</li>
                      <li>The URL should end with an image extension (.jpg, .png, etc.) - query parameters after the extension are allowed</li>
                      <li>For Facebook images: View the full-size image first, then copy the image address</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Facebook Event URL</label>
                  <input
                    type="url"
                    name="facebookEventUrl"
                    value={formData.facebookEventUrl ? formData.facebookEventUrl.toString() : ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    placeholder="https://facebook.com/events/..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Public</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="showPastDate"
                      checked={formData.showPastDate}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Show Past Date</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Recurring Event</span>
                  </label>
                </div>

                {formData.isRecurring && (
                  <div>
                    <label className="block text-gray-300 mb-2">Recurring Pattern</label>
                    <select
                      name="recurringPattern"
                      value={formData.recurringPattern}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    >
                      <option value="">Select a pattern</option>
                      <option value="WEEKLY_SUNDAY">Every Sunday</option>
                      <option value="WEEKLY_MONDAY">Every Monday</option>
                      <option value="WEEKLY_TUESDAY">Every Tuesday</option>
                      <option value="WEEKLY_WEDNESDAY">Every Wednesday</option>
                      <option value="WEEKLY_THURSDAY">Every Thursday</option>
                      <option value="WEEKLY_FRIDAY">Every Friday</option>
                      <option value="WEEKLY_SATURDAY">Every Saturday</option>
                      <option value="BIWEEKLY">Every Two Weeks</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      This event will appear in upcoming events based on the recurring pattern.
                      The original date will be used as the start date for the recurring pattern.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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