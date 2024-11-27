import Link from 'next/link'
import AuthButton from '@/components/AuthButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="container mx-auto">
          <div className="flex-1">
            <a className="text-2xl font-bold text-primary">SalesTrainer</a>
          </div>
          <div className="flex-none">
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Master the Art of Sales
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Enhance your sales skills with our comprehensive training platform.
            Learn from industry experts and track your progress.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/api/auth/login" className="btn btn-primary btn-lg">
              Get Started
            </a>
            <a href="#features" className="btn btn-ghost btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Interactive Learning</h2>
              <p>Engage with real-world scenarios and practical exercises</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Expert Guidance</h2>
              <p>Learn from experienced sales professionals and industry leaders</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Progress Tracking</h2>
              <p>Monitor your improvement with detailed analytics and feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">
            MyCompany <br/>
            Professional Sales Training Since 2024
          </p>
          <p>Copyright 2024 - All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}
