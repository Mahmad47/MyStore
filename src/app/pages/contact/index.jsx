import React, { useState } from 'react';
import Breadcrumb from '@app/_components/Landing/Breadcrumb/Breadcrumb';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can replace the above console.log with your API call to send the data
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
    <Breadcrumb
                items={[
                    { label: "Home", link: "/" },
                    { label: "Contact" },
                ]}
            />
    
    <section className="w-[100vw] flex justify-center py-12">
      <div className="w-full max-w-5xl px-4 flex flex-col lg:flex-row gap-10">
        {/* Left side - contact info */}
        <div className="lg:w-1/2 flex flex-col justify-start gap-5">
          <span className="sub-title text-[var(--color-primary)]">Contact Us</span>
          <h2 className="text-3xl font-bold">We’d Love to Hear From You</h2>
          <p className="text-gray-600">
            Have a question, feedback, or just want to say hi? Fill out the form, and our team will get back to you as soon as possible.
          </p>

          <div className="mt-6 space-y-3">
            <p><strong>Email:</strong> chohanahamd79@gmail.com</p>
            <p><strong>Phone:</strong> +92 3207677319</p>
            <p><strong>Address:</strong> 123 Main Street, City, Country</p>
          </div>
        </div>

        {/* Right side - contact form */}
        <div className="lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              required
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            ></textarea>

            <button
              type="submit"
              className="button bg-[var(--color-primary)] text-white py-3 px-6 rounded hover:bg-opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  </>
  );
}
;

export default ContactPage;
