import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./app-context";
import { AppTheme } from "./theme";
import LoadingFallback from "./components/loading-fallback";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/700.css";

const App = lazy(() => import("./pages/app"));
// Lazy Load Pages
const ConfigMapDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "config-map-details-page" */
      "./pages/config-map-details-page"
    ),
);
const ConfigMapsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "config-maps-list-page" */
      "./pages/config-maps-list-page"
    ),
);
const CronJobDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "cron-job-details-page" */
      "./pages/cron-job-details-page"
    ),
);
const CronJobsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "cron-jobs-list-page" */
      "./pages/cron-jobs-list-page"
    ),
);
const DeploymentDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "deployment-details-page" */
      "./pages/deployment-details-page"
    ),
);
const DeploymentsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "deployment-list-page" */
      "./pages/deployments-list-page"
    ),
);
const HomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "home-page" */
      "./pages/home-page"
    ),
);
const JobDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "job-details-page" */
      "./pages/job-details-page"
    ),
);
const JobsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "jobs-list-page" */
      "./pages/jobs-list-page"
    ),
);
const PodDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "pod-details-page" */
      "./pages/pod-details-page"
    ),
);
const PodLogsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "pod-logs-page" */
      "./pages/pod-logs-page"
    ),
);
const PodsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "pods-list-page" */
      "./pages/pods-list-page"
    ),
);
const ReplicaSetDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "replica-set-details-page" */
      "./pages/replica-set-details-page"
    ),
);
const ReplicaSetsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "replica-set-list-page" */
      "./pages/replica-sets-list-page"
    ),
);
const SecretDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "secret-details-page" */
      "./pages/secret-details-page"
    ),
);
const SecretsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "secret-list-page" */
      "./pages/secrets-list-page"
    ),
);
const ServiceAccountDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "service-account-details-page" */
      "./pages/service-account-details-page"
    ),
);
const ServiceAccountsListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "service-account-list-page" */
      "./pages/service-accounts-list-page"
    ),
);
const ServiceDetailsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "service-details-page" */
      "./pages/service-details-page"
    ),
);
const ServicesListPage = lazy(
  () =>
    import(
      /* webpackChunkName: "service-list-details-page" */
      "./pages/services-list-page"
    ),
);
const SettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "settings" */
      "./pages/settings-page"
    ),
);

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
              <Suspense fallback={<LoadingFallback isFullPage />}>
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
