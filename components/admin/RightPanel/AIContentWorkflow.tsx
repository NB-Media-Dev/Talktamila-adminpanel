"use client";



export default function AIContentWorkflow() {
  const steps = [
    { name: "Idea", active: true },
    { name: "AI Research", active: true },
    { name: "Caption", active: true },
    { name: "Poster", active: true },
    { name: "Reel", active: false },
    { name: "Review", active: false },
    { name: "Approval", active: false },
    { name: "Publish", active: false },
    { name: "Analytics", active: false },
    { name: "Revenue", active: false },
  ];

  return (
    <div className="w-[350px] bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight pl-1">
        AI Content Workflow
      </h2>

      <div className="relative pl-3 flex flex-col gap-4 py-1">
     
        <div className="absolute left-[17px] top-[10px] bottom-[10px] w-[2px] bg-gray-100">
          <div
            className="w-full bg-[#FF5A26] rounded-full"
            style={{ height: "35%" }}
          />
        </div>

        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3.5 relative z-10">
            <div className={`w-2.5 h-2.5 rounded-full ${step.active ? "bg-[#FF5A26]" : "bg-gray-200"}`} />
      
            <span className={`text-xs font-bold ${step.active ? "text-gray-900" : "text-gray-400"}`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
