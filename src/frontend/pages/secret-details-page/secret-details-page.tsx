import { useParams } from "react-router-dom";
import SecretGeneralTab from "./secret-general-tab";
import Secret from "../../icons/resources/unlabeled/secret.svg";
import { ResourceDetailsPage } from "../../layout/resource-details-page";

const SecretDetailsPage = () => {
  const { secretName } = useParams<{ secretName: string }>();

  return (
    <ResourceDetailsPage
      name={secretName}
      resourceKind="secret"
      tabs={[
        {
          label: "General",
          slot: SecretGeneralTab,
        },
      ]}
      routeOptions={{
        path: "/secrets/" + secretName,
        label: "Secret Details",
        iconName: "Secret",
        icon: Secret,
      }}
    />
  );
};

export default SecretDetailsPage;
