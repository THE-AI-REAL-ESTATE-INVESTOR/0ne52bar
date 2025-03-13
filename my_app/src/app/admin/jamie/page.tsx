'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function JamiePage() {
  const [showDetails, setShowDetails] = useState(false);
  
  // OpenRouter costs data
  const openRouterTotal = 460; // The amount Mark owes
  const hoursSpent = 30; // Hours Mark has spent on the project
  const hourlyRate = 50; // Mark's proposed hourly rate
  const markValue = hoursSpent * hourlyRate; // Value of Mark's work at his rate
  
  // Industry standard calculations
  const industryRate = 100; // Low-end industry standard hourly rate
  const industryValue = hoursSpent * industryRate; // Value at industry rates
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 bg-blue-700 text-white">
            <h1 className="text-3xl font-bold mb-2">Hi Mom!</h1>
            <p className="text-xl">Here's what I've built for 152 Bar & Restaurant</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="mb-8 text-lg">
              <p className="mb-4">
                The work I've done on this website more than pays for what I owe you 
                in OpenRouter costs of <strong>${openRouterTotal}</strong>. The other charges 
                in the report were mine.
              </p>
              
              <p className="mb-4">
                I believe I've paid you back in full, and I love you and want you to have an 
                awesome site to grow the bar. This isn't just a website - it's a complete 
                digital platform that will help 152 Bar grow and reach new customers.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-800">What I Need Right Now:</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Hosting Costs:</strong> I need you to pay for hosting this on Vercel so I can monitor and maintain your site properly.</li>
                  <li><strong>Fair Compensation:</strong> Instead of the $100/hour industry standard, I'm only asking for $50/hour for the work and expertise I've provided.</li>
                </ol>
              </div>
              
              <p className="mb-4">
                As I mentioned in the car, I want to be paid what I'm worth, but I would rather get paid 
                a little bit for building it. That said, I think I've way more than delivered on the $460 I owe you.
              </p>
              
              <p className="mb-6">
                I've put in about {hoursSpent} hours so far, and you have a site that we can deploy and 
                start manually adding Facebook events and other things to the site, until the Facebook app 
                is approved. Then it will be automatically done for you.
              </p>
              
              <p className="text-lg font-semibold mb-8">
                I hope you don't just like it, but LOVE it! I hope I can become a client who you see as 
                an asset to grow your bar and your business on some type of monthly retainer.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Value Comparison</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Item</th>
                      <th className="border p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">OpenRouter costs owed</td>
                      <td className="border p-3 text-right text-red-600 font-semibold">${openRouterTotal}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3">Hours worked on website</td>
                      <td className="border p-3 text-right">{hoursSpent} hours</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Mark's hourly rate</td>
                      <td className="border p-3 text-right">${hourlyRate}/hour</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3">Value of work at Mark's rate</td>
                      <td className="border p-3 text-right text-green-600 font-semibold">${markValue}</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Industry standard rate</td>
                      <td className="border p-3 text-right">${industryRate}/hour</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3">Value of work at industry rates</td>
                      <td className="border p-3 text-right text-green-600 font-semibold">${industryValue}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border p-3 font-bold">Difference (Value provided minus debt)</td>
                      <td className="border p-3 text-right font-bold text-green-600">${markValue - openRouterTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">OpenRouter Costs Breakdown</h2>
              <button 
                onClick={() => setShowDetails(!showDetails)} 
                className="mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {showDetails ? 'Hide Details' : 'Show Detailed Costs'}
              </button>
              
              {showDetails && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Date</th>
                        <th className="border p-2 text-right">Credits</th>
                        <th className="border p-2 text-right">Running Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* First 20 entries of OpenRouter credits */}
                      <tr><td className="border p-2">March 8, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">4</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">March 8, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">8</td></tr>
                      <tr><td className="border p-2">March 6, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">12</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">March 6, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">16</td></tr>
                      <tr><td className="border p-2">March 4, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">20</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">March 3, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">24</td></tr>
                      <tr><td className="border p-2">March 2, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">28</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">March 2, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">32</td></tr>
                      <tr><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">36</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">40</td></tr>
                      <tr><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">44</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">48</td></tr>
                      <tr><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">52</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">56</td></tr>
                      <tr><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">60</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 28, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">64</td></tr>
                      <tr><td className="border p-2">February 27, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">68</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 27, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">72</td></tr>
                      <tr><td className="border p-2">February 27, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">76</td></tr>
                      <tr className="bg-gray-50"><td className="border p-2">February 27, 2025</td><td className="border p-2 text-right">4</td><td className="border p-2 text-right">80</td></tr>
                      <tr className="text-center"><td colSpan={3} className="border p-2 text-gray-500">And more entries up to total of $460...</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">What The Website Delivers</h2>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-lg">1. Social Media Management & Integration</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Instagram account recovery and restructuring</li>
                    <li>Facebook Business integration with automated event posting</li>
                    <li>TikTok business account setup</li>
                    <li>Cross-platform connections to centralize marketing</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-lg">2. Modern Web Application</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Professional-looking website with responsive design</li>
                    <li>Built on Next.js 15 - the same technology used by Facebook and Netflix</li>
                    <li>Fast loading times and excellent user experience</li>
                    <li>Mobile-friendly design for customers on the go</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-lg">3. Marketing & Customer Engagement</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Search Engine Optimization to help new customers find you</li>
                    <li>Automated event marketing from Facebook to website</li>
                    <li>One52 Stories blog platform for customer engagement</li>
                    <li>Foundation for the TapPass loyalty program</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-lg">4. Business Operations Improvements</h3>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Digital menu system for easy updates</li>
                    <li>Potential for online food ordering (with Shift4 integration)</li>
                    <li>Admin dashboard for easy content management</li>
                    <li>Future analytics capabilities to track customer behavior</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View the Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 