import { baseApi } from "@/redux/api/baseApi";

import type { TQueryParams, TResponseWithRedux } from "@/types/global-types";
import type { TPortal } from "@/types/portal.types";

export const portalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPortal: builder.mutation({
      query: (data) => {
        return {
          url: "/portal",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Portal"],
    }),
    getAllPortals: builder.query({
      query: (arg) => {
        const params = new URLSearchParams();
        arg?.forEach((element: TQueryParams) => {
          if (element.value) {
            params.append(element.name, element.value as string);
          }
        });
        return {
          url: "/portal",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (res: TResponseWithRedux<TPortal[]>) => {
        return { data: res.data, meta: res.meta };
      },
      providesTags: ["Portal"],
    }),

    getPortalById: builder.query<TResponseWithRedux<TPortal>, string>({
      query: (id) => ({
        url: `/portal/${id}`,
        method: "GET",
      }),
      providesTags: ["Portal"],
    }),

    updatePortal: builder.mutation({
      query: ({ id, data }) => ({
        url: `/portal/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Portal"],
    }),

    deletePortal: builder.mutation<TResponseWithRedux<null>, string>({
      query: (id) => ({
        url: `/portal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Portal"],
    }),
  }),
});

export const {
  useGetAllPortalsQuery,
  useGetPortalByIdQuery,
  useUpdatePortalMutation,
  useDeletePortalMutation,
  useCreatePortalMutation,
} = portalApi;
