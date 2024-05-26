import { useParams } from "react-router-dom";
import DeploymentGeneralTab from "./deployment-general-tab";
import EnvironmentVariablesTab from "./environment-variables-tab";
import Deployment from "../../icons/resources/unlabeled/deploy.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const DeploymentDetailsPage = () => {
  const { deploymentName } = useParams<{ deploymentName: string }>();

  return (
    <ResourceDetailsPage
      name={deploymentName}
      resourceKind="deployment"
      tabs={[
        {
          label: "General",
          slot: DeploymentGeneralTab,
        },
        {
          label: "Environment Variables",
          slot: EnvironmentVariablesTab,
        },
      ]}
      routeOptions={{
        path: "/deployments/" + deploymentName,
        label: "Deployment Details",
        iconName: "Deployment",
        icon: Deployment,
      }}
    />
  );
};
export default DeploymentDetailsPage;
