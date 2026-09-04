"use client";

export default function AIContentWorkflow() {
  const steps = [
    {id:1, name: "Idea", active: true },
    {id:2, name: "AI Research", active: true },
    {id:3, name: "Caption", active: true },
    {id:4, name: "Poster", active: true },
    {id:5, name: "Reel", active: false },
    {id:6, name: "Review", active: false },
    {id:7, name: "Approval", active: false },
    {id:8, name: "Publish", active: false },
    {id:9, name: "Analytics", active: false },
    {id:10, name: "Revenue", active: false },
  ];

  return (
    <div className="@container w-full max-w-full bg-white rounded-[32px] p-4 @xs:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
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

        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3.5 relative z-10">
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
