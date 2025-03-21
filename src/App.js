import { BrowserRouter, Routes, Route} from "react-router-dom";
import WordOfTheDay from "./WordOfTheDay"
import FreePlay from "./FreePlay"
import Home from "./Home"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/word-of-the-day" element={<WordOfTheDay />} />
        <Route path="/free-play" element={<FreePlay />} />

      </Routes>
    </BrowserRouter>
  
    
  );
}

export default App;
