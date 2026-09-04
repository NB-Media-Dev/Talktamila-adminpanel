import { AtSign, BarChart2, Bookmark, Clock, Heart, IndianRupee, MapPin, MessageCircle, Send, Sparkles, TrendingUp} from "lucide-react";

interface IconProps {
  className?: string;
}

export const InstagramIcon = ({ className = "" }: IconProps = {}) => (
   <div className={`w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0 ${className}`}>
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
);

export const FacebookIcon = ({ className = "" }: IconProps = {}) => (
  <div className={`w-7 h-7 rounded-full text-[#1877F2] flex items-center justify-center bg-white shadow-xs shrink-0 ${className}`}>
            <svg className="w-8 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
)

export const TreadsIcon = ({ className = "" }: IconProps = {}) => (
   <div className={`w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shadow-xs shrink-0 ${className}`}>
            <AtSign className="w-4 h-4" />
          </div>
)

export const YoutubeIcon = ({ className = "" }: IconProps = {}) => (
   <div className={`w-6.5 h-6.5 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-xs shrink-0 ${className}`}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
)

export const ThreadsIcon = ({ className = "" }: IconProps = {}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 text-black shrink-0 ${className}`}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.185 13.914c-.16 2.457-1.782 4.195-4.225 4.195-2.616 0-4.462-1.996-4.462-4.815 0-2.827 1.87-4.832 4.542-4.832 2.404 0 3.996 1.572 4.168 3.738h-1.84c-.131-1.22-.962-2.023-2.308-2.023-1.572 0-2.664 1.251-2.664 3.117 0 1.858 1.072 3.109 2.585 3.109 1.346 0 2.196-.86 2.336-2.164h-2.585v-1.547h4.453v1.222z" />
  </svg>
);
export const TalkTamilaIcon = ({ className = "" }: IconProps = {}) => (
  <div className={`w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5C28] to-[#FF8C42] flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-xs ${className}`}>
    TT
  </div>
);

export const HeartIcon=()=>(
   <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-red-400 transition-all" />
)

export const SendIcon=()=>(
    <Send className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] transition-all" />
)

export const MessageIcons=()=>(
  <MessageCircle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-blue-500/20 transition-all" />
)

export const SavedIcons=()=>(
  <Bookmark className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-yellow-500 transition-all" />
)

export const TrendingIcons=()=>(
  <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
)

export const IndianrupeeIcons=()=>(
  <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
)

export const SparkleIcons=()=>(
  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
)

export const ClockIcons=()=>(
  <Clock className="w-4 h-4 text-[#FF6B35]" />
)

export const Barcharticons=()=>(
   <BarChart2 className="w-3.5 h-3.5 " />
)

export const LocationsIcons=()=>(
  <MapPin className="w-3.5 h-3.5" />
)

export const WalterIcons=()=>(
   <div className="absolute bottom-[-5px] right-[-5px] sm:bottom-[-10px] sm:right-[-10px] w-[105px] h-[105px] xs:w-[125px] xs:h-[125px] sm:w-[140px] sm:h-[140px] pointer-events-none opacity-85 sm:opacity-90 select-none block">
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
)