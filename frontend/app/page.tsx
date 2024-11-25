import Link from 'next/link'

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
            <Link href="/auth/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              Master the Art of Sales
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your sales team with our interactive training platform. 
              Learn from expert-curated content, practice with AI-powered scenarios, 
              and track progress in real-time.
            </p>
            <div className="space-x-4">
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link href="/about" className="btn btn-ghost btn-lg">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Replace with your actual image */}
            <div className="aspect-video bg-gray-100 rounded-lg shadow-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SalesTrainer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive Learning",
                description: "Engage with real-world scenarios and AI-powered role-play exercises."
              },
              {
                title: "Expert-Led Content",
                description: "Learn from industry professionals with proven track records."
              },
              {
                title: "Progress Tracking",
                description: "Monitor your team's development with detailed analytics and insights."
              }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Sales Team?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have already elevated their sales game.
          </p>
          <Link href="/auth/register" className="btn btn-secondary btn-lg">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">
            SalesTrainer © {new Date().getFullYear()} - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
