import { useCallback } from "react";
import { V1CronJob } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
};
export const CronJobsList = ({ namespace }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    const job = await window.k8sNavigator.listCronJobs(namespace);

    return job.items;
  }, [namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`cron-jobs-list`}
      title="Cron Jobs list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No cron jobs found matching criteria"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(cj: V1CronJob) => {
        navigate(`/cron-jobs/${cj.metadata.name}`);
      }}
    />
  );
};
