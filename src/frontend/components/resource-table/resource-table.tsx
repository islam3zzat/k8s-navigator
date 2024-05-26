import React, { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Column, DataTable } from "../data-table";

type Props<T> = {
  columns: Column<T>[];
  dataFetcher: () => Promise<T[]>;
  noResourcesMessage?: string;
  getId: (row: T) => string;
  id: string;
  title: string;
  onRowClick?: (row: T) => void;
};

export const ResourceTable = <T,>({
  id,
  title,
  columns,
  dataFetcher,
  noResourcesMessage,
  getId,
  onRowClick,
}: Props<T>) => {
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const handleWatchToggle = useCallback(() => {
    setIsWatching((prevValue) => !prevValue);
  }, []);

  const queryClient = useQueryClient();
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries(id);
  }, [queryClient, id]);

  const query = useQuery({
    queryKey: id,
    queryFn: dataFetcher,
    staleTime: 1_000 * 60,
    refetchInterval: isWatching ? 1_000 * 2 : false,
  });

  return (
    <DataTable
      title={title}
      description={title}
      columns={columns}
      data={query.data}
      noResourcesMessage={noResourcesMessage}
      isWatching={isWatching}
      handleWatchToggle={handleWatchToggle}
      getId={getId}
      onRowClick={onRowClick}
      error={query.error}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      dataUpdatedAt={query.dataUpdatedAt}
      onRefresh={onRefresh}
    />
  );
};
