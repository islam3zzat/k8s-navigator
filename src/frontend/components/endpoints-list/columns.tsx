import { V1Endpoints } from "@kubernetes/client-node";
import moment from "moment";
import { Stack, Typography } from "@mui/material";
import { Column } from "../data-table";

const getAddress = (endpoints: V1Endpoints) => {
  const addresses: string[] = [];
  if (endpoints.subsets) {
    endpoints.subsets.forEach((subset) => {
      if (subset.addresses) {
        subset.addresses.forEach((address) => {
          if (subset.ports) {
            subset.ports.forEach((port) => {
              addresses.push(`${address.ip}:${port.port}`);
            });
          }
        });
      }
    });
  }

  return addresses;
};
export const columns: Column<V1Endpoints>[] = [
  {
    name: "Name",
    getData: (ep: V1Endpoints) => ep.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Endpoints",
    getData(ep: V1Endpoints) {
      return (
        <Stack spacing={1}>
          {getAddress(ep).map((address) => (
            <Typography key={address}>{address}</Typography>
          ))}
        </Stack>
      );
    },
    getSearchableString(ep: V1Endpoints) {
      return getAddress(ep).join(", ");
    },
    compare(a, b) {
      return getAddress(a).join(", ").localeCompare(getAddress(b).join(", "));
    },
  },
  {
    name: "Age",
    getData: (ep: V1Endpoints) => {
      return moment(ep.metadata.creationTimestamp).fromNow();
    },
    compare(a, b) {
      return moment(a.metadata.creationTimestamp).diff(
        moment(b.metadata.creationTimestamp),
      );
    },
  },
];
