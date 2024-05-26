import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import {
  App,
  ConfigMapDetailsPage,
  ConfigMapsListPage,
  CronJobDetailsPage,
  CronJobsListPage,
  DeploymentDetailsPage,
  DeploymentsListPage,
  HomePage,
  JobDetailsPage,
  JobsListPage,
  PodDetailsPage,
  PodLogsPage,
  PodsListPage,
  ReplicaSetDetailsPage,
  ReplicaSetsListPage,
  SecretDetailsPage,
  SecretsListPage,
  ServiceAccountDetailsPage,
  ServiceAccountsListPage,
  ServiceDetailsPage,
  ServicesListPage,
} from "./pages";
import { AppProvider } from "./app-context";
import { AppTheme } from "./theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/700.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppTheme>
            <CssBaseline />
            <HashRouter>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/deployments"
                    element={<DeploymentsListPage />}
                  />
                  <Route
                    path="/deployments/:deploymentName"
                    element={<DeploymentDetailsPage />}
                  />
                  <Route
                    path="/replica-sets"
                    element={<ReplicaSetsListPage />}
                  />
                  <Route
                    path="/replica-sets/:replicaSetName"
                    element={<ReplicaSetDetailsPage />}
                  />
                  <Route path="/pods" element={<PodsListPage />} />
                  <Route path="/pods/:podName" element={<PodDetailsPage />} />
                  <Route
                    path="/pods/:podName/logs/:containerName"
                    element={<PodLogsPage />}
                  />
                  <Route
                    path="/service-accounts"
                    element={<ServiceAccountsListPage />}
                  />
                  <Route
                    path="/service-accounts/:serviceAccountName"
                    element={<ServiceAccountDetailsPage />}
                  />
                  <Route path="/config-maps" element={<ConfigMapsListPage />} />
                  <Route
                    path="/config-maps/:configMapName"
                    element={<ConfigMapDetailsPage />}
                  />
                  <Route path="/secrets" element={<SecretsListPage />} />
                  <Route
                    path="/secrets/:secretName"
                    element={<SecretDetailsPage />}
                  />
                  <Route path="/services" element={<ServicesListPage />} />
                  <Route
                    path="/services/:serviceName"
                    element={<ServiceDetailsPage />}
                  />
                  <Route path="/jobs" element={<JobsListPage />} />
                  <Route path="/jobs/:jobName" element={<JobDetailsPage />} />
                  <Route path="/cron-jobs" element={<CronJobsListPage />} />
                  <Route
                    path="/cron-jobs/:cronJobName"
                    element={<CronJobDetailsPage />}
                  />
                </Route>
              </Routes>
            </HashRouter>
          </AppTheme>
        </AppProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
