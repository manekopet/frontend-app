import { FC } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import App from "./App";
import SolanaAdapterProvider from "./components/SolanaAdapterProvider";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import { persistor, store } from "./redux";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import MaterialProvider from "./theme";

// const sentryDsn = ENVS.REACT_APP_SENTRY_DSN;
// const sentryEnvironment = ENVS.REACT_APP_SENTRY_ENVIRONMENT;

// Sentry.init({
//   dsn: sentryDsn,
//   environment: sentryEnvironment || "localhost",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /manekopet\.xyz/],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const fallbackRender: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  setTimeout(() => {
    resetErrorBoundary();
  }, 5000);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
};

root.render(
  // <React.StrictMode>
  <MaterialProvider>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Provider store={store}>
        <SolanaAdapterProvider>
          <AuthProvider>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </AuthProvider>
        </SolanaAdapterProvider>
      </Provider>
    </ErrorBoundary>
  </MaterialProvider>
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
