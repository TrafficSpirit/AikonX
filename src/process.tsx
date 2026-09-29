import { FeatureSteps, type Feature } from "@/components/ui/feature-section";

const features: Feature[] = [
  {
    step: "01",
    title: "Audit & discovery",
    content: "We dig into your data, funnel and market to find the fastest paths to growth.",
    image: "/assets/images/process-audit.png?v=user-art-1",
  },
  {
    step: "02",
    title: "Strategy & plan",
    content: "A channel plan with targets, budgets and timelines mapped straight to revenue.",
    image: "/assets/images/process-strategy.png?v=user-art-1",
  },
  {
    step: "03",
    title: "Launch & build",
    content: "We build the campaigns, creative and tracking, then take everything live.",
    image: "/assets/images/process-launch.png?v=user-art-1",
  },
  {
    step: "04",
    title: "Optimize & scale",
    content: "Weekly testing and budget shifts compound results month over month.",
    image: "/assets/images/process-scale.png?v=user-art-1",
  },
];

export function Process() {
  return (
    <FeatureSteps
      features={features}
      eyebrow="How we work"
      title="A clear path from spend to results."
      description="No black boxes. You always know what stage we're in, what we're testing, and what it's doing for your revenue."
      autoPlayInterval={4000}
    />
  );
}
