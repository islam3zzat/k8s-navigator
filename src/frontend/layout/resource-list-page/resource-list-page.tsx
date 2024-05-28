import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ResourceIcon } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceName } from "../../components/resource-icon/icon-loader";

type Props = {
  children: React.ReactElement;
  title: string;
  routeOptions: {
    path: string;
    label: string;
    iconName: ResourceName;
    icon: unknown;
  };
};
export const ResourceListPage = ({ children, title, routeOptions }: Props) => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const path = routeOptions.path;
    const isInBreadCrumbs = state.breadCrumbs.some(
      (crumb) => crumb.path === path,
    );
    if (!isInBreadCrumbs) {
      dispatch({
        type: "SET_BREADCRUMB",
        breadCrumb: state.breadCrumbs.concat({
          label: routeOptions.label,
          path: path,
          iconName: routeOptions.iconName,
        }),
      });
    }
  }, [
    dispatch,
    routeOptions.iconName,
    routeOptions.label,
    routeOptions.path,
    state.breadCrumbs,
  ]);
  const namespace = state.activeNamespace;

  if (!namespace) return null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <ResourceIcon
            isPrimary
            resourceName={routeOptions.iconName}
            size={6}
            aria-label={routeOptions.label}
          />
          <Typography variant="h2">{title}</Typography>
        </Stack>
        {children}
      </Stack>
    </>
  );
};
