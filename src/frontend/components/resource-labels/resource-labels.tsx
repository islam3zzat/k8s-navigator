import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { columns } from "./columns";
import { DataTable } from "../data-table";

type Props = {
  title: string;
  values: {
    [name: string]: string;
  };
};

export const ResourceLabels = ({ title, values }: Props) => {
  const data = Object.entries(values).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <Stack spacing={1}>
      <Typography variant="h5">{title}</Typography>

      <DataTable
        title={title}
        noResourcesMessage={`No ${title}!`}
        columns={columns}
        data={data}
        getId={(v) => v.name}
      />
    </Stack>
  );
};
