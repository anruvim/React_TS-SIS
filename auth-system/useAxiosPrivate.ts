/**
 * Custom hook that sets up Axios interceptors for handling authorization and token refresh.
 * 
 * This hook configures request and response interceptors for an Axios instance (`axiosPrivate`).
 * The request interceptor adds an Authorization header with the current access token if it's not already present.
 * The response interceptor handles 403 Forbidden errors by attempting to refresh the access token and retrying the failed request.
 * 
 * @returns {AxiosInstance} The Axios instance with the configured interceptors.
 * 
 * @example
 * ```typescript
 * const axiosPrivate = useAxiosPrivate();
 * 
 * axiosPrivate.get('/some-endpoint')
 *   .then(response => {
 *     console.log(response.data);
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * ```
 */
function useAxiosPrivate() {
  const refresh = useToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (auth?.accessToken && !config.headers?.Authorization) {
          config.headers!.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;
