import { Helmet } from "react-helmet-async";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import moment from "moment";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useTheme from "@mui/material/styles/useTheme";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useQuery, useQueryClient } from "react-query";
import { getResourceFetcher, ResourceFetcherKey } from "../../shared";
import { useAppContext } from "../../app-context";
import {
  EventsList,
  LabelsTab,
  RefetchDataButton,
  ResourceIcon,
  WatchCheckbox,
} from "../../components";
import { useDownloadResource } from "../../hooks/use-dowload-resource";

const refreshIconVariants = {
  initial: { rotate: 0 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
  refreshing: {
    // Continuous rotation when refreshing
    rotate: 360,
    transition: { duration: 1, ease: "linear", repeat: Infinity },
  },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index?: number;
  name: string;
  value?: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, name, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number, tab: string) {
  return {
    id: `${tab}-tab-${index}`,
    "aria-controls": `${tab}-tabpanel-${index}`,
  };
}
export type TabComponentProps<T> = {
  resource: T;
  name: string;
  refetch: () => void;
};

type TabConfig<T> = {
  label: string;
  slot: React.FC<TabComponentProps<T>>;
};

type Props<T> = {
  name: string;
  resourceKind: ResourceFetcherKey;
  tabs: TabConfig<T>[];
  hideLabelsTab?: boolean;
  hideEventsTab?: boolean;
  routeOptions: {
    path: string;
    label: string;
    iconName: string;
    icon: unknown;
  };
};
const labelsTab = {
  label: "Labels",
  slot: LabelsTab,
};
const eventsTab = {
  label: "Events",
  slot: EventsList,
};

export const ResourceDetailsPage = <T,>({
  name,
  resourceKind,
  tabs,
  routeOptions,
  hideEventsTab,
  hideLabelsTab,
}: Props<T>) => {
  const { state, dispatch } = useAppContext();
  const defaultTabs = [];
  if (!hideEventsTab) {
    defaultTabs.push(eventsTab);
  }
  if (!hideLabelsTab) {
    defaultTabs.push(labelsTab);
  }

  const queryKey = useMemo(
    () => [
      "resource",
      { namespace: state.activeNamespace, name, resourceKind },
    ],
    [resourceKind, name, state.activeNamespace],
  );

  const [isWatching, setIsWatching] = useState(false);

  const handleWatchToggle = useCallback(() => {
    setIsWatching((prevValue) => !prevValue);
  }, []);

  const {
    data: resource,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useQuery<T>({
    queryKey,
    staleTime: Infinity,
    queryFn: () =>
      getResourceFetcher<T>(resourceKind)(state.activeNamespace, name),
    enabled: !!state.activeNamespace && !!name,
    refetchInterval: isWatching ? 1_000 * state.watchIntervalsSeconds : false,
  });
  const queryClient = useQueryClient();
  const refetch = useCallback(() => {
    queryClient.invalidateQueries(queryKey);
  }, [queryClient, queryKey]);
  const downloadYaml = useDownloadResource(name, resource);

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
    state.breadCrumbs,
    dispatch,
    routeOptions.path,
    routeOptions.label,
    routeOptions.iconName,
  ]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const tabsToUse: TabConfig<T>[] = [...tabs, ...defaultTabs];

  return (
    <>
      <Helmet>
        <title>
          {routeOptions.label} - {name}
        </title>
      </Helmet>
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <ResourceIcon isPrimary icon={routeOptions.icon} size={6} />
          <Typography variant="h4">{name}</Typography>
          <Button
            disabled={isLoading}
            startIcon={<FileDownloadIcon />}
            onClick={downloadYaml}
          >
            Download
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <RefetchDataButton
            isLoading={isLoading || isFetching}
            refetch={refetch}
          />
          <Typography>
            Last fetched {moment(dataUpdatedAt).format("h:mm:ss a")}
          </Typography>
          <WatchCheckbox
            isWatching={isWatching}
            onWatchToggle={handleWatchToggle}
          />
        </Stack>

        {!isLoading && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label={`tab ${name}`}
              >
                {tabsToUse.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    {...a11yProps(index, name)}
                  />
                ))}
              </Tabs>
            </Box>
            {tabsToUse.map((tab, index) => {
              const TabComponent = tab.slot;
              return (
                <TabPanel
                  key={`${index}-${tab.label}`}
                  value={value}
                  index={index}
                  name={name}
                >
                  <TabComponent
                    refetch={refetch}
                    name={name}
                    resource={resource}
                  />
                </TabPanel>
              );
            })}
          </>
        )}
      </Stack>
    </>
  );
};

ResourceDetailsPage.Tab = TabPanel;
