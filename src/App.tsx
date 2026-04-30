import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <div>HOME OK</div>;
}

function Admin() {
  return <div>ADMIN PANEL OK</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
