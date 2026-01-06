import { baseApi } from "@/redux/api/baseApi";
import type { TResponseWithRedux } from "@/types/global-types";

export type TSellStatistics = {
  totalProfitAED: number;
  totalSelling: number;
  totalRevenue: number;
  totalDue: number;
};

export const sellStatisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellStatistics: builder.query<
      TResponseWithRedux<TSellStatistics>,
      string
    >({
      query: (timeFilter) => {
        const params = new URLSearchParams();
        if (timeFilter && timeFilter !== "all") {
          params.append("timeFilter", timeFilter);
        }
        return {
          url: `/sell/sell-statistics`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["statistic"],
    }),
  }),
});

export const { useGetSellStatisticsQuery } = sellStatisticsApi;
