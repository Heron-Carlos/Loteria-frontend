import { Link, useLocation } from 'react-router-dom';

export const Navigation = (): JSX.Element => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md mb-4">
      <div className="max-w-3xl mx-auto px-8 py-4 flex gap-4">
        <Link
          to="/mega"
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            location.pathname === '/mega'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mega
        </Link>
        <Link
          to="/quina"
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            location.pathname === '/quina'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Quina
        </Link>
      </div>
    </nav>
  );
};

