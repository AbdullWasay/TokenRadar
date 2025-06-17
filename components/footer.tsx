import Link from "next/link"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Rader</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time token tracking and analytics for crypto traders and investors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Data Processing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Rader. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
