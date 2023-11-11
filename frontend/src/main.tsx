import "./tailwind.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { createHashRouter, RouterProvider } from "react-router-dom"

import { Dashboard } from "./routes/dashboard/dashboard"
import { dashboardLoader } from "./routes/dashboard/dashboard-data"
import { providersLoader } from "./routes/providers/providers-data"
import { awsIamIdcCardLoader } from "./routes/aws-iam-idc/aws-iam-idc-card-data"
import { Providers } from "./routes/providers/providers"
import { AwsIamIdcSetup } from "./routes/aws-iam-idc/aws-iam-idc-setup"
import { awsIamIdcSetupAction } from "./routes/aws-iam-idc/aws-iam-idc-setup-data"
import { Vault } from "./routes/vault/vault"
import { AuthProvider } from "./auth-provider/auth-provider"
import { ErrorPage } from "./error-page"
import { IsVaultConfigured } from "../wailsjs/go/main/AuthController"
import { WailsProvider } from "./wails-provider/wails-provider"
import { AwsIamIdcDeviceAuth } from "./routes/aws-iam-idc/aws-iam-idc-device-auth"
import { awsIamIdcDeviceAuthAction } from "./routes/aws-iam-idc/aws-iam-idc-device-auth-data"

if (import.meta.env.DEV) {
  document.documentElement.classList.add("debug-screens")
}

void (async function main() {
  const router = createHashRouter([
    {
      element: <Vault isVaultConfigured={await IsVaultConfigured()} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
          loader: dashboardLoader,
        },
        {
          path: "/providers",
          element: <Providers />,
          loader: providersLoader,
          children: [
            {
              path: "aws-iam-idc",
              children: [
                {
                  path: "setup",
                  element: <AwsIamIdcSetup />,
                  action: awsIamIdcSetupAction,
                },
                {
                  path: "device-auth",
                  element: <AwsIamIdcDeviceAuth />,
                  action: awsIamIdcDeviceAuthAction,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/internal/api/aws-iam-idc-card",
      loader: awsIamIdcCardLoader,
    },
  ])

  const sessionState = sessionStorage.getItem("auth_state")
  const initialState = sessionState
    ? JSON.parse(sessionState)
    : {
        isAuthenticated: false,
        username: "",
        failedAttempts: 0,
      }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AuthProvider initialAuthState={initialState}>
        <WailsProvider>
          <RouterProvider router={router} />
        </WailsProvider>
      </AuthProvider>
    </React.StrictMode>,
  )
})()
