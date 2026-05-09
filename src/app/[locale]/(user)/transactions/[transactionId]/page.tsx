import TransactionsFormSection from "_sections/transactions/transactions-form-section";

export default function TransactionDetailPage({
  params,
}: {
  params: { transactionId: string };
}) {
  return <TransactionsFormSection transactionId={params.transactionId} />;
}
