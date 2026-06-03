import PortfolioFormSection from "_sections/invest/portfolio-form-section";

export default function PortfolioDetailPage({
  params,
}: {
  params: { portfolioId: string };
}) {
  return <PortfolioFormSection portfolioId={params.portfolioId} />;
}
