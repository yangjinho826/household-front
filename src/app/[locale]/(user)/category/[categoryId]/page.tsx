import CategoryFormSection from "_sections/category/category-form-section";

export default function CategoryDetailPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return <CategoryFormSection categoryId={params.categoryId} />;
}
