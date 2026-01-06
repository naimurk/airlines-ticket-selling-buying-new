import type { BaseQueryApi } from "@reduxjs/toolkit/query";

export type TQueryParams = {
  name: string;
  value: boolean | React.Key;
};

export interface TError {
  data: {
    success: boolean;
    message: string;
    errorSources: Array<{
      path: string;
      message: string;
    }>;
    err: {
      issues: Array<{
        code: string;
        expected: string;
        received: string;
        path: string[];
        message: string;
      }>;
      name: string;
    };
    stack: string;
  };
  status: number;
}

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success?: boolean;
  message?: string;
};

export type TResponseWithRedux<T> = BaseQueryApi & TResponse<T>;
