import { newId, todayIso } from "_utilities/fmt";

import type { SampleDetailItemType, SampleListItemType } from "./types";

let store: SampleDetailItemType[] = [
  {
    sampleId: newId(),
    sampleEmail: "alice@example.com",
    sampleTitle: "샘플 1",
    sampleContent: "샘플 내용 1",
    sampleRadio: "react",
    sampleCheckbox: ["react"],
    sampleSelect: "A",
    sampleNumberbox: 100,
    sampleDate: todayIso(),
    frstRgstDtm: todayIso(),
    frstRgstUserId: "system",
    lastMdfcnDtm: todayIso(),
    lastMdfcnUserId: "system",
    dataStatCd: "50",
  },
  {
    sampleId: newId(),
    sampleEmail: "bob@example.com",
    sampleTitle: "샘플 2",
    sampleContent: "샘플 내용 2",
    sampleRadio: "vue",
    sampleCheckbox: ["vue"],
    sampleSelect: "B",
    sampleNumberbox: 200,
    sampleDate: todayIso(),
    frstRgstDtm: todayIso(),
    frstRgstUserId: "system",
    lastMdfcnDtm: todayIso(),
    lastMdfcnUserId: "system",
    dataStatCd: "50",
  },
];

type CreateInput = Omit<
  SampleDetailItemType,
  | "sampleId"
  | "frstRgstDtm"
  | "frstRgstUserId"
  | "lastMdfcnDtm"
  | "lastMdfcnUserId"
  | "dataStatCd"
>;

export const sampleMockStore = {
  list(): SampleListItemType[] {
    return store.map((s, idx) => ({ ...s, rowNo: idx + 1 }));
  },
  detail(id: string): SampleDetailItemType | undefined {
    return store.find((s) => s.sampleId === id);
  },
  create(input: CreateInput): SampleDetailItemType {
    const item: SampleDetailItemType = {
      ...input,
      sampleId: newId(),
      frstRgstDtm: todayIso(),
      frstRgstUserId: "system",
      lastMdfcnDtm: todayIso(),
      lastMdfcnUserId: "system",
      dataStatCd: "50",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<SampleDetailItemType>,
  ): SampleDetailItemType | undefined {
    const idx = store.findIndex((s) => s.sampleId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: SampleDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDtm: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((s) => s.sampleId !== id);
  },
};
