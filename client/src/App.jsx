import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import ArticleDetail from './pages/ArticleDetail.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ArticleForm from './pages/ArticleForm.jsx'
import { Login, Register } from './pages/Auth.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/articles/new" element={<ArticleForm />} />
          <Route path="/admin/articles/:id" element={<ArticleForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
