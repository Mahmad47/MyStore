import React, { useRef, useLayoutEffect, useState } from "react";

const LoadingButton = ({
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = "",
}) => {
  const spanRef = useRef(null);
  const [minWidth, setMinWidth] = useState("auto");


  // Measure text width once when children change
  useLayoutEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setMinWidth(`${width + 24}px`); // add small padding for consistency
    }
  }, [children]);

  return (
    <button
      onClick={!isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center px-4 py-2 rounded-md transition
        ${disabled || isLoading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-black text-white hover:bg-gray-800"}
        ${className}`}
      style={{ minWidth }}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span ref={spanRef} className="whitespace-nowrap">
          {children}
        </span>
      )}
    </button>
  );
};

export default LoadingButton;
