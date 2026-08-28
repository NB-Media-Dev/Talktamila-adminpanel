import { AtSign, BarChart2, Bookmark, Clock, Heart, IndianRupee, MapPin, MessageCircle, Send, Sparkles, TrendingUp} from "lucide-react";

export  const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
);

export const FacebookIcon=(props: React.SVGProps<SVGSVGElement>)=>(
  <div className="w-7 h-7 rounded-full text-[#1877F2] flex items-center justify-center bg-white shadow-xs shrink-0">
            <svg className="w-8 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
)

export const TreadsIcon=(props: React.SVGProps<SVGSVGElement>)=>(
   <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shadow-xs shrink-0">
            <AtSign className="w-4 h-4" />
          </div>
)

export const YoutubeIcon=(props: React.SVGProps<SVGSVGElement>)=>(
   <div className="w-6.5 h-6.5 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
)

export const TalkTamilaIcon = () => (
  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5C28] to-[#FF8C42] flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-xs">
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
   <BarChart2 className="w-3.5 h-3.5" />
)

export const LocationsIcons=()=>(
  <MapPin className="w-3.5 h-3.5" />
)