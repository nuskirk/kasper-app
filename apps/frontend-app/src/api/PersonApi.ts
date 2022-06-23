import axios from "axios";
import { environment } from "../environments/environment";

const PersonAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(environment.apiEndpoint + '/persons');
      const { data } = response;

      if (data.status === 'success') {
        return data.persons;
      }
      return;
    } catch (error) {
      console.error(error);
    }
  },

  add: async (payload: { name: string, pre_position: number | null  }) => {
    try {
      const response = await axios.post(environment.apiEndpoint + '/persons', payload);
      const { data } = response;

      if (data.status === 'success') {
        return data.person;
      }
      return;
    } catch (error) {
      console.error(error);
    }
  },

  update: async (id: number, payload: { name?: string, pre_position?: number | null }) => {
    try {
      const response = await axios.put(environment.apiEndpoint + `/persons/${id}`, payload);
      const { data } = response;

      if (data.status === 'success') {
        return data.person;
      }
      return;
    } catch (error) {
      console.error(error);
    }
  },

  delete: async (id: Number) => {
    try {
      const response = await axios.delete(environment.apiEndpoint + `/persons/${id}`);
      const { data } = response;

      if (data.status === 'success') {
        return data.isDeleted;
      }
      return;
    } catch (error) {
      console.error(error);
    }
  },
}

export default PersonAPI;
