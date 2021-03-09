export interface AxiosRequest {
  request: {
    url: string;
    method?: string;
    data?: Record<string, unknown>;
  };
}

export interface AxiosResponse<T> {
  data: T;
}

export type RequestActions<K extends string, T, U = {}> = {
  type: K;
  payload: AxiosRequest & U;
} | {
  type: `${K}_SUCCESS`,
  payload: AxiosResponse<T>
};

export type ImmediateUpdateRequestActions<K extends string, T, U = T> = RequestActions<K, T, { value: U }>;