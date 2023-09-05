export default function authHeader() {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user && user.accessToken) {
    return { authorization: `Bearer ${user.accessToken}` }; // for Spring Boot back-end
  }
  return {};
}
