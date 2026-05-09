import { PortfolioByBroker } from "_features/portfolio/components/portfolio-by-broker";
import { PortfolioHeader } from "_features/portfolio/components/portfolio-header";
import { PortfolioHero } from "_features/portfolio/components/portfolio-hero";
import { PortfolioList } from "_features/portfolio/components/portfolio-list";

export function PortfolioSection() {
  return (
    <div className="fade-in">
      <PortfolioHeader />
      <PortfolioHero />
      <PortfolioList />
      <PortfolioByBroker />
    </div>
  );
}
