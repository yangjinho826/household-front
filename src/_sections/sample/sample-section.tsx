import { SampleProvider } from "_features/sample/context";
import { SampleDetail } from "_features/sample/components/sample-detail";
import { SampleFab } from "_features/sample/components/sample-fab";
import { SampleFormModal } from "_features/sample/components/sample-form-modal";
import { SampleHeader } from "_features/sample/components/sample-header";
import { SampleList } from "_features/sample/components/sample-list";
import { SampleSummaryCard } from "_features/sample/components/sample-summary-card";

/**
 * SampleSection — 샘플 페이지 view 조립.
 * SampleProvider 가 여기서 마운트 (sample 페이지 진입 시에만 활성).
 */
export function SampleSection() {
  return (
    <SampleProvider>
      <div className="fade-in">
        <SampleHeader />
        <SampleSummaryCard />
        <SampleList />
        <SampleFab />
        <SampleFormModal />
        <SampleDetail />
      </div>
    </SampleProvider>
  );
}
