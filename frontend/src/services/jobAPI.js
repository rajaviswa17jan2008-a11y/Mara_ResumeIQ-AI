import api from "./api";

export const fetchJobs =
  async (query) => {

    try {

      const response =
        await api.get(

          `/jobs/recommendations?query=${query}`

        );

      return response.data.jobs || [];

    } catch (err) {

      console.log(err);

      return [];

    }

};