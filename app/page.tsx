"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  Bot,
  ChevronRight,
  Star,
  Globe,
  Menu,
  X,
  Brain,
  Clock,
  Lock,
  BarChart,
} from "lucide-react";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "Advanced AI Models",
      description:
        "Powered by state-of-the-art language models that understand context, emotion, and intent.",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Real-Time Responses",
      description:
        "Get instant replies with our optimized infrastructure - no more waiting for answers.",
    },
    {
      icon: <Lock className="w-6 h-6 text-green-500" />,
      title: "Privacy First",
      description:
        "Your conversations are encrypted end-to-end. We never store or share your data.",
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: "Multi-Language Support",
      description:
        "Communicate in over 50 languages. Break down language barriers effortlessly.",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "24/7 Availability",
      description:
        "Your AI assistant is always ready to help, anytime, anywhere in the world.",
    },
    {
      icon: <BarChart className="w-6 h-6 text-red-500" />,
      title: "Analytics Dashboard",
      description:
        "Track conversations, user engagement, and insights with detailed analytics.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "5M+", label: "Messages Sent" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "This AI chatbot has revolutionized our customer support. Response times dropped by 70% and satisfaction scores are at an all-time high.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "Integration was seamless. We had our AI assistant up and running in under 30 minutes. The API is clean and well-documented.",
      avatar: "MC",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Startup Founder",
      content:
        "Incredible value for the price. It's like having a team of assistants available 24/7. Our team productivity has doubled.",
      avatar: "ER",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Chat<span className="text-purple-600">AI</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="group relative px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="#features"
                className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
          

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
              Chat Smarter,
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Work Faster
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-8">
              Experience the future of communication with our AI-powered chatbot.
              Get instant, intelligent responses that understand you perfectly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="group relative w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Everything You Need for
              <span className="text-purple-600"> Intelligent Conversations</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
              Powerful features designed to make your communication effortless and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
              Join thousands of satisfied users who have transformed their communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-purple-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Conversations?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of users who are already experiencing the future of AI-powered communication.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-purple-600 bg-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-purple-200 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  Chat<span className="text-purple-600">AI</span>
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
                The intelligent chatbot platform that transforms how you communicate.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="#features" className="hover:text-purple-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-purple-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2024 ChatAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
             
            
             <Link
  href="#"
  className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600 transition-colors"
>
 <FaGithub className="w-5 h-5" />

</Link>

<Link
  href="#"
  className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600 transition-colors"
>
<FaTwitter className="w-5 h-5" />
</Link>

<Link
  href="#"
  className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600 transition-colors"
>
<FaLinkedin className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}