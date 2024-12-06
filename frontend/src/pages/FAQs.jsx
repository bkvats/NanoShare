import React from "react";
export default function FAQs() {
    return (
        <section className="py-12 px-6 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Have questions? We’ve got answers. Below are some of the most common queries about our
                    P2P file transfer application.
                </p>

                <div className="space-y-6 text-left">
                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">How does the file transfer work?</h3>
                        <p className="text-gray-300">
                            Our application uses peer-to-peer (P2P) technology to transfer files directly between
                            devices, ensuring fast and secure file sharing without intermediaries.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Is my data secure?</h3>
                        <p className="text-gray-300">
                            Yes, all transfers are encrypted, and no data is stored on our servers, ensuring maximum
                            privacy and security.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Can I transfer files over local Wi-Fi?</h3>
                        <p className="text-gray-300">
                           Not yet, but we are working on this feature as well and will reach you soon with this one.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">What file types are supported?</h3>
                        <p className="text-gray-300">
                            You can transfer any file type, including documents, images, videos, and more, with no
                            restrictions on format or size.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}