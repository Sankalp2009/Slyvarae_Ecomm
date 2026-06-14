export function authHeaders(accessToken) {
  if (!accessToken) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function isAdminRole(role) {
  return role === "admin" || role === "Admin";
}
