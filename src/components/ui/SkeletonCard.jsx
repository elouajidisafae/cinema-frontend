import React from 'react';

/**
 * Skeleton loader component for cards
 * Used during data loading to improve perceived performance
 */
export const SkeletonCard = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 animate-pulse">
        {/* Header */}
        <div className="h-32 bg-zinc-800 rounded-xl mb-4"></div>

        {/* Title */}
        <div className="h-6 bg-zinc-800 rounded w-3/4 mb-3"></div>

        {/* Description lines */}
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-zinc-800 rounded w-full"></div>
            <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
            <div className="h-3 bg-zinc-800 rounded w-4/6"></div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
            <div className="h-8 bg-zinc-800 rounded w-24"></div>
            <div className="h-8 bg-zinc-800 rounded w-20"></div>
        </div>
    </div>
);

/**
 * Skeleton loader for offer cards specifically
 */
export const SkeletonOfferCard = () => (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 animate-pulse">
        {/* Card Header Gradient */}
        <div className="h-32 bg-zinc-800"></div>

        {/* Card Content */}
        <div className="p-6 pt-2">
            <div className="mb-4">
                <div className="h-7 bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-1 w-12 bg-zinc-800 rounded-full"></div>
            </div>

            <div className="space-y-2 mb-6">
                <div className="h-3 bg-zinc-800 rounded w-full"></div>
                <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-3 bg-zinc-800 rounded w-4/6"></div>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="h-8 bg-zinc-800 rounded w-20"></div>
                <div className="h-6 bg-zinc-800 rounded w-24"></div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton loader for cinema room cards
 */
export const SkeletonRoomCard = () => (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 animate-pulse">
        {/* Image placeholder */}
        <div className="aspect-video bg-zinc-800"></div>

        {/* Content */}
        <div className="p-6">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4"></div>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-zinc-800 rounded-full w-12"></div>
                <div className="h-6 bg-zinc-800 rounded-full w-16"></div>
                <div className="h-6 bg-zinc-800 rounded-full w-10"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
        </div>
    </div>
);

export default SkeletonCard;
