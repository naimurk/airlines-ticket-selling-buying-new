import { baseApi } from "@/redux/api/baseApi";
import type { TSTicket } from "@/types";
import type { TQueryParams, TResponseWithRedux } from "@/types/global-types";

export const sellApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSellingTicket: builder.mutation({
      query: (data) => ({
        url: "/sell",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sell", "statistic"],
    }),

    getAllSellingTickets: builder.query({
      query: (arg) => {
        const params = new URLSearchParams();
        arg?.forEach((element: TQueryParams) => {
          if (element.value) {
            params.append(element.name, element.value as string);
          }
        });
        return {
          url: "/sell",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (res: TResponseWithRedux<TSTicket[]>) => {
        return { data: res.data, meta: res.meta };
      },
      providesTags: ["Sell"],
    }),

    getSellingTicketById: builder.query<TResponseWithRedux<TSTicket>, string>({
      query: (id) => ({
        url: `/sell/${id}`,
        method: "GET",
      }),
      providesTags: ["Sell"],
    }),

    updateSellingTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sell/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sell", "statistic"],
    }),

    sellingTicketDelete: builder.mutation<TResponseWithRedux<null>, string>({
      query: (id) => ({
        url: `/sell/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sell", "statistic"],
    }),
  }),
});

export const {
  useCreateSellingTicketMutation,
  useGetAllSellingTicketsQuery,
  useGetSellingTicketByIdQuery,
  useUpdateSellingTicketMutation,
  useSellingTicketDeleteMutation,
} = sellApi;
