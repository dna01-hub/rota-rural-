"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export function LoadingScreen({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Truck className="w-10 h-10 text-primary" />
      </motion.div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
