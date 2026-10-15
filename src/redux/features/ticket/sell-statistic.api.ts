import { baseApi } from "@/redux/api/baseApi";
import type { TResponseWithRedux } from "@/types/global-types";

export type TSellStatistics = {
  totalProfitAED: number;
  totalSelling: number;
  totalRevenue: number;
  totalDue: number;
};

export type TStatisticsQuery = {
  fromDate?: string;
  toDate?: string;
};

export const sellStatisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellStatistics: builder.query<
      TResponseWithRedux<TSellStatistics>,
      TStatisticsQuery
    >({
      query: ({ fromDate, toDate }) => {
        const params = new URLSearchParams();

        if (fromDate) {
          params.append("fromDate", fromDate);
        }

        if (toDate) {
          params.append("toDate", toDate);
        }

        return {
          url: `/sell/sell-statistics`,
          method: "GET",
          params,
        };
      },

      providesTags: ["statistic"],
    }),
  }),
});

export const { useGetSellStatisticsQuery } = sellStatisticsApi;
