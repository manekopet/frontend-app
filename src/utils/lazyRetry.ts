const hasRefreshed: boolean = JSON.parse(
  window.sessionStorage.getItem("retry-lazy-refreshed") || "false"
);

export const lazyRetry = function <T>(
  componentImport: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    // check if the window has already been refreshed
    const hasRefreshed: boolean = JSON.parse(
      window.sessionStorage.getItem("retry-lazy-refreshed") || "false"
    );

    // try to import the component
    componentImport()
      .then((component: T) => {
        window.sessionStorage.setItem("retry-lazy-refreshed", "false"); // success so reset the refresh
        resolve(component);
      })
      .catch((error: Error) => {
        if (!hasRefreshed) {
          // not been refreshed yet
          window.sessionStorage.setItem("retry-lazy-refreshed", "true"); // we are now going to refresh
          return window.location.reload(); // refresh the page
        }
        reject(error); // Default error behaviour as already tried refresh
      });
  });
};
