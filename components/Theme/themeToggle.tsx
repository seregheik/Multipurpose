import { useTheme } from "@/Context/themeProvider";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center space-x-3">
        <FiSun className={`w-5 h-5 transition-colors ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`} 
          title="Toggle theme"
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
        <FiMoon className={`w-5 h-5 transition-colors ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
    </div>
  );
};

export default ThemeToggle