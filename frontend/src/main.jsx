import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import "./index.css";
import { Provider } from "react-redux";
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import FAQs from './pages/FAQs.jsx';
import Privacy from './pages/Privacy.jsx';
import Playground from './components/Playground.jsx';
import Send from './pages/Send.jsx';
import Receive from './pages/Receive.jsx';
import Test from "./components/Test.jsx";
import { store } from './store/store.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about' element={<About />} />
      <Route path='/privacy' element={<Privacy />} />
      <Route path='/faqs' element={<FAQs />} />
      <Route element={<Playground />} >
        <Route path='/send' element={<Send />} />
        <Route path='/receive' element={<Receive />} />
      </Route>
      <Route path='/test' element={<Test />} />
    </Route >
  )
)
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
