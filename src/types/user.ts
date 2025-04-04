export interface User {
  id: string;
  name: string;
  role: "individual" | "enterprise" | "partner";
}
