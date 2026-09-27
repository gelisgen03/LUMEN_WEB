import {
  Accessibility,
  BookOpenCheck,
  BrainCircuit,
  Compass,
  Eye,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Leaf,
  type LucideIcon,
  MessagesSquare,
  MonitorPlay,
  Plane,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users,
  Wrench,
  Globe2,
} from "lucide-react";

/** Icon keys used in content (MDX frontmatter and messages JSON). */
const icons: Record<string, LucideIcon> = {
  literacy: BookOpenCheck,
  participation: MessagesSquare,
  critical: ScanSearch,
  rights: ShieldCheck,
  inclusion: Accessibility,
  mobility: Plane,
  light: Lightbulb,
  innovation: Sparkles,
  europe: Globe2,
  leaf: Leaf,
  sprout: Sprout,
  transparency: Eye,
  exchange: Users,
  training: GraduationCap,
  webinar: MonitorPlay,
  tools: Wrench,
  partnership: Handshake,
  ai: BrainCircuit,
  impact: HeartHandshake,
  rocket: Rocket,
  target: Target,
  compass: Compass,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = icons[name] ?? Sparkles;
  return <C aria-hidden className={className} />;
}
