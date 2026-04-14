// ── Loader Component ──────────────────────────────────────────────────────────
// Used throughout the app for loading states.

import React from "react";

/**
 * Full-page centered spinner.
 * @param {string} message  Optional message shown below the spinner.
 */
export const Loader = ({ message = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative w-14 h-14">
      {/* Outer ring */}
      <span className="absolute inset-0 rounded-full border-2 border-ink-700" />
      {/* Spinning arc */}
      <span
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
      {/* Inner dot */}
      <span className="absolute inset-[18px] rounded-full bg-gold-500 animate-pulse" />
    </div>
    {message && (
      <p className="text-gray-500 text-sm font-mono tracking-widest uppercase animate-pulse">
        {message}
      </p>
    )}
  </div>
);

/**
 * Inline button-sized spinner.
 */
export const ButtonLoader = () => (
  <span
    className="inline-block w-4 h-4 rounded-full border-2 border-ink-950/40 border-t-ink-950 animate-spin"
    style={{ animationDuration: "0.7s" }}
  />
);

/**
 * Skeleton placeholder card for event grids.
 */
export const EventCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="skeleton h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex gap-3 mt-4">
        <div className="skeleton h-9 w-24" />
        <div className="skeleton h-9 w-20" />
      </div>
    </div>
  </div>
);
