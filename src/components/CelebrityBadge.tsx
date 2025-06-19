import { Badge } from "@/components/ui/badge";

interface CelebrityBadgeProps {
  className?: string;
}

const CelebrityBadge: React.FC<CelebrityBadgeProps> = ({ className }) => {
  return (
    <Badge
      className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs font-semibold ${className}`}
    >
      ⭐
    </Badge>
  );
};

export default CelebrityBadge;
