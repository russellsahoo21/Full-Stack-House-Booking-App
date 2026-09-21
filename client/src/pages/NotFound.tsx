import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { LogoMark } from '@/components/common/Logo';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <LogoMark size={72} />
        <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-sunset-coral text-white shadow-md">
          <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
        Lost your way?
      </h1>
      <p className="text-lg text-ink-500 dark:text-warm-300 max-w-md mb-8">
        We couldn't find the stay or page you were wandering towards.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-sunset-gradient text-white font-semibold text-sm shadow-md hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Go home
      </Link>
    </div>
  );
};
export default NotFound;
