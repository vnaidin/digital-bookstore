export default function authHeader() {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user && user.accessToken) {
    return { authorization: `Bearer ${user.accessToken}` };
  }
  return {};
}
