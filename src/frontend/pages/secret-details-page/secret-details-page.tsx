import { useParams } from "react-router-dom";
import SecretGeneralTab from "./secret-general-tab";
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
      }}
    />
  );
};

export default SecretDetailsPage;
