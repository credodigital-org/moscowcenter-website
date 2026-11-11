import React from "react";
import "./LogoMark.css";

/**
 * Animated logo: "bloom" reveal on load, a light sheen that
 * sweeps across the logo shape, and a gentle sway on hover.
 *
 * Props: src (image URL), alt (text)
 */
export default function LogoMark({ src, alt }) {
  return (
    <span className="logomark" style={{ "--logo-src": `url("${src}")` }}>
      <img src={src} alt={alt} className="logomark-img" />
      <span className="logomark-sheen" aria-hidden="true" />
    </span>
  );
}
