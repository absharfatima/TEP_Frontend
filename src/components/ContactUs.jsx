import React, { useState } from "react";
import Navbar from './Navbar';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      const data = await response.json();
      alert(data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form');
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                We would love to hear from you! Feel free to get in touch with us
                for any inquiries, feedback, or just to say hello.
              </p>
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <i className="fas fa-phone text-white"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Phone</h4>
                  <p className="text-gray-700">+91-5614 5623 21</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <i className="fas fa-envelope text-white"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="text-gray-700">example@email.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 w-full py-2"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 w-full py-2"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your Message..."
                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 w-full py-2"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-600">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
