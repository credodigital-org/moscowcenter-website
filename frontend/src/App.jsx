import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar/AnnouncementBar";
import ContactStrip from "./components/ContactStrip/ContactStrip";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Treatments from "./pages/Treatments";
import Doctors from "./pages/Doctors";
import ContactUs from "./pages/ContactUs";
import AdminPage from "./pages/AdminPage";

import "./App.css";

import MouseMovement from "./components/MouseMovement";
import "./components/Transitions.css";
import TransitionObserver from "./components/TransitionObserver";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import HashScroll from "./components/HashScroll";
import Seo from "./components/Seo";
import { SiteTextProvider } from "./components/T";

/* The public website: navbar, page content and footer. */
function SiteLayout() {
  return (
    <>
      <MouseMovement />
      <TransitionObserver />
      <HashScroll />
      <Seo />
      <ScrollToTopButton />
      <WhatsAppButton />
      <Navbar />
      <AnnouncementBar />
      <ContactStrip />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteTextProvider>
      <Routes>
        {/* Content management — no website chrome */}
        <Route path="/admin/*" element={<AdminPage />} />

        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Service />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
      </Routes>
      </SiteTextProvider>
    </BrowserRouter>
  );
}

export default App;
