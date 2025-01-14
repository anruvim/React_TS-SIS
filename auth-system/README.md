## Token-Based Authentication System

### Overview
This feature implements a robust token-based authentication system using refresh and access tokens to enhance security and protect against CSRF (Cross-Site Request Forgery) attacks. The system ensures that API requests can only be made from within the website, providing an additional layer of security.

### Key Components

1. **Login and Refresh Token**:
   - When a user logs in through Google Auth, a refresh token is generated and saved in cookies.
   - The refresh token is used to obtain new access tokens without requiring the user to log in again.

2. **Access Token**:
   - The access token is a short-lived token used for authorization in API requests.
   - It is stored in the system memory instead of cookies to prevent CSRF attacks.

3. **Token Refresh**:
   - The `/session/refresh` endpoint uses the refresh token to generate a new encrypted access token.
   - This token is then decrypted and stored in memory, ensuring that API requests can only be made from within the website.

4. **Security**:
   - By using the refresh token stored in cookies and the access token stored in memory, the system ensures that even if the refresh token is compromised, it cannot be used directly to access APIs.
   - The access token must be obtained and decrypted within the website, adding an extra layer of security.

### Implementation Details

- **useToken Hook**:
  - Handles token refresh and updates the authentication state.
  - Decrypts the encrypted access token and stores it in memory.

- **useAxiosPrivate Hook**:
  - Sets up Axios interceptors for handling authorization and token refresh.
  - Adds an Authorization header with the current access token if it's not already present.
  - Handles 403 Forbidden errors by attempting to refresh the access token and retrying the failed request.

- **useStudentsList Hook**:
  - Fetches and manages a list of students with pagination and filtering.
  - Uses the `useAxiosPrivate` hook for making authorized API requests.

- **AuthProvider**:
  - Provides authentication context to the application.
  - Manages the authentication state and session status.

### Usage Example

This feature ensures that the application remains secure by using a combination of refresh and access tokens, preventing unauthorized access and CSRF attacks.
