import { Bell, User } from 'lucide-react'

function Navbar({ userStats }) {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">DataWars</h1>
        <input
          type="text"
          placeholder="Search challenges, friends, or clans..."
          className="ml-8 px-4 py-2 bg-gray-800 rounded-lg w-96"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            2
          </span>
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full">
          <User className="w-full h-full p-1" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

