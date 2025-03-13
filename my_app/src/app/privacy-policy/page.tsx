import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          &larr; Back to home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-black">Privacy Policy</h1>
          <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none text-black">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">1. Introduction</h2>
            <p className="text-gray-900">
              Welcome to 152 Bar & Restaurant ("we," "our," or "us"). We respect your privacy and are committed to
              protecting it through our compliance with this policy.
            </p>
            <p className="text-gray-900">
              This policy describes the types of information we may collect from you or that you may provide when
              you visit our website and use our services, and our practices for collecting, using, maintaining,
              protecting, and disclosing that information.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">2. Information We Collect</h2>
            <p className="text-gray-900">We may collect several types of information from and about users of our website, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-900">
              <li>Personal information such as name and email address when you sign up for our newsletter or make a reservation</li>
              <li>Information about your internet connection, the equipment you use to access our website, and usage details</li>
              <li>Non-personal information such as browser type, language preference, referring site, and the date and time of each visitor request</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">3. How We Use Your Information</h2>
            <p className="text-gray-900">We use information that we collect about you or that you provide to us, including any personal information:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-900">
              <li>To present our website and its contents to you</li>
              <li>To provide you with information, products, or services that you request from us</li>
              <li>To notify you about changes to our website or any products or services we offer</li>
              <li>To improve our website and customer service</li>
              <li>To allow you to participate in interactive features on our website</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">4. Facebook Integration</h2>
            <p className="text-gray-900">
              Our website integrates with Facebook to display events from our Facebook Page. When you use features that connect with Facebook (such as our events page or admin dashboard), please note:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-900">
              <li>We only access public information from our Facebook Page or information you explicitly grant us permission to access</li>
              <li>If you log in with Facebook, we may collect your name, email, and profile picture as shared by Facebook</li>
              <li>We use this information only to personalize your experience and to fetch relevant data from Facebook</li>
              <li>We do not share your personal information with third parties without your consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-900">
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information.
              Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <p className="text-gray-900">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">6. Data Security</h2>
            <p className="text-gray-900">
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers.
            </p>
            <p className="text-gray-900">
              Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">7. Your Rights</h2>
            <p className="text-gray-900">Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-900">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to withdraw consent at any time, where we rely on consent to process your information</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">8. Changes to Our Privacy Policy</h2>
            <p className="text-gray-900">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-900">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">9. Contact Us</h2>
            <p className="text-gray-900">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded my-4 text-black">
              <p>One-52 Bar & Grill</p>
              <p>Address: 211 Trade Center Terrace, Mustang, OK 73064</p>
              <p>Phone: 405-256-5005</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 