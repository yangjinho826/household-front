import AccountFormSection from "_sections/account/account-form-section";

export default function AccountDetailPage({
  params,
}: {
  params: { accountId: string };
}) {
  return <AccountFormSection accountId={params.accountId} />;
}
