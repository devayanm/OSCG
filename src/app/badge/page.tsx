"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, incrementBadgeCount } from "@/lib/supabase/database";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Camera,
  Download,
  Upload,
  User as UserIcon,
  Shield,
  Sparkles,
  Check,
  Move,
  Undo2,
  Redo2,
  Search,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageAdjustment {
  scale: number;
  rotation: number;
}

export default function BadgePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<ImageAdjustment[]>([
    { scale: 1, rotation: 0 },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adjustmentsDone, setAdjustmentsDone] = useState<boolean>(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [badgeCount, setBadgeCount] = useState<number | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<string>("contributor");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCount = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await getProfile(currentUser.id);
        if (profile) {
          setBadgeCount(profile.badges_created || 0);
          setRole(profile.role || "contributor");
        }
      }
      setIsLoading(false);
    };
    fetchUserAndCount();
  }, []);

  const handleDownload = useCallback(async () => {
    if (badgeRef.current === null) return;

    if (user && badgeCount !== null && badgeCount >= 3) {
      toast.error("You have reached the limit of 3 badges per account.");
      return;
    }

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(badgeRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          borderRadius: "0",
        },
      });

      // Increment count in database
      if (user) {
        const { error } = await incrementBadgeCount(user.id);
        if (error) {
          console.error("Error incrementing badge count:", error);
        } else {
          setBadgeCount(prev => (prev !== null ? prev + 1 : 1));
        }
      }

      const link = document.createElement("a");
      const fileName = `oscg-${role}-${name.toLowerCase().replace(/\s+/g, "-") || "user"}.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      toast.success("Badge downloaded successfully!");
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      toast.error("Failed to generate badge. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [badgeRef, name, user, badgeCount, role]);

  const saveToHistory = (newScale: number, newRotation: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ scale: newScale, rotation: newRotation });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setScale(history[newIndex].scale);
      setRotation(history[newIndex].rotation);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setScale(history[newIndex].scale);
      setRotation(history[newIndex].rotation);
    }
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  const handleScaleCommit = (newScale: number) => {
    saveToHistory(newScale, rotation);
  };

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
  };

  const handleRotationCommit = (newRotation: number) => {
    saveToHistory(scale, newRotation);
  };

  const resetScale = () => {
    setScale(1);
    saveToHistory(1, rotation);
  };

  const resetRotation = () => {
    setRotation(0);
    saveToHistory(scale, 0);
  };

  const resetAll = () => {
    setScale(1);
    setRotation(0);
    saveToHistory(1, 0);
  };

  const setQuickRotation = (deg: number) => {
    setRotation(deg);
    saveToHistory(scale, deg);
  };

  const processFile = async (file: File) => {
    try {
      let fileToProcess = file;

      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        toast.info("Converting HEIC image...", { duration: 2000 });
        try {
          const heic2any = (await import("heic2any")).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
          const normalizeBlob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;
          fileToProcess = new File(
            [normalizeBlob],
            file.name.replace(/\.(heic|heif)$/i, ".jpg"),
            { type: "image/jpeg" }
          );
        } catch (err) {
          console.error("HEIC conversion failed:", err);
          toast.error("Could not convert HEIC image. Please try a JPG/PNG.");
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(fileToProcess);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process image.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isMentor = role === "mentor";

  const pageAccent = "#00D6B2";
  const pageAccentLight = "#4FD1D0";

  const config = {
    accent: pageAccent,
    accentLight: pageAccentLight,
    roleLabel: isMentor ? "MENTOR" : "CONTRIBUTOR",
    tagBg: isMentor ? "bg-[#1a1033]/50" : "bg-[#00D6B2]/10",
    tagText: isMentor ? "text-transparent bg-clip-text bg-gradient-to-r from-[#E9D5FF] to-[#F59E0B]" : "text-[#00D6B2]",
    ringGradient: isMentor
      ? "linear-gradient(to top right, #F59E0B, #EC4899, #F59E0B)"
      : `linear-gradient(to top right, ${pageAccent}, ${pageAccentLight}, ${pageAccent})`,
    glowColor: isMentor ? "rgba(168, 85, 247, 0.4)" : "rgba(0, 214, 178, 0.4)",
    cardBg: isMentor
      ? "bg-linear-to-br from-[#1e1040] via-[#120a2e] to-[#0a0514]"
      : "bg-linear-to-b from-[#0d1f23] via-[#091619] to-[#081416]",
    bannerAccent: isMentor ? "text-[#F59E0B]" : "text-[#00D6B2]",
    primaryGradient: isMentor
      ? "from-[#F59E0B] to-[#EC4899]"
      : "from-[#00D6B2] to-[#4FD1D0]",
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00D6B2]/30 border-t-[#00D6B2] rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white selection:bg-[#00D6B2]/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full opacity-50 bg-[#00D6B2]/5"
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full opacity-50 bg-[#4FD1D0]/5"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24 max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-8 backdrop-blur-sm"
            style={{
              backgroundColor: `${config.accent}05`,
              borderColor: `${config.accent}15`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: config.accent,
                boxShadow: `0 0 10px ${config.accent}`,
              }}
            />
            <span
              className="text-[11px] font-bold tracking-widest uppercase"
              style={{ color: config.accent }}
            >
              Open Source Recognition
            </span>
          </motion.div>

          {user && badgeCount !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex flex-col items-center gap-2">
                <div
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl border backdrop-blur-md"
                  style={{
                    backgroundColor: `${config.accent}05`,
                    borderColor: `${config.accent}15`,
                    boxShadow: `0 0 20px ${config.accent}10`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px]",
                        badgeCount >= 3 ? "bg-red-500 shadow-red-500" : ""
                      )}
                      style={
                        badgeCount < 3
                          ? {
                            backgroundColor: config.accent,
                            boxShadow: `0 0 8px ${config.accent}`,
                          }
                          : {}
                      }
                    />
                    <span className="text-[13px] font-bold tracking-wide text-[#94A3B8]">
                      Account Limit:{" "}
                      <span
                        className={badgeCount >= 3 ? "text-red-400" : "text-white"}
                      >
                        {badgeCount}
                      </span>{" "}
                      / <span className="text-white">3</span>
                    </span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <span
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: config.accent }}
                  >
                    {3 - badgeCount > 0
                      ? `${3 - badgeCount} Left`
                      : "Limit Reached"}
                  </span>
                </div>
                {badgeCount >= 3 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest"
                  >
                    Maximum badge creations reached for this account
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="origin text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-white">Open Source </span>
            <br className="md:hidden" />
            <span
              className="bg-clip-text text-transparent bg-linear-to-r from-[#00D6B2] to-[#4FD1D0]"
            >
              Recognition
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-[#94A3B8] text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium"
          >
            Create your personalized OSCG badge to celebrate your contribution
            to open source.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <div className="flex flex-col items-center order-2 lg:order-1">
            <div className="w-full max-w-[260px] min-[400px]:max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-105">
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#0C4C4B] to-transparent" />
                <span className="text-[11px] sm:text-[13px] md:text-[15px] font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-[#92A4B9] uppercase whitespace-nowrap">
                  Live Preview
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#0C4C4B] to-transparent" />
              </div>

              <motion.div
                ref={badgeRef}
                whileHover={{
                  boxShadow: `0 0 70px ${config.glowColor.replace(
                    "0.4",
                    "0.25"
                  )}, 0 35px 80px rgba(0,0,0,0.7)`,
                  y: -0.5,
                }}
                layoutId="badge-card"
                className={cn(
                  "relative aspect-[3/4.2] overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-xl border",
                  isMentor
                    ? "bg-[#0f081d] border-[#A855F7]/20"
                    : "bg-[#081517] border-[#00D6B2]/20"
                )}
                style={{
                  boxShadow: `0 0 40px ${config.glowColor.replace(
                    "0.4",
                    "0.15"
                  )}, 0 25px 60px rgba(0,0,0,0.6)`,
                }}
              >
                <div
                  className="pointer-events-none absolute -inset-3 rounded-2xl blur-3xl opacity-70"
                  style={{ backgroundColor: `${isMentor ? "#A855F7" : pageAccent}15` }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute top-[10%] left-[10%] w-[80%] h-[30%] blur-[60px] rounded-full opacity-30"
                    style={{ backgroundColor: isMentor ? "#A855F7" : pageAccent }}
                  />
                  <div
                    className="absolute bottom-[10%] right-[10%] w-[80%] h-[30%] blur-[60px] rounded-full opacity-10"
                    style={{ backgroundColor: isMentor ? "#EC4899" : pageAccentLight }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isMentor
                        ? "linear-gradient(to bottom right, #1e1040, #120a2e, #0a0514)"
                        : "linear-gradient(to bottom, #0d1f23, #091619, #081416)"
                    }}
                  />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center lg:p-5">
                  <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 mt-4">
                    <img
                      src="/logo1.png"
                      alt="OSCG Globe"
                      className="w-9 min-[400px]:w-11 sm:w-14 h-auto"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold text-sm min-[400px]:text-md sm:text-xl leading-tight">
                        Open Source
                      </span>
                      <span className="text-white font-bold text-sm min-[400px]:text-md sm:text-xl leading-tight">
                        Connect <span style={{ color: pageAccent }}>Global</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-1 sm:mb-4">
                    <div
                      className="absolute inset-[-12%] rounded-full blur-2xl animate-pulse"
                      style={{ backgroundColor: isMentor ? "rgba(236, 72, 153, 0.3)" : `${pageAccentLight}30` }}
                    />
                    <div
                      className="relative w-36 h-36 min-[400px]:w-40 min-[400px]:h-40 sm:w-42 sm:h-42 md:w-48 md:h-48 rounded-full p-[2px] sm:p-[3px] bg-linear-to-tr"
                      style={{
                        backgroundImage: isMentor
                          ? "linear-gradient(to top right, #F59E0B, #EC4899, #F59E0B)"
                          : `linear-gradient(to top right, ${pageAccent}, ${pageAccentLight}, ${pageAccent})`,
                        boxShadow: isMentor
                          ? "0 0 30px rgba(245, 158, 11, 0.4)"
                          : `0 0 30px ${pageAccent}60`,
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-[#081416] overflow-hidden flex items-center justify-center">
                        {image ? (
                          <motion.img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            animate={{ scale, rotate: rotation }}
                            transition={{
                              type: "spring",
                              stiffness: 120,
                              damping: 20,
                            }}
                          />
                        ) : (
                          <UserIcon className="w-16 h-16 text-white/20" />
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-[6%] right-[6%] sm:bottom-[4%] sm:right-[4%] flex items-center justify-center">
                      {isMentor ? (
                        <div className="relative -translate-y-2 flex items-center justify-center w-4 h-4 min-[400px]:w-6 min-[400px]:h-6 sm:w-8 sm:h-8 bg-[#F59E0B] rounded-full ring-[1px] sm:ring-2 ring-[#0a0514] shadow-[0_0_10px_rgba(245,158,11,0.3)] z-20">
                          <Star className="w-3 h-3 min-[400px]:w-4 min-[400px]:h-4 sm:w-5 sm:h-5 text-white fill-white" />
                        </div>
                      ) : (
                        <div className="relative w-5 h-5 min-[400px]:w-7 min-[400px]:h-7 sm:w-10 sm:h-10 text-[#00D6B2] drop-shadow-[0_0_12px_rgba(0,214,178,0.6)]">
                          <img
                            src="/badgeCheck.png"
                            alt="Verified"
                            className="w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 w-full flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center w-full">
                      <div className="flex items-center gap-2 sm:gap-4 w-full mb-2 sm:mb-4">
                        <div
                          className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to right, transparent, ${isMentor ? "#F59E0B" : pageAccent}40, transparent)`,
                          }}
                        />
                        <Sparkles
                          className="w-3 h-3 sm:w-5 sm:h-5"
                          style={{
                            color: isMentor ? "#F59E0B" : pageAccent,
                            filter: `drop-shadow(0 0 8px ${isMentor ? "#F59E0B" : pageAccent})`,
                          }}
                        />
                        <div
                          className="h-px flex-1 bg-linear-to-l from-transparent via-white/20 to-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to left, transparent, ${isMentor ? "#F59E0B" : pageAccent}40, transparent)`,
                          }}
                        />
                      </div>

                      <h2 className="text-xl min-[400px]:text-lg sm:text-2xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-6 tracking-tight text-center px-1 wrap-break-word max-w-full overflow-hidden">
                        {name || "Your Name"}
                      </h2>

                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full border mb-2 md:mb-4 lg:mb-8 shadow-lg backdrop-blur-md transition-all duration-300",
                          !isMentor && config.tagBg,
                          isMentor ? "border-[#A855F7]/30" : "border-[#00D6B2]/20 shadow-[#00D6B2]/10"
                        )}
                        style={isMentor ? {
                          background: "linear-gradient(90deg, rgba(88, 28, 135, 0.45) 0%, rgba(120, 53, 15, 0.45) 100%)",
                          boxShadow: "0 0 20px rgba(168, 85, 247, 0.15), inset 0 0 12px rgba(0, 0, 0, 0.2)"
                        } : {}}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 -translate-y-[0.5px]",
                            isMentor ? "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.9)]" : "bg-[#00D6B2]"
                          )}
                        />
                        <span className={cn(
                          "text-[12px] sm:text-[14px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase",
                          isMentor
                            ? "bg-linear-to-r from-[#C084FC] via-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent"
                            : config.tagText
                        )}>
                          {config.roleLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/20 opacity-60" />
                        <div className="flex items-center gap-1 sm:gap-2" style={{ color: isMentor ? "#F59E0B" : "rgba(255, 255, 255, 0.6)" }}>
                          <span className="text-xs sm:text-lg leading-none">
                            •
                          </span>
                          <span className="text-[10px] sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-md">
                            2026
                          </span>
                          <span className="text-xs sm:text-lg leading-none">
                            •
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/20 opacity-60" />
                      </div>
                    </div>

                    <div className="w-full flex justify-center my-auto pb-1 sm:pb-4 lg:pb-0">
                      <img
                        src="/nex1.png"
                        alt="NexFellow"
                        className="w-[35%] sm:w-[50%] h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 flex items-center justify-center gap-3 text-white/40">
                <div
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px]"
                  style={{
                    backgroundColor: pageAccent,
                    boxShadow: `0 0 8px ${pageAccent}`,
                  }}
                />
                <span className="text-xs font-semibold tracking-wide">
                  Your badge updates in real-time
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full max-w-xl"
            >
              <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight">
                Create Your{" "}
                <span
                  className="bg-clip-text text-transparent bg-linear-to-r from-[#00D6B2] to-[#4FD1D0]"
                >
                  Badge
                </span>
              </h2>
              <p className="text-[#94A3B8] text-lg mb-5 leading-relaxed">
                Personalize your badge with your name and photo. Download and
                share your achievement.
              </p>

              <div className="group flex items-center gap-5 p-5 rounded-2xl bg-[#0A1B24] border border-white/5 mb-14 hover:bg-[#0A1B24]/80 transition-all duration-500">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${config.accent}10` }}
                >
                  <Shield className="w-6 h-6" style={{ color: config.accent }} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5 tracking-tight">
                    Privacy First
                  </h4>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    We don&apos;t store your image. Your privacy is our
                    priority.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <UserIcon className="w-5 h-5" style={{ color: pageAccent }} />
                      <Label
                        htmlFor="name"
                        className="text-[14px] font-bold uppercase tracking-[0.2em] text-white"
                      >
                        YOUR NAME <span className="text-red-500 ml-0.5">*</span>
                      </Label>
                    </div>
                    <div className="text-[12px] font-bold text-white/60 uppercase tracking-widest">
                      {name.length}/30 characters
                    </div>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 30))}
                    className="h-14 border-white/15 rounded-2xl px-4 focus:ring-0 text-lg font-medium transition-all placeholder:text-white/70 bg-[#0E1726]"
                    style={{ borderColor: `${config.accent}30` }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-5 h-5" style={{ color: config.accent }} />
                    <Label className="text-[14px] font-bold uppercase tracking-[0.2em] text-white">
                      YOUR PHOTO <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />

                  {image ? (
                    <div
                      className="relative rounded-xl border-2 border-dashed bg-white/2 flex gap-4 cursor-pointer transition-all hover:bg-white/4 group overflow-hidden py-4 px-7"
                      style={{ borderColor: `${config.accent}30` }}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className="flex gap-4">
                        <div className="relative w-14 h-14 rounded-full p-1 shadow-[0_0_50px_rgba(214,178,0,0.3)] shrink-0">
                          <div
                            className="absolute inset-0 rounded-full z-0 blur-sm"
                            style={{
                              background: `radial-gradient(circle at center, ${config.accent} 70%, ${config.accentLight} 30%)`,
                            }}
                          />
                          <div className="w-full h-full rounded-full bg-[#0B1220] overflow-hidden flex items-center justify-center ring-2 ring-black/50 relative">
                            <motion.img
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              src={image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex gap-1 text-lg justify-center items-center" style={{ color: config.accent }}>
                            <Check className="w-4" />
                            <span className="font-bold">Photo uploaded</span>
                          </div>
                          <div className="text-[#94A3B8]">
                            Click to change photo
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className={cn(
                        "relative h-64 rounded-4xl border-2 border-dashed border-white/15 bg-white/2 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:bg-white/4 group overflow-hidden"
                      )}
                    >
                      <div className="flex flex-col items-center gap-6">
                        <div
                          className="w-20 h-20 rounded-3xl bg-white/3 flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                          style={{
                            backgroundColor: `${config.accent}10`,
                          }}
                        >
                          <Upload
                            className="w-8 h-8 text-white/10 transition-colors"
                            style={{ color: `${config.accent}30` }}
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-md sm:text-xl font-bold text-white/80 group-hover:text-white transition-colors">
                            Drop your photo here or{" "}
                            <span style={{ color: config.accent }}>browse</span>
                          </p>
                          <p className="text-xs font-bold text-[#64748B] uppercase sm:tracking-[0.2em]">
                            JPG or PNG • Auto-cropped to square
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {image && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-[#0B1220] border border-white/5 p-6 overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        adjustmentsDone && "cursor-pointer"
                      )}
                      onClick={() =>
                        adjustmentsDone && setAdjustmentsDone(false)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${config.accent}10` }}
                        >
                          <Move className="w-5 h-5" style={{ color: config.accent }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Adjust Your Image
                          </h3>
                          <p className="text-sm text-[#64748B]">
                            Fine-tune position and size
                          </p>
                        </div>
                      </div>
                      {adjustmentsDone ? (
                        <button
                          onClick={() => setAdjustmentsDone(false)}
                          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <ChevronDown
                            className="w-5 h-5 transition-transform"
                            style={{ color: config.accent }}
                          />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Undo2 className="w-4 h-4" style={{ color: config.accent }} />
                          </button>
                          <button
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Redo2 className="w-4 h-4" style={{ color: config.accent }} />
                          </button>
                        </div>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {!adjustmentsDone && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-5 pt-5">
                            {/* Scale Control */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Search className="w-4 h-4 text-[#00D6B2]" />
                                  <span className="text-sm font-medium text-white">
                                    Scale
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#00D6B2] bg-[#00D6B2]/10 px-2 py-1 rounded-md min-w-12.5 text-center">
                                    {scale.toFixed(2)}x
                                  </span>
                                  <button
                                    onClick={resetScale}
                                    className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                  >
                                    <RefreshCw
                                      className="w-3.5 h-3.5"
                                      style={{ color: config.accent }}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Search className="w-4 h-4 text-[#64748B]" />
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2"
                                  step="0.01"
                                  value={scale}
                                  onChange={(e) =>
                                    handleScaleChange(
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  onMouseUp={(e) =>
                                    handleScaleCommit(
                                      parseFloat(
                                        (e.target as HTMLInputElement).value
                                      )
                                    )
                                  }
                                  onTouchEnd={(e) =>
                                    handleScaleCommit(
                                      parseFloat(
                                        (e.target as HTMLInputElement).value
                                      )
                                    )
                                  }
                                  className="flex-1 h-1.5 bg-[#1a2535] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B1220]"
                                  style={{
                                    background: `linear-gradient(to right, ${config.accent
                                      } 0%, ${config.accent} ${((scale - 0.5) / 1.5) * 100
                                      }%, #1a2535 ${((scale - 0.5) / 1.5) * 100}%, #1a2535 100%)`,
                                  }}
                                />
                                <Search className="w-5 h-5 text-[#64748B]" />
                              </div>
                            </div>

                            {/* Rotation Control */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <RotateCcw className="w-4 h-4 text-[#00D6B2]" />
                                  <span className="text-sm font-medium text-white">
                                    Rotation
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#00D6B2] bg-[#00D6B2]/10 px-2 py-1 rounded-md min-w-12.5 text-center">
                                    {rotation}°
                                  </span>
                                  <button
                                    onClick={resetRotation}
                                    className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                  >
                                    <RefreshCw
                                      className="w-3.5 h-3.5"
                                      style={{ color: config.accent }}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <RotateCcw className="w-4 h-4 text-[#64748B]" />
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  step="1"
                                  value={rotation}
                                  onChange={(e) =>
                                    handleRotationChange(
                                      parseInt(e.target.value)
                                    )
                                  }
                                  onMouseUp={(e) =>
                                    handleRotationCommit(
                                      parseInt(
                                        (e.target as HTMLInputElement).value
                                      )
                                    )
                                  }
                                  onTouchEnd={(e) =>
                                    handleRotationCommit(
                                      parseInt(
                                        (e.target as HTMLInputElement).value
                                      )
                                    )
                                  }
                                  className="flex-1 h-1.5 bg-[#1a2535] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B1220]"
                                  style={{
                                    background: `linear-gradient(to right, ${config.accent
                                      } 0%, ${config.accent} ${(rotation / 360) * 100
                                      }%, #1a2535 ${(rotation / 360) * 100}%, #1a2535 100%)`,
                                  }}
                                />
                                <RefreshCw className="w-4 h-4 text-[#64748B]" />
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                {[0, 90, 180, 270].map((deg) => (
                                  <button
                                    key={deg}
                                    onClick={() => setQuickRotation(deg)}
                                    className={cn(
                                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                      rotation === deg
                                        ? "text-black"
                                        : "bg-[#1a2535] text-[#64748B] hover:bg-[#1a2535]/80 hover:text-white"
                                    )}
                                    style={
                                      rotation === deg
                                        ? {
                                          backgroundImage: `linear-gradient(to right, ${config.accent}, ${config.accentLight})`,
                                        }
                                        : {}
                                    }
                                  >
                                    {deg}°
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                              <Button
                                variant="outline"
                                onClick={resetAll}
                                className="flex-1 h-12 rounded-xl border-white/5 bg-[#1a2535] hover:bg-[#1a2535]/80 text-sm font-medium text-white hover:text-white transition-all cursor-pointer"
                              >
                                <RefreshCw
                                  className="w-4 h-4 mr-2"
                                  style={{ color: config.accent }}
                                />
                                Reset All
                              </Button>
                              <Button
                                className="flex-1 h-12 rounded-xl text-black text-sm font-bold transition-all cursor-pointer"
                                style={{
                                  backgroundImage: `linear-gradient(to right, ${config.accent}, ${config.accentLight})`,
                                }}
                                onClick={() => setAdjustmentsDone(true)}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Done
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-5 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl border-white/15 bg-white/2 hover:bg-white/5 hover:border-white/10 text-sm font-bold cursor-pointer hover:text-white uppercase tracking-[0.2em] transition-all group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload
                      className="w-4 h-4 mr-3 transition-transform"
                      style={{ color: config.accent }}
                    />
                    {image ? "CHANGE IMG" : "UPLOAD IMG"}
                  </Button>
                  <Button
                    className="flex-1 h-16 rounded-2xl text-black border-0 text-sm font-black uppercase tracking-[0.2em] transition-all group disabled:opacity-20 disabled:grayscale cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${config.accent}, ${config.accentLight})`,
                      boxShadow: `0 20px 40px -15px ${config.accent}40`,
                    }}
                    disabled={!name || !image || isDownloading}
                    onClick={handleDownload}
                  >
                    <Download
                      className={cn(
                        "w-4 h-4 mr-3 transition-transform",
                        isDownloading && "animate-spin"
                      )}
                    />
                    {isDownloading ? "Generating..." : "Download"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

