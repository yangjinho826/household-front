// 도메인 엔티티
export type Sample = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

// API Request 타입
export type SampleCreateRequest = {
  title: string;
  description: string;
};

export type SampleUpdateRequest = {
  id: string;
  title?: string;
  description?: string;
};
