import axios from "axios";
import { HOST } from "@/utils/constants";

// Creating an Axios instance with a base URL
export const apiClient = axios.create({
    baseURL: HOST,
})