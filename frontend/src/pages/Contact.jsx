import React from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/loaderSlice";
export default function Contact() {
    const dispatch = useDispatch();
    return (
        <section className="py-12 px-6 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">Contact Us</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Have feedback or questions? We’d love to hear from you. Get in touch using the form below,
                    and we’ll respond as soon as possible.
                </p>

                <form className="space-y-6 text-left">
                    <div>
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Your Email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            className="w-full p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Your Message"
                        ></textarea>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}