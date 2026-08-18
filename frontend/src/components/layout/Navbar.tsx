import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import UserMenu from './UserMenu';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <Logo size={36} />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Backlog</h1>
      </div>
      <UserMenu />
    </nav>
  );
}
