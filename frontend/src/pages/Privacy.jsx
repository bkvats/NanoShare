import React from "react";
export default function Privacy() {
    return (
        <section className="py-12 px-6 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">Privacy Policy</h2>
                <p className="text-gray-300 text-lg mb-8">
                    We prioritize your privacy by ensuring all file transfers are conducted directly between
                    devices. Our application is designed to minimize data collection and safeguard your
                    personal information at every step.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">End-to-End Encryption</h3>
                        <p className="text-gray-300">
                            All files are encrypted during transfer to protect your data from unauthorized access.
                        </p>
                    </div>

                    <div className="rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">No Data Retention</h3>
                        <p className="text-gray-300">
                            We do not store your files on any servers, ensuring complete control over your data.
                        </p>
                    </div>

                    <div className="rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Secure Connections</h3>
                        <p className="text-gray-300">
                            Our app utilizes industry-standard protocols to ensure secure and reliable connections.
                        </p>
                    </div>

                    <div className="rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Transparency</h3>
                        <p className="text-gray-300">
                            We are committed to being transparent about how your data is handled and protected.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}