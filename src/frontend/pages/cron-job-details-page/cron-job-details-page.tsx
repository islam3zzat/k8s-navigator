import { useParams } from "react-router-dom";
import CronJobGeneralTab from "./cron-job-general-tab";
import CronJob from "../../icons/resources/unlabeled/cronjob.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const CronJobDetailsPage = () => {
  const { cronJobName } = useParams<{ cronJobName: string }>();

  return (
    <ResourceDetailsPage
      name={cronJobName}
      resourceKind="cronJob"
      tabs={[
        {
          label: "General",
          slot: CronJobGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/cron-jobs/" + cronJobName,
        label: "CronJob Details",
        iconName: "CronJob",
        icon: CronJob,
      }}
    />
  );
};

export default CronJobDetailsPage;
