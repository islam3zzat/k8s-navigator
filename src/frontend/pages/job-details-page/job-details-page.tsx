import { useParams } from "react-router-dom";
import { JobGeneralTab } from "./job-general-tab";
import Job from "../../icons/resources/unlabeled/job.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

export const JobDetailsPage = () => {
  const { jobName } = useParams<{ jobName: string }>();

  return (
    <ResourceDetailsPage
      name={jobName}
      resourceKind="job"
      tabs={[{ label: "General", slot: JobGeneralTab }]}
      routeOptions={{
        path: "/jobs/" + jobName,
        label: "Job Details",
        iconName: "Job",
        icon: Job,
      }}
    />
  );
};
