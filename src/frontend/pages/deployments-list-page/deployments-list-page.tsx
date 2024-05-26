import { DeploymentsList } from "../../components";
import Deployment from "../../icons/resources/unlabeled/deploy.svg";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

export const DeploymentsListPage = () => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Deployments"
      routeOptions={{
        label: "Deployments",
        path: "/deployments",
        iconName: "Deployment",
        icon: Deployment,
      }}
    >
      <DeploymentsList namespace={namespace} />
    </ResourceListPage>
  );
};
