import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />
      <main className="mt-4w-full">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}