import { C } from "_styles/design-tokens";

export function PortfolioHeader() {
  return (
    <div className="bg-white px-4 pt-4 pb-3">
      <h1 className="text-xl font-extrabold" style={{ color: C.text }}>
        포트폴리오
      </h1>
    </div>
  );
}
