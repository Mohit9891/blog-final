import React, { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashBoard'

const Admin = () => {
  const [user, setUser] = useState(null)

  if (!user) return <AdminLogin onLogin={setUser} />
  return <AdminDashboard user={user} onLogout={() => setUser(null)} />
}

export default Admin
