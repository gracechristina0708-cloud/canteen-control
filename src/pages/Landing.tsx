import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import mecBitesLogo from "@/assets/mec-bites-logo.png";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      {/* Floating food icons animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -50 
            }}
            animate={{ 
              y: window.innerHeight + 50,
              x: Math.random() * window.innerWidth,
              rotate: 360
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              delay: i * 2
            }}
          >
            {['🍔', '🍕', '☕', '🥗', '🍱', '🧃'][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-4">
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse"></div>
            <img 
              src={mecBitesLogo} 
              alt="MEC Bites Logo" 
              className="relative w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>
        
        {/* Tagline */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Smart Food. Zero Queue.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Madras Engineering College's Digital Canteen System
          </p>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            size="lg" 
            className="text-lg px-12 py-7 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
            onClick={() => navigate("/select-role")}
          >
            Get Started →
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-card/90 backdrop-blur-md p-6 rounded-2xl border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="font-bold text-lg mb-2 text-primary">For Customers</h3>
            <p className="text-sm text-muted-foreground">Browse menu, order food, and track your orders in real-time</p>
          </div>
          <div className="bg-card/90 backdrop-blur-md p-6 rounded-2xl border-2 border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-3">👨‍🍳</div>
            <h3 className="font-bold text-lg mb-2 text-secondary">For Employees</h3>
            <p className="text-sm text-muted-foreground">Manage incoming orders and update preparation status</p>
          </div>
          <div className="bg-card/90 backdrop-blur-md p-6 rounded-2xl border-2 border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2 text-accent">For Admins</h3>
            <p className="text-sm text-muted-foreground">Monitor all transactions and analyze order history</p>
          </div>
        </motion.div>

        {/* Footer tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-muted-foreground pt-8"
        >
          Reducing crowding, managing orders online. Welcome to the future of campus dining! 🎓
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
