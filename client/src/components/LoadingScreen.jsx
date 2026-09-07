import { RiHeartPulseLine } from "@remixicon/react";

export function LoadingScreen({ message = "Checking authentication..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9f7] px-6 text-[#143337] antialiased">
      <div className="relative flex flex-col items-center text-center">
        {/* Animated pulsating halo */}
        <div className="relative mb-6 flex size-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-[#0c5e5b]/15 duration-1000" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-[#0c5e5b] text-white shadow-lg shadow-[#0c5e5b]/20">
            <RiHeartPulseLine className="size-8 animate-pulse text-white" />
          </div>
        </div>

        {/* Brand label */}
        <span className="text-xs font-bold tracking-[0.16em] text-[#0c5e5b] uppercase">
          MediKiosk
        </span>

        {/* Loading text */}
        <h2 className="mt-2 text-xl font-bold tracking-tight text-[#143337]">
          {message}
        </h2>
        <p className="mt-1 text-xs text-[#5d7c80]">
          Securing your clinical session...
        </p>

        {/* Loading dots */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="size-2 animate-bounce rounded-full bg-[#0c5e5b]" style={{ animationDelay: "0ms" }} />
          <span className="size-2 animate-bounce rounded-full bg-[#0c5e5b]" style={{ animationDelay: "150ms" }} />
          <span className="size-2 animate-bounce rounded-full bg-[#0c5e5b]" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
