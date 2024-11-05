import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Header />
      <main className="mt-4 mx-auto w-3/4 border-2 border-red-700">
        <Home />
      </main>
    </>
  )
}