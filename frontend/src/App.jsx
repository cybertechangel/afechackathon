import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './vues/home'
import Login from './vues/login'
import Register from './vues/register'
import Ideas from './vues/ideas'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/ideas' element={<Ideas/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
