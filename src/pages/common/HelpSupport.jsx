import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Book,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search
} from 'lucide-react';

const faqs = [
  {
    question: 'How do I submit a new complaint?',
    answer: 'Navigate to the "New Complaint" section from the sidebar, fill in the required details including the category, description, and any supporting attachments, then click Submit.',
  },
  {
    question: 'How can I track the status of my complaint?',
    answer: 'Go to "My Complaints" from the sidebar. You will see a list of all your submitted complaints along with their current status (Pending, In Progress, Resolved, or Closed).',
  },
  {
    question: 'What do the different complaint statuses mean?',
    answer: 'Pending: Your complaint has been received but not yet assigned. In Progress: A staff member is working on it. Resolved: The issue has been addressed. Closed: The complaint has been finalized. Escalated: The complaint has been elevated to higher priority.',
  },
  {
    question: 'How long does it take to resolve a complaint?',
    answer: 'Resolution time depends on the nature and priority of the complaint. Urgent complaints are addressed within 24 hours, while standard complaints typically take 2-5 business days.',
  },
  {
    question: 'Can I edit or delete a complaint after submitting?',
    answer: 'You can add additional information to a complaint while it is still in "Pending" status. However, once a complaint is assigned or in progress, modifications are limited to adding comments.',
  },
  {
    question: 'Who can see my complaint?',
    answer: 'Your complaint is visible to you, the assigned staff member handling it, and system administrators. Other students cannot see your complaints.',
  },
  {
    question: 'How do I change my password?',
    answer: 'Go to your Profile page from the top-right menu, then click on "Change Password". Enter your current password and your new password to update it.',
  },
  {
    question: 'What should I do if my complaint is not resolved on time?',
    answer: 'If your complaint has not been addressed within the expected timeframe, it will be automatically escalated. You can also contact the administration directly using the contact information below.',
  },
];

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            {filteredFaqs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No results found for "{searchTerm}"
              </p>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      {openFaq === index ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Quick Start Guide
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Log in to your account', desc: 'Use your ASTU credentials to access the system.' },
                { step: '2', title: 'Navigate your dashboard', desc: 'View your overview, statistics, and recent activity.' },
                { step: '3', title: 'Submit a complaint', desc: 'Click "New Complaint" and fill in the details about your issue.' },
                { step: '4', title: 'Track progress', desc: 'Monitor your complaint status in "My Complaints" section.' },
                { step: '5', title: 'Provide feedback', desc: 'Rate the resolution once your complaint is resolved.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Contact Support
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Email</p>
                  <a href="mailto:support@astu.edu.et" className="text-sm text-blue-600 hover:underline">
                    support@astu.edu.et
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Phone</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+251-22-111-0000</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Mon-Fri, 8AM - 5PM EAT</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Live Chat</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the chatbot icon at the bottom-right corner for instant help.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow p-6 text-white">
            <h3 className="font-semibold mb-2">Need more help?</h3>
            <p className="text-sm text-blue-100 mb-4">
              Visit the ASTU IT Help Desk at the Admin Building, Room 102, during working hours.
            </p>
            <div className="text-xs text-blue-200">
              <p>Adama Science and Technology University</p>
              <p>P.O. Box 1888, Adama, Ethiopia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
