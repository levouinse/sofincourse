export function CourseCardSkeleton() {
  return (
    <div className="h-full bg-[#0f1419] border-[#282d35] border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="w-full h-40 bg-[#282d35] rounded-lg mb-4 animate-pulse"></div>
        <div className="h-6 w-20 bg-[#282d35] rounded mb-3 animate-pulse"></div>
        <div className="h-7 w-3/4 bg-[#282d35] rounded mb-3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#282d35] rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-[#282d35] rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="bg-[#0f1419] border border-[#282d35] rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#282d35] rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-[#282d35] rounded animate-pulse"></div>
        </div>
        <div className="w-5 h-5 bg-[#282d35] rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-3/4 bg-[#282d35] rounded animate-pulse"></div>
      <div className="h-64 bg-[#282d35] rounded-lg animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-[#282d35] rounded animate-pulse"></div>
        <div className="h-4 w-full bg-[#282d35] rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-[#282d35] rounded animate-pulse"></div>
        <div className="h-4 w-full bg-[#282d35] rounded animate-pulse"></div>
        <div className="h-4 w-4/5 bg-[#282d35] rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export function SkillTreeSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          {i > 1 && (
            <div className="flex justify-center mb-4">
              <div className="w-1 h-12 bg-[#282d35] animate-pulse"></div>
            </div>
          )}
          <div className="bg-[#0f1419] border-2 border-[#282d35] rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#282d35] animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/2 bg-[#282d35] rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-[#282d35] rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-[#282d35] rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
