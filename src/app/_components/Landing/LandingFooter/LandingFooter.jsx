import { Mail, Instagram, Twitter, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="sp container box-border mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand / Contact Info */}
        <div className="space-y-3 md:col-span-1 lg:col-span-1">
          <h2 className="h3 mb-3 text-white">MyShop</h2>
          <p className="text !text-gray-300">Call Us Free</p>
          <h3 className="h5 text-white">1800 68 68</h3>
          <div className="space-y-1 text">
            <p className="!text-gray-300">Address: 1234 Heaven Stress, USA.</p>
            <p className="!text-gray-300">Email: info@example.com</p>
            <p className="!text-gray-300">Fax: (+100) 123 456 7890</p>
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="h5 mb-3 text-white">Info</h3>
          <ul className="space-y-2 text !text-gray-300">
            <li>Custom Service</li>
            <li>F.A.Q.’s</li>
            <li>Ordering Tracking</li>
            <li>Contact Us</li>
            <li>Events</li>
            <li>Popular</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="h5 mb-3 text-white">Services</h3>
          <ul className="space-y-2 text !text-gray-300">
            <li>Sitemap</li>
            <li>Privacy Policy</li>
            <li>Your Account</li>
            <li>Advanced Search</li>
            <li>Term & Condition</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Account / Newsletter */}
        <div>
          <h3 className="h5 mb-3 text-white">Newsletter</h3>
          <p className="p mb-4 text-gray-300">
            Share contact information, store details, and brand content with your customers.
          </p>
          <form className="flex mb-5 text">
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 border !border-[#ffffff5e] bg-transparent text-white placeholder-gray-400 px-3 py-2 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[var(--color-accent)] text-white px-4 rounded-r-md"
            >
              <Mail size={18} />
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-3">
            <a
              href="#"
              className="p-2 border !border-[#ffffff5e] rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              className="p-2 border !border-[#ffffff5e] rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-colors"
            >
              <Globe size={16} />
            </a>
            <a
              href="#"
              className="p-2 border !border-[#ffffff5e] rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t !border-[#ffffff5e]  text-center py-4 text !text-gray-400">
        © Copyright 2025 | <span className="text-white font-medium">MyShop</span>. Powered by Me.
      </div>
    </footer>
  );
}
