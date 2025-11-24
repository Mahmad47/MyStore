import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <section className="w-full bg-[#f7f7f7]">
      <nav className="mx-auto lg:container text-sm text-gray-500 px-[5%] py-14 ">
        <ol className="flex items-center space-x-2">
          {items?.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.link ? (
                <Link
                  to={item.link}
                  className="hover:text-gray-900 transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900">{item.label}</span>
              )}

              {index < items.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
};

export default Breadcrumb;
