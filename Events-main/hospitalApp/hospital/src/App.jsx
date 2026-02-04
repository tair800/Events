import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Header,
  Footer,
  ScrollToTop,
  ProtectedRoute,
  EmployeeDetail,
  EventsDetail,
  BlogDetail
} from './components'
import {
  HomePage,
  AboutPage,
  EventsPage,
  GalleryPage,
  BlogPage,
  EmployeePage,
  ContactPage,
  Error404,
  UserLogin,
  UserRegister,
  AccountPage,
  AccountDetails,
  AccountEvents,
  AccountBenefits,
  Members
} from './pages'
import { TestPage } from './pages'
import Dashboard from './pages/admin/Dashboard'
import AdminHome from './pages/admin/AdminHome'
import AdminAbout from './pages/admin/AdminAbout'
import AdminContact from './pages/admin/AdminContact'
import AdminBlog from './pages/admin/AdminBlog'
import AdminEvents from './pages/admin/AdminEvents'
import AdminSponsors from './pages/admin/AdminSponsors'
import AdminGallery from './pages/admin/AdminGallery'
import AdminEmployee from './pages/admin/AdminEmployee'
import AdminRequests from './pages/admin/AdminRequests'
import AdminMail from './pages/admin/AdminMail'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import { LanguageProvider, UserAuthProvider } from './context'
import { API_CONFIG, STORAGE_KEYS } from './utils'

import './App.css'

const BlogAccessRoute = ({ children }) => {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN)
    if (!token) {
      setStatus('denied')
      return
    }

    try {
      const raw = localStorage.getItem('userProfileCache')
      const cached = raw ? JSON.parse(raw) : null
      if (cached?.isMember) {
        setStatus('allowed')
        return
      }
    } catch (error) {
      // ignore cache errors and refetch
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) {
          setStatus('denied')
          return
        }
        const profile = await response.json()
        localStorage.setItem('userProfileCache', JSON.stringify(profile))
        setStatus(profile?.isMember ? 'allowed' : 'denied')
      } catch (error) {
        setStatus('denied')
      }
    }

    fetchProfile()
  }, [])

  if (status === 'loading') {
    return null
  }

  return status === 'allowed' ? children : <Error404 />
}

function App() {

  return (
    <LanguageProvider>
      <UserAuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>

              <Route path="/" element={
                <>
                  <Header showTopImage={false} />
                  <HomePage />
                  <Footer />
                </>
              } />
              <Route path="/test" element={<TestPage />} />
              <Route path="/about" element={
                <>
                  <Header showTopImage={true} />
                  <AboutPage />
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header showTopImage={true} />
                  <ContactPage />
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header showTopImage={false} />
                  <UserLogin />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header showTopImage={false} />
                  <UserRegister />
                </>
              } />
              <Route path="/account" element={
                <>
                  <Header showTopImage={true} hidePageName={true} showAccountTabs={true} />
                  <AccountPage />
                </>
              } />
              <Route path="/account/details" element={
                <>
                  <Header showTopImage={true} hidePageName={true} showAccountTabs={true} />
                  <AccountDetails />
                </>
              } />
              <Route path="/account/events" element={
                <>
                  <Header showTopImage={true} hidePageName={true} showAccountTabs={true} />
                  <AccountEvents />
                </>
              } />
              <Route path="/account/benefits" element={
                <>
                  <Header showTopImage={true} hidePageName={true} showAccountTabs={true} />
                  <AccountBenefits />
                </>
              } />
              <Route path="/employee" element={
                <>
                  <Header showTopImage={true} />
                  <EmployeePage />
                  <Footer />
                </>
              } />
              <Route path="/employee/:id" element={
                <>
                  <Header showTopImage={false} hidePageName={true} />
                  <EmployeeDetail />
                  <Footer />
                </>
              } />
              <Route path="/events" element={
                <>
                  <Header showTopImage={true} />
                  <EventsPage />
                  <Footer />
                </>
              } />
              <Route path="/members" element={
                <>
                  <Header showTopImage={true} />
                  <Members />
                  <Footer />
                </>
              } />
              <Route path="/event/:id" element={
                <>
                  <Header showTopImage={true} />
                  <EventsDetail />
                  <Footer />
                </>
              } />
              <Route path="/gallery" element={
                <>
                  <Header showTopImage={true} />
                  <GalleryPage />
                  <Footer />
                </>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="sponsors" element={<AdminSponsors />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="employee" element={<AdminEmployee />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="mail" element={<AdminMail />} />
              </Route>
              <Route path="/blog" element={
                <BlogAccessRoute>
                  <>
                    <Header showTopImage={true} />
                    <BlogPage />
                    <Footer />
                  </>
                </BlogAccessRoute>
              } />
              <Route path="/blog/:id" element={
                <BlogAccessRoute>
                  <>
                    <Header showTopImage={true} />
                    <BlogDetail />
                    <Footer />
                  </>
                </BlogAccessRoute>
              } />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
        </Router>
      </UserAuthProvider>
    </LanguageProvider>
  )
}

export default App
