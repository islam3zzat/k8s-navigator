import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./app-context";
import { AppTheme } from "./theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/700.css";

const App = lazy(() => import("./pages/app"));
// Lazy Load Pages
const ConfigMapDetailsPage = lazy(
  () => import("./pages/config-map-details-page"),
);
const ConfigMapsListPage = lazy(() => import("./pages/config-maps-list-page"));
const CronJobDetailsPage = lazy(() => import("./pages/cron-job-details-page"));
const CronJobsListPage = lazy(() => import("./pages/cron-jobs-list-page"));
const DeploymentDetailsPage = lazy(
  () => import("./pages/deployment-details-page"),
);
const DeploymentsListPage = lazy(() => import("./pages/deployments-list-page"));
const HomePage = lazy(() => import("./pages/home-page")); // Assuming HomePage is also kebab case
const JobDetailsPage = lazy(() => import("./pages/job-details-page"));
const JobsListPage = lazy(() => import("./pages/jobs-list-page"));
const PodDetailsPage = lazy(() => import("./pages/pod-details-page"));
const PodLogsPage = lazy(() => import("./pages/pod-logs-page"));
const PodsListPage = lazy(() => import("./pages/pods-list-page"));
const ReplicaSetDetailsPage = lazy(
  () => import("./pages/replica-set-details-page"),
);
const ReplicaSetsListPage = lazy(
  () => import("./pages/replica-sets-list-page"),
);
const SecretDetailsPage = lazy(() => import("./pages/secret-details-page"));
const SecretsListPage = lazy(() => import("./pages/secrets-list-page"));
const ServiceAccountDetailsPage = lazy(
  () => import("./pages/service-account-details-page"),
);
const ServiceAccountsListPage = lazy(
  () => import("./pages/service-accounts-list-page"),
);
const ServiceDetailsPage = lazy(() => import("./pages/service-details-page"));
const ServicesListPage = lazy(() => import("./pages/services-list-page"));
const SettingsPage = lazy(() => import("./pages/settings-page"));

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
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<App />}>
                    <Route path="/settings" element={<SettingsPage />} />
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
                    <Route
                      path="/config-maps"
                      element={<ConfigMapsListPage />}
                    />
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
              </Suspense>
            </HashRouter>
          </AppTheme>
        </AppProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
