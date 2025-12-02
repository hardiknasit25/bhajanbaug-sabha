function MemberSkeleton() {
  return (
    <div className="flex justify-center items-start gap-2 border border-borderColor/20 bg-white p-2 animate-pulse">
      {/* Avatar Section Skeleton */}
      <div className="shrink-0">
        <div className="h-[65px] w-[65px] bg-gray-300 rounded-full" />
      </div>

      {/* Content Section Skeleton */}
      <div className="flex flex-1 flex-col space-y-2">
        {/* Name Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        {/* ID Section Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />

        {/* Status Icons Row Skeleton */}
        <div className="w-full flex justify-start items-center gap-8 pt-2">
          {/* Icon Skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-300 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemberSkeleton;
