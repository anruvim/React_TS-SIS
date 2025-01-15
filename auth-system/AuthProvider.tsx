import { createContext, useEffect, useState } from "react";
import { IAuth } from "../libs/interfaces";
import AuthWrapper from "./AuthWrapper";

interface IAuthContext {
  auth?: IAuth;
  inSession: boolean;
  setAuth: (values: IAuth) => void;
  setInSession: (values: boolean) => void;
}
const AuthContext = createContext<IAuthContext>({
  auth: {
    accessToken: undefined,
  },
  inSession: true,
  setAuth: () => {},
  setInSession: () => {},
});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [auth, setAuth] = useState<IAuth | undefined>();
  const [inSession, setInSession] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        auth: auth,
        setAuth: setAuth,
        inSession: inSession,
        setInSession: setInSession,
      }}
    >
      <AuthWrapper>{children}</AuthWrapper>
    </AuthContext.Provider>
  );
};

export default AuthContext;
