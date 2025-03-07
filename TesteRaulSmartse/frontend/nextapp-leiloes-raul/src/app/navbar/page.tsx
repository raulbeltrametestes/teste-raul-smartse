"use client"; 

import { useState, useEffect } from "react";
import './navbar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faMoon, faCloud, faAnchor } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("ocean");
  const [user, setUser] = useState<{ name: string; cpf: string } | null>(null);

  useEffect(() => {
    //pego o usuário salvo no localstorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    //pego o tema salvo local
    const savedTheme = localStorage.getItem("localTheme") || "ocean";
    setSelectedTheme(savedTheme);
    handleThemeChange(savedTheme);
  }, []);

  const themes: Record<string, Record<string, string>> = {
    sky: {
      '--cor1': '#f8f8f8',
      '--cor2': '#cccccc',
      '--cor3': '#848484',
      '--cor4': '#1a2a49',
      '--cor5': '#0c73c7',
      '--cor6': '#080808',
      '--cor7': '#6c757d',
      '--cor8': '#d3d3d3',
    },
    ocean: {
      '--cor1': '#e3e1e1',
      '--cor2': '#b2b2b2',
      '--cor3': '#a1a1a1',
      '--cor4': '#004792',
      '--cor5': '#1F305E',
      '--cor6': '#080808',
      '--cor7': '#6c757d',
      '--cor8': '#d3d3d3',
    },
    dark: {
      '--cor1': '#c2c0c0',
      '--cor2': '#8180a6',
      '--cor3': '#808080',
      '--cor4': '#012245',
      '--cor5': '#111b38',
      '--cor6': '#080808',
      '--cor7': '#6c757d',
      '--cor8': '#d3d3d3',
    }
  };

  const handleThemeChange = (theme: string | null) => {
    if (!theme) return;
    
    const selectedTheme = themes[theme];
  
    if (selectedTheme) {
      Object.entries(selectedTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }

    setSelectedTheme(theme);
    localStorage.setItem("localTheme", theme);
  };

  return (
    <nav className="text-white px-6 py-4 flex justify-between items-center shadow-md" style={{ backgroundColor: 'var(--cor5)' }}>
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => window.location.href = "/leiloes"}>
        Lances.com
      </h1>


      <div className="flex gap-4 items-center">
        <div>
          <button onClick={() => setThemeDropdownOpen(!themeDropdownOpen)} className="px-2 py-2 rounded-md hover:bg-blue-200 transition flex items-center" style={{backgroundColor:'var(--cor1)', color:'var(--cor5)'}}>
            <FontAwesomeIcon icon={faPalette} />
          </button>

          {themeDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-40  text-black shadow-lg rounded-md overflow-hidden" style={{backgroundColor:'var(--cor1)'}}>
              {["sky", "ocean", "dark"].map((theme) => (
                <li key={theme}>
                  <button
                    onClick={() => handleThemeChange(theme)}
                    className={`w-full px-4 py-2 hover:bg-gray-200 flex items-center ${selectedTheme === theme ? "font-bold" : ""}`}
                    style={{color:'var(--cor4)'}}
                  >
                    {theme === "ocean" && <FontAwesomeIcon icon={faAnchor} className="mr-4" />}
                    {theme === "dark" && <FontAwesomeIcon icon={faMoon} className="mr-5" />}
                    {theme === "sky" && <FontAwesomeIcon icon={faCloud} className="mr-4" />}
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <span className="block text-sm">{user ? user.name : "Usuário"}</span>
          <span className="block text-sm font-semibold">{user ? user.cpf : "cpf"}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
