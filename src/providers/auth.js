import data from "./data";

const fetchPengguna = async (nrp_nip, kata_sandi) => {
  const { data: pengguna } = await data.getList("pengguna", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: {
      nrp_nip: nrp_nip,
      kata_sandi: kata_sandi
    }
  });

  return pengguna[0];
};

export default {
  login: async ({ username, password }) => {
    const nrp_nip = username;
    const kata_sandi = password;

    const pengguna = await fetchPengguna(nrp_nip, kata_sandi);

    if (pengguna) {
      localStorage.setItem("token", JSON.stringify(pengguna));
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },
  checkError: error => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = localStorage.getItem("token");

    return role ? Promise.resolve(JSON.parse(role)) : Promise.reject();
  }
};
