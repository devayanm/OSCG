"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock, User, Loader2, BookOpen, Search, Filter } from "lucide-react";
import Navigation from "@/components/landing/navigation";
import Footer from "@/components/landing/footer-section";
import { blogPosts } from "@/data/blog-posts";
import Link from "next/link";
import Image from "next/image";
import ComingSoon from "@/components/ComingSoon/coming-soon-page";

const categories = [
    "All",
    "Best Practices",
    "Tutorial",
    "Insights",
    "Security",
    "Development",
    "Community",
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
    },
};

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef(null);

    const filteredPosts = activeCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMorePosts = visibleCount < filteredPosts.length;

    const loadMorePosts = useCallback(() => {
        if (isLoading || !hasMorePosts) return;

        setIsLoading(true);

        setTimeout(() => {
            setVisibleCount(prev => prev + 6);
            setIsLoading(false);
        }, 600);
    }, [isLoading, hasMorePosts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMorePosts && !isLoading) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadMorePosts, hasMorePosts, isLoading]);

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setVisibleCount(6);
    };

    return (
        <div className="min-h-screen text-white overflow-x-hidden mt-[80px] selection:bg-[#00D6B2]/30">

            <Navigation/>            
                <motion.div
                    className="text-center mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00D6B2]" />
                        <span className="text-[ #00D6B2] text-xs font-bold tracking-[0.2em] uppercase">
                            Knowledge Hub
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00D6B2]" />
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight"
                    >
                        Latest <span className="text-accent-gradient">Insights</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="text-[#64748B] text-lg max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Discover tutorials, best practices, and stories from the open source community
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2 cursor-pointer rounded-full text-xs font-semibold tracking-wide transition-all duration-400 border ${activeCategory === cat
                                ? "bg-[#00D6B2] border-[#00D6B2] text-black shadow-[0_0_30px_-5px_rgba(0,214,178,0.5)]"
                                : "bg-white/[0.03] border-white/10 text-[#64748B] hover:text-white hover:border-[#00D6B2]/40 hover:bg-white/[0.05]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between mb-8"
                >
                    <p className="text-sm text-[#64748B]">
                        Showing <span className="text-white font-semibold">{visiblePosts.length}</span> of{" "}
                        <span className="text-white font-semibold">{filteredPosts.length}</span> articles
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-8 lg:grid-cols-3 md:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="popLayout">
                        {visiblePosts.map((article) => (
                            <Link
                                href={`/blog/${article.slug}`}
                                key={article.id}
                                className="group block"
                            >
                                <motion.article
                                    layout
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="relative flex flex-col h-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#00D6B2]/30 hover:shadow-[0_0_60px_-15px_rgba(0,214,178,0.3)]"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden bg-[#0A0F15]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F15] via-[#0F1A24] to-[#0A0F15]">
                                            <Image
                                                src={article.featuredImage}
                                                alt={article.title}
                                                fill
                                                className="object-fill transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>

                                        <div className="absolute bottom-4 left-4 z-20">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0A0F15]/90 backdrop-blur-sm border border-[#00D6B2]/40 text-[#00D6B2] shadow-lg">
                                                <BookOpen className="w-3 h-3" />
                                                {article.category}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0F15] to-transparent z-10 pointer-events-none opacity-50" />
                                    </div>

                                    <div className="flex flex-col flex-1 p-6 pt-4">
                                        <div className="flex items-center justify-between text-xs text-[#64748B] mb-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <time>{article.date}</time>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-white/50">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-3 leading-snug line-clamp-2 group-hover:text-[#00D6B2] transition-colors duration-300">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-5 flex-1">
                                            {article.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D6B2] to-[#4FD1D0] rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-500" />
                                                    <img
                                                        src={article.author.avatar}
                                                        alt={article.author.name}
                                                        className="relative w-8 h-8 rounded-full border border-white/10 bg-[#1a1f2e]"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-white/90">
                                                        {article.author.name}
                                                    </span>
                                                    <span className="text-[10px] text-[#64748B]">
                                                        {article.author.role}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-sm font-semibold text-[#00D6B2] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                <span>Read</span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#00D6B2]/5 via-transparent to-transparent" />
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div ref={observerTarget} className="h-10 w-full" />

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00D6B2]/20 blur-xl rounded-full" />
                            <Loader2 className="relative h-10 w-10 text-[#00D6B2] animate-spin" />
                        </div>
                        <p className="text-[#64748B] text-sm font-medium">
                            Loading more insights...
                        </p>
                    </motion.div>
                )}

                {filteredPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-[#64748B]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                        <p className="text-[#64748B]">
                            There are no articles in the &quot;{activeCategory}&quot; category yet.
                        </p>
                    </motion.div>
                )}
            <Footer />
        </div>
    );
};

export default BlogPage;