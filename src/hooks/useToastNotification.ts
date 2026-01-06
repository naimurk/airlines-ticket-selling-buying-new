import type { TError } from "@/types/global-types";
import { useEffect } from "react";
import { toast } from "sonner";

export type TNotificationOptions = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data?: { message?: string };
  error?: TError;
};

const useToastNotifications = ({
  isLoading,
  isSuccess,
  isError,
  data,
  error,
}: TNotificationOptions) => {
  useEffect(() => {
    toast.dismiss(1);
  }, []);

  useEffect(() => {
    if (isLoading || isSuccess || isError) {
      if (isLoading) {
        toast.loading("loading...", { id: 1 });
      }
      if (isSuccess) {
        toast.success(data?.message || "Success!", { id: 1 });
      }
      if (isError) {
        toast.error(error?.data?.message || "An error occurred", {
          id: 1,
          duration: 3000,
        });
      }
    }
  }, [isSuccess, isLoading, isError, data, error]);
};

export default useToastNotifications;
