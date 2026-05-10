import AccountPortfolioSection from "_sections/wealth/account-portfolio-section";

export default function WealthAccountDetailPage({
  params,
}: {
  params: { accountId: string };
}) {
  return <AccountPortfolioSection accountId={params.accountId} />;
}
