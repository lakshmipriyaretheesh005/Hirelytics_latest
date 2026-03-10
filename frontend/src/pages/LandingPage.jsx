import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, TrendingUp, Search, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const companies = [
    "Google", "Amazon", "Microsoft", "Meta", "Oracle", "IBM", "TCS", "Infosys", "Wipro", "Accenture", "Deloitte", "Goldman Sachs"
];

export default function LandingPage() {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            {/* Hero Section with Video/Image Background */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Placeholder for Video Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950 z-10" />
                    <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] z-5" />
                    {/* Note: In production, replace src with uploaded college background video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        src="https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-with-glass-walls-in-a-business-center-40348-large.mp4"
                    />
                </div>

                <div className="container relative z-20 px-4 md:px-6 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4 max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Award className="w-3.5 h-3.5" />
                            The Premium Placement Partner
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6">
                            Empowering MITS to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">Get Hired.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Experience the next generation of placement analytics, preparation, and management.
                            Built exclusively for MITSians to bridge the gap between education and career.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/register">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-10 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95">
                                Start My Journey <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white h-14 px-10 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                                Dashboard Access
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Floating animated elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-10 hidden lg:block"
                >
                    <div className="p-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-green-500 w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 font-medium">Placement Rate</p>
                            <p className="text-lg font-bold">98.4% YoY</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-40 left-10 hidden lg:block"
                >
                    <div className="p-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Briefcase className="text-blue-500 w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 font-medium">Avg. Package</p>
                            <p className="text-lg font-bold">₹12.5 LPA</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Scrolling Companies Section */}
            <section id="companies" className="py-20 border-y border-zinc-900 relative bg-zinc-950 overflow-hidden">
                <div className="container px-4 mx-auto mb-10 text-center">
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-4">Top Recruiters Visited</p>
                </div>

                <div className="flex gap-12 items-center animate-infinite-scroll whitespace-nowrap">
                    {[...companies, ...companies].map((company, i) => (
                        <div key={i} className="flex items-center gap-2 group cursor-default">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                                <span className="text-sm font-black text-zinc-400 group-hover:text-blue-400">{company[0]}</span>
                            </div>
                            <span className="text-2xl font-bold text-zinc-600 group-hover:text-zinc-300 transition-colors">{company}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 container px-4 mx-auto relative">
                <div className="max-w-3xl mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Everything you need to <br /><span className="text-blue-500">Conquer Your Career.</span></h2>
                    <p className="text-zinc-400 text-lg">Integrated tools and data-driven insights to help you prepare better and land faster.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Search className="w-6 h-6 text-blue-500" />}
                        title="Eligibility Checker"
                        description="Auto-check your eligibility for 37+ companies instantly based on your CGPA and branch."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                        title="Placement Predictor"
                        description="AI-driven probability score based on your mock tests, coding stats, and skill ratings."
                    />
                    <FeatureCard
                        icon={<Award className="w-6 h-6 text-amber-500" />}
                        title="Prep Hub"
                        description="Company-specific preparation resources, previous questions, and selection timelines."
                    />
                    <FeatureCard
                        icon={<Briefcase className="w-6 h-6 text-emerald-500" />}
                        title="Mock Test System"
                        description="Timed aptitude and coding tests designed by industry experts for top-tier companies."
                    />
                    <FeatureCard
                        icon={<CheckCircle2 className="w-6 h-6 text-red-500" />}
                        title="ATS Evaluator"
                        description="Upload your resume and get a real-time ATS score with improvement suggestions."
                    />
                    <FeatureCard
                        icon={<GraduationCap className="w-6 h-6 text-sky-500" />}
                        title="Alumni Network"
                        description="Connect with seniors who placed in your dream companies and get direct mentorship."
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-zinc-900/30 border-y border-zinc-900">
                <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-white mb-2">500+</p>
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Students Placed</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-blue-500 mb-2">37+</p>
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Companies</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-white mb-2">₹12L</p>
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Highest Package</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-indigo-500 mb-2">24/7</p>
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Support</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 container px-4 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white">Words from our <span className="text-blue-500">Achievers.</span></h2>
                    <p className="text-zinc-400 text-lg">Hear it from MITSians who paved their path to success through Hirelytics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard
                        quote="The company-specific resources were a game changer. I knew exactly what to expect in the Amazon interview."
                        author="Ananya Sharma"
                        role="SDE-1 at Amazon"
                    />
                    <TestimonialCard
                        quote="The mock tests are extremely accurate. The difficulty level matched the actual TCS Ninja/Digital tests perfectly."
                        author="Rahul Verma"
                        role="Digital Associate at TCS"
                    />
                    <TestimonialCard
                        quote="I used the ATS evaluator to refine my resume. Within weeks, I started getting shortlisted for dream roles."
                        author="Siddharth Jain"
                        role="Software Engineer at Microsoft"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-zinc-900 bg-zinc-950">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                    <GraduationCap className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tight text-white">Hirelytics</span>
                            </Link>
                            <p className="text-zinc-500 max-w-sm">
                                The most advanced placement management platform for Madhav Institute of Technology and Science students. Paving the way for the tech leaders of tomorrow.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-zinc-500 text-sm">
                                <li><a href="#features" className="hover:text-blue-500 transition-colors">Features</a></li>
                                <li><a href="#companies" className="hover:text-blue-500 transition-colors">Companies</a></li>
                                <li><a href="#testimonials" className="hover:text-blue-500 transition-colors">Testimonials</a></li>
                                <li><Link to="/login" className="hover:text-blue-500 transition-colors">Student Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Contact Us</h4>
                            <ul className="space-y-4 text-zinc-500 text-sm font-medium">
                                <li>placement@mits.ac.in</li>
                                <li>+91 751 2403 300</li>
                                <li>MITS Campus, Gwalior</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-600 text-sm font-medium">© 2026 Hirelytics. Made with ❤️ for MITS.</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">Privacy Policy</a>
                            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900 transition-all hover:-translate-y-1 group">
            <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-blue-500/30 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">{description}</p>
            </CardContent>
        </Card>
    );
}

function TestimonialCard({ quote, author, role }) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Award key={i} className="w-4 h-4 text-blue-500 fill-blue-500" />)}
                </div>
                <p className="text-zinc-300 italic font-medium leading-relaxed">"{quote}"</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {author[0]}
                </div>
                <div>
                    <p className="text-white font-bold text-sm">{author}</p>
                    <p className="text-zinc-500 text-xs font-semibold">{role}</p>
                </div>
            </div>
        </Card>
    );
}
