import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          &larr; Back to home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-black">Terms of Service</h1>
          <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none text-black">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">1. Acceptance of Terms</h2>
            <p className="text-gray-900">
              By accessing or using the 152 Bar & Restaurant website ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">2. Description of Service</h2>
            <p className="text-gray-900">
              152 Bar & Restaurant provides a website that showcases our menu, events, and allows users to view information about our establishment. The Service may include features that integrate with third-party services such as Facebook.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">3. Use of the Service</h2>
            <p className="text-gray-900">You agree to use the Service only for purposes that are permitted by:</p>
            <ol className="list-decimal pl-6 mb-4 text-gray-900">
              <li>These Terms;</li>
              <li>Any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions.</li>
            </ol>
            <p className="text-gray-900">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-900">
              <li>Use the Service to transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable;</li>
              <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service;</li>
              <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service;</li>
              <li>Use any robot, spider, or other automated device to access the Service for any purpose without our express written permission.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">4. Intellectual Property</h2>
            <p className="text-gray-900">
              The Service and its original content, features, and functionality are and will remain the exclusive property of 152 Bar & Restaurant and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="text-gray-900">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of 152 Bar & Restaurant.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">5. User Content</h2>
            <p className="text-gray-900">
              Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. By providing such content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
            </p>
            <p className="text-gray-900">
              You agree that this license includes the right for us to make your content available to other users of the Service, who may also use your content subject to these Terms.
            </p>
            <p className="text-gray-900">
              You represent and warrant that you have the right to submit all content you submit through the Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">6. Third-Party Links and Services</h2>
            <p className="text-gray-900">
              Our Service may contain links to third-party websites or services that are not owned or controlled by 152 Bar & Restaurant.
            </p>
            <p className="text-gray-900">
              152 Bar & Restaurant has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that 152 Bar & Restaurant shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
            <p className="text-gray-900">
              We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">7. Facebook Integration</h2>
            <p className="text-gray-900">
              Our Service integrates with Facebook to display events and other content from our Facebook Page. By using these features, you agree to comply with Facebook's terms of service and policies in addition to our Terms.
            </p>
            <p className="text-gray-900">
              We are not responsible for the availability or accuracy of Facebook's services or content. Your use of Facebook features through our Service is at your own risk.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">8. Disclaimer of Warranties</h2>
            <p className="text-gray-900">
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            <p className="text-gray-900">
              152 Bar & Restaurant, its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">9. Limitation of Liability</h2>
            <p className="text-gray-900">
              In no event shall 152 Bar & Restaurant, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">10. Changes to Terms</h2>
            <p className="text-gray-900">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-900">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">11. Governing Law</h2>
            <p className="text-gray-900">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-900">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black">12. Contact Us</h2>
            <p className="text-gray-900">
              If you have any questions about these Terms, please contact us at:
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