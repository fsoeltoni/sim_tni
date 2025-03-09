const apiUrl = "https://ocqghycfqgrvlgqjoort.supabase.co/rest/v1";
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcWdoeWNmcWdydmxncWpvb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjkwNzEsImV4cCI6MjA1NzEwNTA3MX0.p3DWXSu6vWL1ey0CeKBhWaeD0iu54Fk6iEHohPNWCRU";

const headers = {
  "Content-Type": "application/json",
  apikey: apiKey,
  Authorization: `Bearer ${apiKey}`,
};

const dataProvider = {
  // ✅ GET LIST (Ambil semua data)
  getList: async (resource, params) => {
    try {
      console.log("Params:", params); // Debugging

      const query = new URLSearchParams();

      // Tambahkan pagination
      if (params.pagination) {
        const { page, perPage } = params.pagination;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;
        query.append("offset", from);
        query.append("limit", perPage);
      }

      // Pastikan filter tidak memasukkan `undefined`
      if (params.filter) {
        Object.keys(params.filter).forEach((key) => {
          if (params.filter[key] !== undefined) {
            query.append(key, `eq.${params.filter[key]}`);
          }
        });
      }

      const url = `${apiUrl}/${resource}?${query.toString()}`;
      console.log("Final URL:", url); // Debugging

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data Fetched:", data); // Debugging

      return { data, total: data.length };
    } catch (error) {
      console.error("🔥 Fetch Error:", error);
      throw new Error("Error fetching data");
    }
  },

  // ✅ GET ONE (Ambil data berdasarkan ID)
  getOne: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}?id=eq.${params.id}`, {
      headers,
    });

    if (!response.ok) throw new Error("Error fetching data");

    const data = await response.json();
    return { data: data[0] };
  },

  // ✅ CREATE (Tambah data baru)
  create: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}`, {
      method: "POST",
      headers,
      body: JSON.stringify(params.data),
    });

    if (!response.ok) throw new Error("Error creating data");

    const data = await response.json();
    return { data: { ...params.data, id: data[0].id } };
  },

  // ✅ UPDATE (Edit data)
  update: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}?id=eq.${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(params.data),
    });

    if (!response.ok) throw new Error("Error updating data");

    return { data: params.data };
  },

  // ✅ DELETE (Hapus data)
  delete: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}?id=eq.${params.id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error("Error deleting data");

    return { data: { id: params.id } };
  },

  // ✅ DELETE MANY (Hapus banyak data)
  deleteMany: async (resource, params) => {
    const ids = params.ids.map((id) => `id=eq.${id}`).join("&");
    const response = await fetch(`${apiUrl}/${resource}?${ids}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error("Error deleting data");

    return { data: params.ids };
  },

  // ✅ GET MANY (Ambil banyak data berdasarkan ID)
  getMany: async (resource, params) => {
    const ids = params.ids.map((id) => `id=eq.${id}`).join("&");
    const response = await fetch(`${apiUrl}/${resource}?${ids}`, {
      headers,
    });

    if (!response.ok) throw new Error("Error fetching data");

    const data = await response.json();
    return { data };
  },
};

export default dataProvider;
