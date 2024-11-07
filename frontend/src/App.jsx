import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main className="mt-4w-full">
        <Home />
      </main>
      <Footer />
    </>
  )
}