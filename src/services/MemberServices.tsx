import apiClient from "./Apiclient";


export const getMembers = async () => (await apiClient.get("/members")).data;
