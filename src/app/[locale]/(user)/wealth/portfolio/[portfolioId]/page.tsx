import PortfolioTradeSection from "_sections/wealth/portfolio-trade-section";

export default function WealthPortfolioDetailPage({
  params,
}: {
  params: { portfolioId: string };
}) {
  return <PortfolioTradeSection portfolioId={params.portfolioId} />;
}
