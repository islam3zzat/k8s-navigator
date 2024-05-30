import React, { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import { AppTheme } from "../frontend/theme";
import { AppProvider } from "../frontend/app-context";

const queryClient = new QueryClient();

interface TestWrapperProps {
  children: ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <AppTheme>
            <CssBaseline />
            <MemoryRouter>{children}</MemoryRouter>
          </AppTheme>
        </AppProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default TestWrapper;
