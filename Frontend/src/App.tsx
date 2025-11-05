import {Routes,Route} from 'react-router-dom'
import './App.css'
import ChatInterface from './component/ChatInterface'
import { useTheme } from './Context/useTheme'

function App() {
const {theme}=useTheme();
  return (
    <div className={`${theme === "dark" ? "bg-dark-theme" : "bg-light-theme"}`}>
    <Routes>
      <Route path="/" element={<ChatInterface/>}  />
    </Routes>
    </div>
  )
}

export default App
