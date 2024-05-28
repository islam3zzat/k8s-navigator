import { CronJobsList } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

const CronJobsListPage = () => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Cron Jobs"
      routeOptions={{
        path: "/cron-jobs",
        label: "CronJobs",
        iconName: "CronJob",
      }}
    >
      <CronJobsList namespace={namespace} />
    </ResourceListPage>
  );
};
export default CronJobsListPage;
