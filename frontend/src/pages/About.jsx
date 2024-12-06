import React from "react";
export default function About() {
    return (
        <section className="py-12 px-6 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Application</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Our peer-to-peer (P2P) file transfer application offers a seamless and secure way to
                    share files with others, bypassing traditional intermediaries. With our platform, you
                    can enjoy high-speed transfers, whether over the internet or locally via the same Wi-Fi
                    network. Designed for simplicity and efficiency, it's perfect for individuals and teams
                    alike.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Secure Transfers</h3>
                        <p className="text-gray-300">
                            Your data is transferred directly between devices, ensuring privacy and reducing
                            reliance on third-party servers.
                        </p>
                    </div>

                    <div className="rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">High-Speed Performance</h3>
                        <p className="text-gray-300">
                            Experience unparalleled file transfer speeds, optimized for both internet and local
                            Wi-Fi connections.
                        </p>
                    </div>

                    <div className="rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">User-Friendly Interface</h3>
                        <p className="text-gray-300">
                            Our intuitive design ensures that even non-technical users can share files effortlessly.
                        </p>
                    </div>

                    <div className="rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-3">Cross-Platform Support</h3>
                        <p className="text-gray-300">
                            Compatible with multiple devices and operating systems, our app adapts to your needs.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}