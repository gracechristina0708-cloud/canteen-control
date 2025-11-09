import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import mecBitesLogo from "@/assets/mec-bites-logo.png";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-poppins"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/95 to-secondary/20 backdrop-blur-sm animate-gradient"></div>
      
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
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-60 rounded-full animate-pulse"></div>
            <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-primary via-white to-secondary p-2 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white p-6 flex items-center justify-center">
                <img 
                  src={mecBitesLogo} 
                  alt="MEC Bites Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Tagline */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Smart Food. Zero Queue.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 font-semibold">
            Madras Engineering College's Digital Canteen
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
