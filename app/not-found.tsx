import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#1a1f2e] to-[#0a0f1e] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 mb-4">
            404
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The page you&apos;re looking for seems to have vanished into the digital void. 
            Don&apos;t worry, even the best developers get lost sometimes! 🚀
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3">
            Did you know? 🤔
          </h3>
          <p className="text-gray-400 text-sm">
            The first 404 error was recorded in 1992 at CERN, where the web was born. 
            The room where the server was located was numbered 404, and when pages weren&apos;t found, 
            they&apos;d say &quot;Room 404: file not found&quot;!
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm mb-4">Or explore these sections:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#about"
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/#experience"
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Experience
            </Link>
            <Link
              href="/#skills"
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Skills
            </Link>
            <Link
              href="/#projects"
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Projects
            </Link>
            <Link
              href="/#contact"
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
