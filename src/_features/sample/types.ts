//검색 params 타입
export interface SampleSearchRequestType {
  searchTerm?: string;
  sampleEmail?: string;
}

export interface SampleBaseRequestType {
  sampleEmail: string;
  sampleTitle: string;
  sampleContent: string;
  sampleRadio: string;
  sampleCheckbox: string[];
  sampleSelect: string | null;
  sampleNumberbox: number;
  sampleDate: Date | null;
  sampleFile: File | null;
}

//export interface SampleCreateRequest extends SampleBaseRequest {}
export type SampleCreateRequest = SampleBaseRequestType;

export interface SampleUpdateRequest extends SampleBaseRequestType {
  sampleId: string;
}

//리스트 아이템 타입
export interface SampleListItemType {
  rowNo: number;
  sampleId: string;
  sampleEmail: string;
  sampleTitle: string;
  sampleContent: string;
  sampleRadio: string;
  sampleCheckbox: string[];
  sampleSelect: string;
  sampleNumberbox: number;
  sampleDate: string;
  frstRgstDtm: string;
  frstRgstUserId: string;
  lastMdfcnDtm: string;
  lastMdfcnUserId: string;
  dataStatCd: string;
}

//상세보기 아이템 타입입
export interface SampleDetailItemType {
  sampleId: string;
  sampleEmail: string;
  sampleTitle: string;
  sampleContent: string;
  sampleRadio: string;
  sampleCheckbox: string[];
  sampleSelect: string;
  sampleNumberbox: number;
  sampleDate: string;
  frstRgstDtm: string;
  frstRgstUserId: string;
  lastMdfcnDtm: string;
  lastMdfcnUserId: string;
  dataStatCd: string;
}
