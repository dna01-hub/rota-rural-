"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        if (isAuthenticated && user) {
          if (user.role === "producer") {
            router.replace("/producer/home");
          } else if (user.role === "driver") {
            router.replace("/driver/home");
          } else {
            router.replace("/admin/dashboard");
          }
        } else {
          router.replace("/login");
        }
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Logo */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Truck className="w-10 h-10 text-primary" />
            </motion.div>

            <div className="text-center">
              <motion.h1
                className="text-3xl font-bold text-foreground tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Rota Rural
              </motion.h1>
              <motion.p
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Transporte rural seguro e confiavel
              </motion.p>
            </div>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="absolute bottom-20 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Route decoration */}
          <motion.div
            className="absolute bottom-8 flex items-center gap-1 text-muted-foreground/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <MapPin className="w-3 h-3" />
            <div className="w-16 h-px bg-muted-foreground/30" />
            <div className="w-2 h-2 rounded-full border border-muted-foreground/30" />
            <div className="w-16 h-px bg-muted-foreground/30" />
            <MapPin className="w-3 h-3" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
