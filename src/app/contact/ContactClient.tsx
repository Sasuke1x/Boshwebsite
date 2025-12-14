"use client";

import { useState } from 'react';
import { Mail, Instagram, Youtube } from 'lucide-react';

interface ContactData {
  title: string;
  introText: string;
  email: string;
  phone?: string;
  responseTime?: string;
}

interface SiteSettings {
  email?: string;
  phone?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

interface ContactClientProps {
  contactData: ContactData;
  siteSettings?: SiteSettings;
}

export default function ContactClient({ contactData, siteSettings }: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', project: '', message: '' });
      } else {
        setSubmitMessage(`Error sending message: ${data.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div>
            <h1 className="text-2xl font-light text-gray-800 mb-8">{contactData.title}</h1>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                {contactData.introText}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-600" />
                  <a 
                    href={`mailto:${contactData.email}`}
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    {contactData.email}
                  </a>
                </div>

                {contactData.phone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">📞</span>
                    <span className="text-gray-700">{contactData.phone}</span>
                  </div>
                )}
              </div>

              {(siteSettings?.instagramUrl || siteSettings?.youtubeUrl) && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-4">Follow</h3>
                  <div className="flex space-x-4">
                    {siteSettings?.instagramUrl && (
                      <a
                        href={siteSettings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {siteSettings?.youtubeUrl && (
                      <a
                        href={siteSettings.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        <Youtube size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {contactData.responseTime && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Response Time</h3>
                  <p className="text-sm text-gray-600">
                    {contactData.responseTime}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border-0 border-b-2 border-gray-200 focus:outline-none focus:border-black transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border-0 border-b-2 border-gray-200 focus:outline-none focus:border-black transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="project" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Project Type
                </label>
                <div className="relative">
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-10 bg-white border-0 border-b-2 border-gray-200 focus:outline-none focus:border-black transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Select a project type</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="event">Event Photography</option>
                    <option value="commercial">Commercial Work</option>
                    <option value="video">Video Production</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border-0 border-b-2 border-gray-200 focus:outline-none focus:border-black transition-all duration-200 resize-none"
                  placeholder="Tell me about your project, timeline, and vision..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 px-6 font-medium tracking-wide uppercase text-sm hover:bg-gray-900 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:translate-y-[-2px] active:translate-y-0 shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>

              {submitMessage && (
                <div className={`p-4 text-sm font-medium ${
                  submitMessage.includes('Thank you') 
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

