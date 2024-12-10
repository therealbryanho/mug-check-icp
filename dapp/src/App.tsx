import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Info from './pages/Info'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/info' element={<Info />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App