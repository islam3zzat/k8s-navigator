import { JobsList } from "../../components";
import { ResourceListPage } from "../../layout";
import Job from "../../icons/resources/unlabeled/job.svg";
import { useAppContext } from "../../app-context";

export const JobsListPage = () => {
  const { state } = useAppContext();
  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Jobs"
      routeOptions={{
        label: "Jobs",
        path: "/jobs",
        iconName: "Job",
        icon: Job,
      }}
    >
      <JobsList namespace={namespace} />
    </ResourceListPage>
  );
};
