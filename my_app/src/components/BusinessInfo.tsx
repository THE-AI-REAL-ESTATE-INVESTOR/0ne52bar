import React from 'react';
import { getBusinessInfo } from '@/data/business';

export default function BusinessInfo() {
  const business = getBusinessInfo();

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">About {business.name}</h2>
        <p className="text-gray-300 leading-relaxed">
          {business.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3 border-b border-blue-500 pb-1">Hours</h3>
          <ul className="space-y-1 text-gray-300">
            {business.hours.map((hour, index) => (
              <li key={index} className="flex justify-between">
                <span>{hour.day}:</span> <span>{hour.hours}</span>
              </li>
            ))}
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3 border-b border-blue-500 pb-1">Meals Served</h3>
          <ul className="space-y-1 text-gray-300">
            <li>Dinner</li>
            <li>Lunch</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3 border-b border-blue-500 pb-1">Entertainment</h3>
          <ul className="space-y-1 text-gray-300">
            <li>Live Entertainment</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-3 border-b border-blue-500 pb-1">Facility Amenities</h3>
          <ul className="space-y-1 text-gray-300">
            {business.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3 border-b border-blue-500 pb-1">Highway Corridors (within 5 mi.)</h3>
          <ul className="space-y-1 text-gray-300">
            <li>I-40</li>
            <li>Hw 4 going to Tuttle, Blanchard, Norman</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3 border-b border-blue-500 pb-1">Contact Information</h3>
          <address className="not-italic text-gray-300">
            <p className="font-bold">{business.name}</p>
            <p>{business.address.street}</p>
            <p>{business.address.city}, {business.address.state} {business.address.zip}</p>
            <p className="mt-2">Phone: <a href={`tel:${business.phone.replace(/-/g, '')}`} className="text-blue-300 hover:underline">{business.phone}</a></p>
          </address>
        </div>
      </div>
    </div>
  );
} 