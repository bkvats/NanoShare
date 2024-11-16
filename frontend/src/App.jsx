import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import Toast from "./components/Toast";
import Loader from "./components/Loader";
import SimpleProgressCard from "./components/SimpleProgressCard";
import SpeedGraph from "./components/GraphTest";

export default function App() {
  return (
    <>
      <Header />
      {/* <SimpleProgressCard /> */}
      {/* <SpeedGraph /> */}
      <main style={{minHeight: "calc(100vh - 11rem)", minWidth: "100%"}}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <Loader />
    </>
  )
}