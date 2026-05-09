const isServerSide = typeof window === "undefined" || typeof document === "undefined";

export const basicHeaders = {
  "X-Error-Handle-Method": isServerSide ? "reject" : "toast",
};
