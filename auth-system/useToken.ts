/**
 * Custom hook to handle token refresh and authentication state.
 *
 * @returns A function that refreshes the token and updates the authentication state.
 */
const useToken = () => {
  const { setAuth, setInSession } = useAuth();
  const refresh = async () => {
    try {      
      const response = await axios.get("/session/refresh", {
        withCredentials: true,
      });
      setInSession(true);
      setAuth((prev: any) => {
        return { ...prev, accessToken: decodeToken(response.data.enc_token) };
      });
      return decodeToken(response.data.enc_token);
    } catch {
      setInSession(false);
      setAuth((prev: any) => {
        return { ...prev, accessToken: undefined };
      });
      return undefined;
    }
  };

  return refresh;
};

export default useToken;
