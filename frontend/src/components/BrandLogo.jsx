import React from "react";
const logoUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqykqsQ3Ydc0V7iapxH1evrePjLpqaUbQNtg&s";

export default function BrandLogo({
  compact = false,
  showText = true,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`overflow-hidden rounded-full bg-white shrink-0 ${
          compact ? "h-12 w-12" : "h-14 w-14"
        }`}
      >
        <img
          src={logoUrl}
          alt="Royal Hospital Logo"
          className="h-full w-full object-cover scale-[1.08]"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none pt-0.5">
          <div
            className={`${compact ? "text-[0.78rem]" : "text-[0.95rem]"} font-black uppercase tracking-[0.22em] text-white`}
          >
            Royal
          </div>
          <div
            className={`mt-1 ${compact ? "text-[0.78rem]" : "text-[0.95rem]"} font-black uppercase tracking-[0.22em] text-royalBlue`}
          >
            Hospital
          </div>
        </div>
      )}
    </div>
  );
}
