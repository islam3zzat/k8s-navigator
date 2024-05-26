import { SecretsList } from "../../components";
import Secret from "../../icons/resources/unlabeled/secret.svg";
import { useAppContext } from "../../app-context";
import { ResourceListPage } from "../../layout";

export const SecretsListPage = () => {
  const { state } = useAppContext();

  return (
    <ResourceListPage
      title="Secrets"
      routeOptions={{
        label: "Secrets",
        path: "/secrets",
        iconName: "Secret",
        icon: Secret,
      }}
    >
      <SecretsList namespace={state.activeNamespace} />
    </ResourceListPage>
  );
};
