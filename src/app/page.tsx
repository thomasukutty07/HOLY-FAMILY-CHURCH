'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/church-hero.jpg"
            alt="Holy Family Church"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Holy Family Church
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Join us in worship and community
            </p>
            <Link
              href="/about"
              className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mass Times */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Mass Times</h2>
              <ul className="space-y-2">
                <li>Sunday: 8:00 AM, 10:00 AM, 12:00 PM</li>
                <li>Saturday: 5:00 PM</li>
                <li>Weekdays: 8:00 AM</li>
              </ul>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <ul className="space-y-2">
                <li>Sunday Mass - Every Sunday</li>
                <li>Bible Study - Wednesdays 7:00 PM</li>
                <li>Youth Group - Fridays 6:00 PM</li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
              <ul className="space-y-2">
                <li>Volunteer Opportunities</li>
                <li>Ministry Programs</li>
                <li>Community Outreach</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 