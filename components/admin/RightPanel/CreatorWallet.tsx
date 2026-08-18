"use client";


import { Wallet} from "lucide-react";

export default function CreatorWallet() {


  return (
    <div className="w-[350px] bg-gradient-to-br from-[#FFAE64] to-[#FF5B3E] rounded-[32px] p-6 shadow-[0_12px_30px_rgba(255,91,62,0.25)] relative overflow-hidden flex flex-col justify-between min-h-[260px] text-white">


      <div className="z-10">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-5 h-5 text-white/95" />
          <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
            Creator Wallet
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-4.5">
          ₹1,84,320
        </h2>


        <div className="flex flex-col gap-2.5 text-xs font-semibold text-white/90 max-w-[220px]">
          <div className="flex justify-between items-center">
            <span className="opacity-80">Pending approval</span>
            <span>₹22,400</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-80">Campaign earnings</span>
            <span>₹90,100</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="opacity-80">Affiliate income</span>
            <span>₹71,820</span>
          </div>
        </div>
      </div>

      <div className="z-10 mt-6 flex items-end">
        <button
          className="bg-white hover:bg-white/95 active:scale-[0.98] text-[#FF5B3E] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
        >
          Withdraw
        </button>
      </div>

      <div className="absolute bottom-[-10px] right-[-10px] w-[140px] h-[140px] pointer-events-none opacity-90 select-none hidden sm:block">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform translate-x-2 translate-y-2"
        >

          <circle
            cx="40"
            cy="60"
            r="12"
            fill="url(#coin_gradient)"
            className="animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <circle cx="40" cy="60" r="8" fill="url(#coin_inner)" />


          <circle
            cx="140"
            cy="35"
            r="16"
            fill="url(#coin_gradient)"
            className="animate-bounce"
            style={{ animationDuration: "4s" }}
          />
          <circle cx="140" cy="35" r="11" fill="url(#coin_inner)" />


          <rect
            x="70"
            y="70"
            width="60"
            height="40"
            rx="6"
            transform="rotate(-15 70 70)"
            fill="#4E9F3D"
            stroke="#3E8330"
            strokeWidth="1.5"
          />

          <rect
            x="95"
            y="65"
            width="60"
            height="40"
            rx="6"
            transform="rotate(5 95 65)"
            fill="#1E56A0"
            stroke="#163E75"
            strokeWidth="1.5"
          />

          <ellipse cx="110" cy="165" rx="65" ry="15" fill="black" fillOpacity="0.15" />


          <rect
            x="60"
            y="95"
            width="100"
            height="65"
            rx="14"
            fill="url(#wallet_dark_gradient)"
            stroke="#D9572B"
            strokeWidth="2"
          />


          <path
            d="M 60 115 C 60 100, 160 100, 160 115 L 160 155 C 160 162, 60 162, 60 155 Z"
            fill="#FFF6ED"
            opacity="0.15"
          />


          <rect
            x="55"
            y="105"
            width="105"
            height="60"
            rx="14"
            fill="url(#wallet_light_gradient)"
            stroke="#FF6E3A"
            strokeWidth="2.5"
            filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15))"
          />


          <path
            d="M 120 120 L 165 120 C 170 120, 170 135, 165 135 L 120 135 Z"
            fill="#D9572B"
            stroke="#BF471D"
            strokeWidth="1.5"
          />

          <circle cx="155" cy="127.5" r="5" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />


          <defs>
            <linearGradient id="wallet_light_gradient" x1="55" y1="105" x2="160" y2="165" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA474" />
              <stop offset="100%" stopColor="#FF6036" />
            </linearGradient>
            <linearGradient id="wallet_dark_gradient" x1="60" y1="95" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E66735" />
              <stop offset="100%" stopColor="#B33E17" />
            </linearGradient>
            <linearGradient id="coin_gradient" x1="124" y1="19" x2="156" y2="51" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="100%" stopColor="#F5B000" />
            </linearGradient>
            <linearGradient id="coin_inner" x1="129" y1="24" x2="151" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5B000" />
              <stop offset="100%" stopColor="#C78E00" />
            </linearGradient>
          </defs>
        </svg>
      </div>



    </div>
  );
}
