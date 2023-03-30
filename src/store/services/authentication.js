export const retrieveAccessToken = () => async () => {
  const authUrl = import.meta.env.VITE_AUTH_URL;

  const response = await fetch(authUrl);
  const { access_token } = await response.json();
  return access_token;
};
