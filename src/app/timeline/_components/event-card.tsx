"use client"

import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, number } from "framer-motion";
import Link from "next/link";
import LumaEmbed from "@/components/landing/lumaEmbed";
import { createPortal } from "react-dom";
import { useState } from "react";

interface EventCardProps {
  status?: "upcoming" | "past" | "Open";
  title: string;
  description: string,
  sessionnum?:string,
  date: string;
  index: number;
  totalEvents: number;
  link?: string;
  buttonText?: string;
}

export const EventCard = ({
  status,
  title,
  date,
  index,
  description,
  sessionnum,
  link,
  buttonText,
}: EventCardProps) => {
  const isActive = status === "Open";
  const [open, setOpen] = useState(false);

  const modal = open && true
    ? createPortal(
      <div className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur bg-black/50">
        <div className="relative w-full max-w-4xl rounded-2xl bg-black p-4 flex items-center justify-center pt-24">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-8 top-6 text-white cursor-pointer z-10"
          >
            <X />
          </button>
          <LumaEmbed />
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative flex gap-4 md:gap-8 group"
      >
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: isActive ? 1.3 : 1 }}
            className={`
            relative w-4 h-4 rounded-full z-20 flex items-center justify-center
            ${isActive
                ? "bg-[#11D493] shadow-lg shadow-[#11D493]/50"
                : "bg-[#11D493]/30 shadow-[#11D493]/20"
              }
          `}
          >
            <div className={`
            absolute inset-0 rounded-full animate-pulse
            ${isActive ? "bg-[#11D493] shadow-inner" : "bg-[#11D493]/20"}
          `} />

            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-[#11D493]"
              />
            )}
          </motion.div>

          <div className="relative flex-1 w-0.5 mt-2">
            <div className={`
            absolute inset-0 rounded-full
            ${isActive ? "bg-[#11D493]/30" : "bg-[#11D493]/10"}
          `} />

            {isActive && (
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.3 }}
                className="absolute inset-0 rounded-full bg-linear-to-b from-[#11D493] to-[#11D493]/70 origin-top"
                style={{
                  boxShadow: "0 0 10px #11D493, 0 0 20px #11D493"
                }}
              />
            )}

            {isActive && (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  className="absolute top-2 left-1/2 w-1 h-1 bg-[#11D493] rounded-full -translate-x-1/2"
                />
                <motion.div
                  animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-6 left-1/2 w-1 h-1 bg-[#11D493] rounded-full -translate-x-1/2"
                />
                <motion.div
                  animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="absolute top-12 left-1/2 w-1 h-1 bg-[#11D493] rounded-full -translate-x-1/2"
                />
              </>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: isActive ? 1.02 : 1 }}
          className={`
          flex-1 bg-[#181D28] rounded-xl border border-gray-800 p-6 transition-all duration-300
          ${isActive
              ? "hover:border-[#11D493]/30 hover:shadow-2xl hover:shadow-[#11D493]/10"
              : ""
            }
        `}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            {status === "Open" && isActive && (
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-black bg-[#11D493] uppercase tracking-wide w-fit"
              >
                Ongoing
              </motion.span>
            )}
            {status === "past" && (
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white/70 bg-gray-700 uppercase tracking-wide w-fit"
              >
                Completed
              </motion.span>
            )}
            <motion.div
              initial={{ x: 20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className={`flex items-center gap-2 text-sm ${isActive ? "text-white" : "text-white/40"
                }`}
            >
              <Calendar className={`
              w-4 h-4 ${isActive ? "text-[#11D493]" : "text-[#11D493]/40"}
            `} />
              <span>{date}</span>
            </motion.div>
          </div>

          <motion.h3
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 ${isActive || status === "past" ? "text-white" : "text-white/40"
              }`}
          >
            {title}
          </motion.h3>

          {sessionnum !== undefined && sessionnum!=="" && (
  <motion.p
    initial={{ y: 20 }}
    whileInView={{ y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 }}
    className={`text-sm sm:text-base leading-relaxed mb-6 ${
      isActive ? "text-gray-400" : "text-gray-400/60"
    }`}
  >
    Speaker Session {sessionnum}
  </motion.p>
)}

 {sessionnum !== undefined && sessionnum==="" && (
  <motion.p
    initial={{ y: 20 }}
    whileInView={{ y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 }}
    className={`text-sm sm:text-base leading-relaxed mb-6 ${
      isActive ? "text-gray-400" : "text-gray-400/60"
    }`}
  >
    Orientation Session
  </motion.p>
)}




          {/* <motion.div 
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6"
        >
          <div className={`flex items-center gap-2 text-sm ${
            isActive ? "text-white" : "text-white/40"
          }`}>
            <MapPin className={`
              w-4 h-4 ${isActive ? "text-[#11D493]" : "text-[#11D493]/40"}
            `} />
            <span>{location}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${
            isActive ? "text-white" : "text-white/40"
          }`}>
            <Users className={`
              w-4 h-4 ${isActive ? "text-[#11D493]" : "text-[#11D493]/40"}
            `} />
            <span>{attendees}</span>
          </div>
        </motion.div> */}

      <motion.p
    initial={{ y: 20 }}
    whileInView={{ y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 }}
    className={`text-sm sm:text-base leading-relaxed mb-6 ${
      isActive ? "text-gray-400" : "text-gray-400/60"
    }`}
  >
    {description}
  </motion.p>

 {(
  (status === "past" && sessionnum !== undefined) ||
  status === "Open" ||
  status === "upcoming"
) && (
  <motion.div
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.3 }}
    whileTap={{ scale: 0.95 }}
  >
    {link ? (
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <Button className="font-semibold text-black bg-[#11D493] hover:bg-[#0fb883] rounded-lg px-6 py-2 transition-all duration-300 cursor-pointer">
          {sessionnum !== undefined
            ? buttonText
            : buttonText || "Register Now"}
        </Button>
      </Link>
    ) : (
      <Button
        className="font-semibold text-black bg-[#11D493] hover:bg-[#0fb883] rounded-lg px-6 py-2 transition-all duration-300 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {sessionnum !== undefined
          ? `Session ${sessionnum}`
          : buttonText || "Register Now"}
      </Button>
    )}
  </motion.div>
)}
        </motion.div>
      </motion.div >
      {modal}
    </>
  );
};