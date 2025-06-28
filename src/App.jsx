import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">MindMate</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <button className="cta-button">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Personal AI Assistant
            </h1>
            <p className="hero-subtitle">
              Transform your productivity with intelligent task management, 
              smart reminders, and personalized insights powered by AI.
            </p>
            <div className="hero-buttons">
              <button className="primary-button">Start Free Trial</button>
              <button className="secondary-button">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <div className="image-content">
                <div className="floating-card card-1">
                  <span>📝</span>
                  <p>Smart Notes</p>
                </div>
                <div className="floating-card card-2">
                  <span>🎯</span>
                  <p>Task Manager</p>
                </div>
                <div className="floating-card card-3">
                  <span>📊</span>
                  <p>Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose MindMate?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>Advanced artificial intelligence that learns your patterns and adapts to your workflow.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized performance ensures your tasks are managed efficiently without delays.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and protected with enterprise-grade security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Cross-Platform</h3>
              <p>Access your tasks and insights from any device, anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Productivity?</h2>
          <p>Join thousands of users who have already improved their workflow with MindMate.</p>
          <button className="primary-button large">Get Started Today</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>MindMate</h4>
              <p>Your intelligent productivity companion.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#integrations">Integrations</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#community">Community</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MindMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
