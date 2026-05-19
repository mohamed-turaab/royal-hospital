import React from "react";
export default function Avatar({ src, name, size = "h-11 w-11" }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0f172a&color=fff`;
  return (
    <img
      src={src || fallback}
      alt={name}
      className={`${size} rounded-full object-cover ring-2 ring-royalBlue-200`}
    />
  );
}
