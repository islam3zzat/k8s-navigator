import { DeploymentsList } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

const DeploymentsListPage = () => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <ResourceListPage
      title="Deployments"
      routeOptions={{
        label: "Deployments",
        path: "/deployments",
        iconName: "Deployment",
      }}
    >
      <DeploymentsList namespace={namespace} />
    </ResourceListPage>
  );
};
export default DeploymentsListPage;
