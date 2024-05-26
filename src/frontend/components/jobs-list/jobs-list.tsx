import React, { useCallback } from "react";
import { V1Job, V1JobList } from "@kubernetes/client-node";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { ResourceTable } from "../resource-table";

type Props = {
  namespace: string;
  selector?: Record<string, string>;
};
export const JobsList = ({ namespace, selector }: Props) => {
  const dataFetcher = useCallback(async () => {
    if (!namespace) return [];

    if (selector) {
      const job = await window.k8sNavigator.queryJobsBySelector(
        namespace,
        selector,
      );

      return job.items;
    }

    const job: V1JobList = await window.k8sNavigator.listJobs(namespace);

    return job.items;
  }, [selector, namespace]);

  const navigate = useNavigate();

  return (
    <ResourceTable
      id={`jobs-list-${JSON.stringify(selector)}-`}
      title="Jobs list"
      dataFetcher={dataFetcher}
      noResourcesMessage="No jobs found matching criteria"
      getId={(sa) => sa.metadata.uid}
      columns={columns}
      onRowClick={(sa: V1Job) => {
        navigate(`/jobs/${sa.metadata.name}`);
      }}
    />
  );
};
