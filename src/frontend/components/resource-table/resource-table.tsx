import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Column, DataTable } from "../data-table";
import { useAppContext } from "../../app-context";

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
  const { state } = useAppContext();
  const queryId = `${id}-${state.activeNamespace}-${state.activeContext?.name}`;
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const handleWatchToggle = useCallback(() => {
    setIsWatching((prevValue) => !prevValue);
  }, []);

  const queryClient = useQueryClient();
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries(queryId);
  }, [queryClient, queryId]);

  const query = useQuery({
    queryKey: queryId,
    queryFn: dataFetcher,
    staleTime: 1_000 * 60,
    refetchInterval: isWatching ? 1_000 * state.watchIntervalsSeconds : false,
  });

  return (
    <DataTable
      title={title}
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
