
import UserTable from './components/users/UserTable'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import UserEdit from './components/users/UserEdit'
import { ThemeProvider } from './providers/ThemeContext'
function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<UserTable />} />
        <Route path="/users/:id" element={<UserEdit />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
