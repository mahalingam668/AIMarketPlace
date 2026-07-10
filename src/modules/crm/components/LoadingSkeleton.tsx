interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  className?: string;
}

function LoadingSkeleton({ count = 1, height = 16, className = '' }: LoadingSkeletonProps) {
  return (
    <div className="crm-skeleton-group" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`crm-skeleton ${className}`} style={{ height }} />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
