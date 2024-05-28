import { SecretsList } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

const SecretsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Secrets"
      routeOptions={{
        label: "Secrets",
        path: "/secrets",
        iconName: "Secret",
      }}
    >
      <SecretsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};

export default SecretsListPage;
