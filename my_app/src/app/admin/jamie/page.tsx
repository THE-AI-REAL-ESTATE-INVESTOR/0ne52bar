'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import { Components } from 'react-markdown';

// Define proper types for the components
type MermaidProps = {
  chart: string;
};

// Create a separate component for the Mom's Note
const MomNote = ({ 
  openRouterTotal, 
  hoursSpent, 
  hourlyRate, 
  markValue, 
  industryRate, 
  industryValue,
  showDetails,
  setShowDetails
}: { 
  openRouterTotal: number;
  hoursSpent: number;
  hourlyRate: number;
  markValue: number;
  industryRate: number;
  industryValue: number;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
      <div className="p-6 md:p-8 bg-blue-700 text-white">
        <h1 className="text-3xl font-bold mb-2">Hi Mom!</h1>
        <p className="text-xl">Here&apos;s what I&apos;ve built for 152 Bar & Restaurant</p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="mb-8 text-lg">
          <p className="mb-4">
            The work I&apos;ve done on this website more than pays for what I owe you 
            in OpenRouter costs of <strong>${openRouterTotal}</strong>. The other charges 
            in the report were mine.
          </p>
          
          <p className="mb-4">
            I believe I&apos;ve paid you back in full, and I love you and want you to have an 
            awesome site to grow the bar. This isn&apos;t just a website - it&apos;s a complete 
            digital platform that will help 152 Bar grow and reach new customers.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h2 className="text-xl font-bold mb-3 text-blue-800">What I Need Right Now:</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Hosting Costs:</strong> I need you to pay for hosting this on Vercel so I can monitor and maintain your site properly.</li>
              <li><strong>Fair Compensation:</strong> Instead of the $100/hour industry standard, I&apos;m only asking for $50/hour for the work and expertise I&apos;ve provided.</li>
            </ol>
          </div>
          
          <p className="mb-4">
            As I mentioned in the car, I want to be paid what I&apos;m worth, but I would rather get paid 
            a little bit for building it. That said, I think I&apos;ve way more than delivered on the $460 I owe you.
          </p>
          
          <p className="mb-6">
            I&apos;ve put in about {hoursSpent} hours so far, and you have a site that we can deploy and 
            start manually adding Facebook events and other things to the site, until the Facebook app 
            is approved. Then it will be automatically done for you.
          </p>
          
          <p className="text-lg font-semibold mb-8">
            I hope you don&apos;t just like it, but LOVE it! I hope I can become a client who you see as 
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
                  <td className="border p-3">Mark&apos;s hourly rate</td>
                  <td className="border p-3 text-right">${hourlyRate}/hour</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3">Value of work at Mark&apos;s rate</td>
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
                <li>TapPass loyalty program to increase customer retention</li>
                <li>Digital business card for easy sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client-only Mermaid component with fixed types
const ClientOnlyMermaid = dynamic(
  () => import('mermaid').then((mermaid) => {
    mermaid.default.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
    
    return function Mermaid({ chart }: MermaidProps) {
      const ref = useRef<HTMLDivElement>(null);
      
      useEffect(() => {
        if (ref.current) {
          ref.current.innerHTML = '';
          // @ts-ignore - The mermaid types don't match the callback signature
          mermaid.default.render(
            `mermaid-${Math.random().toString(36).substring(2, 12)}`,
            chart,
            (svg: string) => {
              if (ref.current) {
                ref.current.innerHTML = svg;
              }
            }
          );
        }
      }, [chart]);
      
      return <div ref={ref} />;
    };
  }),
  { ssr: false }
);

// Custom components for ReactMarkdown with proper types
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const content = String(children).replace(/\n$/, '');
    
    if (match && match[1] === 'mermaid') {
      return <ClientOnlyMermaid chart={content} />;
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
};

export default function JamiePage() {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showMomNote, setShowMomNote] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate project details
  const startDate = new Date('2025-03-11');
  const endDate = new Date('2025-03-14');
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysCompleted = Math.min(
    Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    totalDays
  );
  const percentComplete = Math.min(Math.round((daysCompleted / totalDays) * 100), 100);
  
  // Calculate code metrics
  const linesOfCode = 8450;
  const functionsCreated = 125;
  
  // OpenRouter costs data
  const openRouterTotal = 460; // The amount Mark owes
  const hoursSpent = 30; // Hours Mark has spent on the project
  const hourlyRate = 50; // Mark's proposed hourly rate
  const markValue = hoursSpent * hourlyRate; // Value of Mark's work at his rate
  
  // Industry standard calculations
  const industryRate = 100; // Low-end industry standard hourly rate
  const industryValue = hoursSpent * industryRate; // Value at industry rates
  
  const documentation = `
# ONE-52 BAR AND GRILL - Website Documentation

## Overview

The ONE-52 BAR AND GRILL website is a comprehensive digital platform designed to showcase the establishment's offerings, events, and customer loyalty program. Built with Next.js and React, the website provides a modern, responsive user experience with several key features including event management, a loyalty program (TapPass), and administrative capabilities.

## Visual Website Structure

Here's how the overall website is structured:

\`\`\`mermaid
flowchart TD
    A[Homepage] --> B[Events Page]
    A --> C[Menu Page]
    A --> D[About Page]
    A --> E[TapPass Page]
    B --> F[Individual Event Details]
    E --> G[Member Registration]
    E --> H[Member Card]
    I[Admin Dashboard] --> J[Event Management]
    I --> K[Menu Management]
    I --> L[TapPass Management]
\`\`\`

## How Data Flows in the System

This diagram shows how information moves through the website:

\`\`\`mermaid
flowchart LR
    A[Customer] -->|views| B[Website Frontend]
    B -->|requests data| C[Next.js Server]
    C -->|reads/writes| D[JSON Data Files]
    E[Admin] -->|manages content| F[Admin Dashboard]
    F -->|updates| D
    D -->|displays on| B
\`\`\`

## TapPass Member Journey

Here's what happens when someone uses the TapPass system:

\`\`\`mermaid
flowchart TD
    A[Customer Visits TapPass Page] -->|Enters Email| B{Account Exists?}
    B -->|Yes| C[Show Digital Card]
    B -->|No| D[Registration Form]
    D -->|Submits Info| E[Creates Account]
    E --> F[Generates Member ID]
    F --> C
    C -->|Downloads| G[Card on Phone]
    C -->|Emails| H[Card to Email]
\`\`\`

## Table of Contents

1. [Architecture](#architecture)
2. [Pages & Routes](#pages--routes)
3. [Features](#features)
   - [Events System](#events-system)
   - [TapPass Loyalty Program](#tappass-loyalty-program)
   - [Menu Display](#menu-display)
   - [Admin Dashboard](#admin-dashboard)
4. [Data Management](#data-management)
5. [UI/UX Design](#uiux-design)
6. [Future Enhancements](#future-enhancements)

## Architecture

The website is built using the following technologies:

- **Framework**: Next.js (App Router)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Data Storage**: JSON files (with potential for database integration)
- **Authentication**: NextAuth.js for admin access
- **Image Handling**: Next.js Image component for optimized image delivery

The application follows a modern architecture with server components for data fetching and client components for interactive elements. Server Actions are used for form submissions and data mutations.

## How a Website Works (For Non-Technical People)

\`\`\`mermaid
flowchart TD
    A[Customer's Device] -->|Types website address| B[Internet]
    B -->|Finds correct server| C[Website Server]
    C -->|Processes request| D[Builds webpage]
    D -->|Sends back| E[HTML, CSS, JavaScript]
    E -->|Displays in browser| F[Completed Webpage]
    G[Owner Updates Content] -->|New information| C
\`\`\`

## Pages & Routes

### Public Pages

- **Home** (/): Landing page featuring upcoming events and TapPass promotion
- **Events** (/events): Lists all upcoming and past events
- **Event Details** (/events/[id]): Detailed view of a specific event
- **Menu** (/menu): Displays food and drink offerings
- **About** (/about): Information about the establishment
- **TapPass** (/tappass): Loyalty program registration and management
- **Terms & Privacy** (/terms-of-service, /privacy-policy): Legal information

### Admin Pages

- **Admin Dashboard** (/admin): Overview of site management
- **Admin Events** (/admin/events): Event management interface
- **Admin Menu** (/admin/menu): Menu management
- **Admin TapPass** (/admin/tappass): Loyalty program management
- **Admin Settings** (/admin/settings): Site configuration
- **Admin Login** (/admin/login): Authentication page

## Features

### Events System

The events system is a core feature of the website, allowing the bar to promote upcoming events and showcase past events.

#### Key Components:

1. **Event Data Structure**:
   \`\`\`typescript
   interface Event {
     id: string;
     title: string;
     date: string;
     time: string;
     description: string;
     image: string;
     facebookEventUrl?: string;
   }
   \`\`\`

2. **Event Services**:
   - getAllEvents(): Retrieves and sorts upcoming events
   - getAllPastEvents(): Retrieves and sorts past events
   - getEvent(id): Retrieves a specific event by ID
   - addEvent(event): Adds a new event
   - updateEvent(id, eventData): Updates an existing event
   - deleteEvent(id): Removes an event
   - syncWithExternalSource(): Placeholder for Facebook integration

3. **Event Display**:
   - Events are displayed in a responsive grid layout
   - Upcoming events are shown with full color images
   - Past events are displayed with grayscale images that colorize on hover
   - Each event links to a detailed view

4. **Event Management**:
   - Admin interface for creating, editing, and deleting events
   - Support for uploading event images
   - Ability to link to Facebook event pages

### TapPass Loyalty Program

The TapPass system is a digital loyalty program that allows customers to register and receive benefits.

#### Key Components:

1. **Member Data Structure**:
   \`\`\`typescript
   interface TapPassMember {
     memberId: string;
     name: string;
     email: string;
     birthday: string;
     phoneNumber: string;
     agreeToTerms: boolean;
     memberSince: string;
     tier: string;
     points: number;
     visits: number;
     lastVisit?: string;
   }
   \`\`\`

2. **TapPass Features**:
   - Account lookup by email
   - New member registration
   - Digital membership card generation
   - Membership card download and email options
   - Member benefits display
   - Tiered membership levels (Bronze, Silver, Gold, Platinum)

3. **Server Actions**:
   - getMemberByEmail(email): Checks if a member exists
   - registerTapPassMember(formData): Registers a new member or updates existing
   - emailMembershipCard(formData): Sends membership card via email
   - getAllMembers(): Retrieves all members (admin only)
   - getMemberInfo(memberId): Gets detailed member information

4. **User Flow**:
   - Users can check if they already have an account
   - Existing members immediately see their membership card
   - New users complete a multi-step registration process
   - Members can download or email their membership card

### Menu Display

The menu section showcases the bar's food and drink offerings.

#### Key Components:

1. **Menu Categories**:
   - Food items
   - Drinks and cocktails
   - Daily specials
   - Happy hour offerings

2. **Menu Features**:
   - Responsive layout for all devices
   - High-quality food and drink images
   - Pricing information
   - Dietary information where applicable

### Admin Dashboard

The admin dashboard provides management capabilities for authorized staff.

#### Key Components:

1. **Authentication**:
   - Secure login for staff members
   - Role-based access control

2. **Management Interfaces**:
   - Event management
   - Menu updates
   - TapPass member management
   - Content editing

## Data Management

The application currently uses JSON files for data storage:

1. **Events Data**:
   - Upcoming events stored in /src/data/events.ts
   - Past events stored in /src/data/past-events.ts

2. **TapPass Data**:
   - Member information stored in /src/data/tap-pass-members.json

3. **Business Information**:
   - Core business details stored in /src/data/business.ts

The system is designed to be easily migrated to a database solution as needs grow.

## UI/UX Design

The website features a modern, responsive design with the following characteristics:

1. **Color Scheme**:
   - Primary: Dark theme with blue accents
   - Secondary: Yellow highlights for calls to action
   - Accent: Various colors for event categories

2. **Typography**:
   - Clean, readable fonts throughout
   - Larger, bold headings for section titles
   - Appropriate text sizing for all devices

3. **Responsive Design**:
   - Mobile-first approach
   - Adapts to all screen sizes
   - Touch-friendly interface elements

4. **Accessibility**:
   - Semantic HTML structure
   - Appropriate contrast ratios
   - Alt text for images
   - Keyboard navigation support

## Future Enhancements

Planned improvements for the website include:

1. **Integration with Facebook Events API**:
   - Automatic event synchronization
   - Social sharing capabilities

2. **Enhanced TapPass Features**:
   - QR code scanning at the venue
   - Point tracking and redemption
   - Special offers for members

3. **Online Ordering**:
   - Food and drink pre-ordering
   - Table reservations

4. **Content Management System**:
   - Improved admin interface
   - Rich text editing for content
   - Image management system

5. **Analytics Dashboard**:
   - Visitor tracking
   - Event popularity metrics
   - TapPass program effectiveness

---

This documentation provides a comprehensive overview of the ONE-52 BAR AND GRILL website, its features, and architecture. For technical details or specific implementation questions, please refer to the source code or contact the development team.
`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Project Status Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">ONE-52 Project Status</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Timeline Progress</h2>
            <div className="bg-blue-900 rounded-full h-4 mb-2">
              <div 
                className="bg-yellow-400 h-4 rounded-full" 
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{startDate.toLocaleDateString()}</span>
              <span>{percentComplete}% Complete</span>
              <span>{endDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-700 p-4 rounded-lg">
              <div className="text-3xl font-bold">{linesOfCode}</div>
              <div className="text-blue-200">Lines of Code</div>
            </div>
            <div className="bg-blue-700 p-4 rounded-lg">
              <div className="text-3xl font-bold">{functionsCreated}</div>
              <div className="text-blue-200">Functions Created</div>
            </div>
            <div className="bg-blue-700 p-4 rounded-lg">
              <div className="text-3xl font-bold">{hoursSpent}</div>
              <div className="text-blue-200">Development Hours</div>
            </div>
            <div className="bg-blue-700 p-4 rounded-lg">
              <div className="text-3xl font-bold">${industryValue}</div>
              <div className="text-blue-200">Industry Value</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Project Highlights</h2>
            <ul className="list-disc list-inside">
              <li>Implemented responsive design for all device sizes</li>
              <li>Created TapPass loyalty system with member features</li>
              <li>Developed past and upcoming events display and management</li>
              <li>Added account lookup to check existing membership</li>
              <li>Fixed multiple UI issues on all pages</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowDocumentation(!showDocumentation)}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded font-medium"
            >
              {showDocumentation ? "Hide Documentation" : "View Full Documentation"}
            </button>
            
            <button 
              onClick={() => setShowMomNote(!showMomNote)}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded font-medium"
            >
              {showMomNote ? "Hide Mom's Note" : "View Note to Mom"}
            </button>
            
            <Link 
              href="/admin/help"
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium"
            >
              View Help Page
            </Link>
          </div>
          
          <div className="mt-6 text-sm bg-blue-900 p-4 rounded">
            <p className="italic">
              Note: This project dashboard is for Jamie and the project team only. Progress metrics are updated weekly.
              The complete documentation below details all features and components of the ONE-52 BAR AND GRILL website.
            </p>
          </div>
        </div>
        
        {/* Mom's Note Section - Conditionally Displayed using separate component */}
        {showMomNote && (
          <MomNote 
            openRouterTotal={openRouterTotal}
            hoursSpent={hoursSpent}
            hourlyRate={hourlyRate}
            markValue={markValue}
            industryRate={industryRate}
            industryValue={industryValue}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        )}
        
        {/* Documentation Section - Conditionally Displayed */}
        {showDocumentation && (
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {documentation}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 