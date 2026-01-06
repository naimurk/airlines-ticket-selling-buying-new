import { baseApi } from "@/redux/api/baseApi";
import type { TResponseWithRedux } from "@/types/global-types";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";

export interface TLoggedUser {
  id?: number; // Made optional as login response might not include it
  name?: string; // Made optional
  email: string;
  phone?: number; // Made optional
  address?: string; // Made optional
  role: RoleName[] | string; // Role from token will be string
}

export interface RoleName {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

// Define a type for the login response data
export type TLoginResponse = {
  role: string;
  email: string;
};

// Define a type for the full login API response
export type TLoginApiResponse = TResponseWithRedux<TLoginResponse> & {
  token: string;
};

// Define a generic error type for RTK Query
type TError = {
  data: {
    message: string;
    statusCode: number;
    success: boolean;
  };
  status: number;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TLoginApiResponse, Record<string, unknown>>({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Portal", "Sell", "statistic"], // Keep relevant tags
      transformErrorResponse: (res: TError & BaseQueryApi) => {
        return res;
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
