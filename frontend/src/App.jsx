import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />
      <main style={{minHeight: "calc(100vh - 11rem)", minWidth: "100%"}}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}