import Cookies from "js-cookie";

export const getCookie = (name: string): string => {
  return Cookies.get(name) || "";
};

export const setCookie = (key: string, value: string, options?: any) => {
  Cookies.set(key, value, options);
};

export const deleteCookie = (key: string) => {
  Cookies.remove(key, { path: "/" });
};
