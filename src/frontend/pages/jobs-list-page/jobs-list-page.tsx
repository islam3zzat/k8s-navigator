import { JobsList } from "../../components";
import { ResourceListPage } from "../../layout";
import { useAppContext } from "../../app-context";

const JobsListPage = () => {
  const { state } = useAppContext();
  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Jobs"
      routeOptions={{
        label: "Jobs",
        path: "/jobs",
        iconName: "Job",
      }}
    >
      <JobsList namespace={namespace} />
    </ResourceListPage>
  );
};
export default JobsListPage;
