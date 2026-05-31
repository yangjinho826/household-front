import AccountReportSection from "_sections/account/account-report-section";

export default function AccountDetailPage({
  params,
}: {
  params: { accountId: string };
}) {
  return <AccountReportSection accountId={params.accountId} />;
}
