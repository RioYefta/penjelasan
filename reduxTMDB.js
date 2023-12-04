// Mengimpor fungsi yang diperlukan dari Redux Toolkit Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Membuat instance tmdbApi dengan konfigurasi tertentu
export const tmdbApi = createApi({
  // Menentukan nama slice untuk penyimpanan data di Redux
  reducerPath: "tmdbApi",

  // Konfigurasi untuk fetchBaseQuery, termasuk baseUrl dan headers
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3",
    prepareHeaders: (headers) => {
      // Mengambil token API dari variabel lingkungan
      const token = import.meta.env.VITE_REACT_API_TOKEN;

      // Jika token tersedia, menambahkannya ke header untuk otentikasi
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  // Mendefinisikan endpoint-endpoint untuk berbagai query API
  endpoints: (builder) => ({
    // Contoh endpoint untuk mendapatkan film
    getMovie: builder.query({
      query: () => `/discover/movie`,
    }),

    // Menambahkan endpoint-endpoint lainnya seperti getTrendingMovie, getTrendingTv, dan sebagainya
    // ...

    // Sebagai contoh, mendapatkan data genre untuk tipe media tertentu
    getGenresData: builder.query({
      query: (media_type) => `genre/${media_type}/list`,
    }),

    // Endpoint untuk pencarian data multi (film, acara TV, dll.)
    getSearchMulti: builder.query({
      query: (args) => {
        const { query, pageNum } = args;
        return {
          url: `/search/multi?query=${query}&page=${pageNum}`,
        };
      },
    }),
  }),
});

// Mengekspor hook-hook yang dihasilkan oleh tmdbApi
export const {
  // ... (Daftar lengkap hook-hook di bagian bawah file)
} = tmdbApi;
