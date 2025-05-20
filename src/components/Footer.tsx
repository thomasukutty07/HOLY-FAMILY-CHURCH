'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">123 Church Street</p>
            <p className="mb-2">City, State 12345</p>
            <p className="mb-2">Phone: (555) 123-4567</p>
            <p>Email: info@holyfamilychurch.org</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-gray-300">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-gray-300">
                  Donate
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Mass Times</h3>
            <p className="mb-2">Sunday: 8:00 AM, 10:00 AM, 12:00 PM</p>
            <p className="mb-2">Saturday: 5:00 PM</p>
            <p>Weekdays: 8:00 AM</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Holy Family Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 