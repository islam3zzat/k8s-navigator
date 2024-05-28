import { useParams } from "react-router-dom";
import JobGeneralTab from "./job-general-tab";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const JobDetailsPage = () => {
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
      }}
    />
  );
};
export default JobDetailsPage;
