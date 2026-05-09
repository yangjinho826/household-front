import { C } from "_styles/design-tokens";

export function SettingsHeader() {
  return (
    <div className="bg-white px-4 pt-4 pb-3">
      <h1 className="text-xl font-extrabold" style={{ color: C.text }}>
        내정보
      </h1>
    </div>
  );
}
