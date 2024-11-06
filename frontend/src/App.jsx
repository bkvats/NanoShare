import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer copy";

export default function App() {
  return (
    <>
      <Header />
      <main className="mt-4 mx-auto w-3/4">
        <Home />
      </main>
      <Footer />
    </>
  )
}