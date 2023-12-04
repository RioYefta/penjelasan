// Mengimpor hook useState, useEffect dari React
import { useState, useEffect } from "react";

// Mengimpor beberapa komponen dari berkas terpisah
import { Error, Loader, MovieCard, SEO } from "../../components";

// Mengimpor komponen ContentWrapper dari berkas terpisah
import ContentWrapper from "../../Hoc/SectionWrapper";

// Mengimpor dua fungsi query dari berkas terpisah yang disediakan oleh Redux Toolkit
import {
  useGetGenresDataQuery,
  useGetPopularMovieQuery,
} from "../../redux/TMDB";

// Mengimpor komponen InfiniteScroll dan Select dari berkas terpisah
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

// Definisi komponen utama bernama "Popular"
const Popular = () => {
  // Menggunakan hook useState untuk menyimpan nilai pageNum dan fungsi setPageNum
  const [pageNum, setPageNum] = useState(1); // State ini digunakan untuk menyimpan halaman saat ini yang sedang ditampilkan.

  // Menggunakan hook useState untuk menyimpan nilai allMovies dan fungsi setAllMovies
  const [allMovies, setAllMovies] = useState([]); // State ini digunakan untuk menyimpan semua film yang telah diambil dari API.

  // Menggunakan hook useState untuk menyimpan nilai genre dan fungsi setGenre
  const [genre, setGenre] = useState(null); // State ini digunakan untuk menyimpan genre film yang sedang dipilih.

  // Mendefinisikan konstanta media_type dengan nilai "movie"
  const media_type = "movie"; // Variabel ini digunakan sebagai parameter untuk mengambil data genre.

  // Menggunakan hook useGetPopularMovieQuery untuk mendapatkan data film populer
  const { data: movies, isFetching, error } = useGetPopularMovieQuery(pageNum); // Hasil dari query disimpan dalam variabel movies, sedangkan isFetching menunjukkan apakah query sedang berlangsung, dan error berisi pesan error jika terjadi.

  // Menggunakan hook useGetGenresDataQuery untuk mendapatkan data genre
  const { data: genresData } = useGetGenresDataQuery(media_type); // Hasil dari query disimpan dalam variabel genresData.

  // useEffect digunakan untuk melakukan efek samping setelah render komponen. Dalam hal ini, efek sampingnya adalah memperbarui state allMovies ketika nilai movies berubah.
  useEffect(() => {
    if (movies?.results) {
      // Memeriksa apakah ada hasil (results) dari data yang diterima dari query useGetPopularMovieQuery. Ini dilakukan untuk menghindari kesalahan (undefined) jika data belum diterima.
      setAllMovies((prevMovies) => [...prevMovies, ...movies.results]);
    } // Memperbarui state allMovies dengan menggabungkan hasil sebelumnya dengan hasil baru.
  }, [movies]);

  // Fungsi yang bertujuan untuk memuat halaman berikutnya dari film populer. Saat dipanggil, fungsi ini menggunakan setPageNum untuk meningkatkan nilai pageNum (halaman saat ini) dengan 1, sehingga memicu pengambilan data film untuk halaman selanjutnya saat komponen dire-render.
  const fetchNextPage = () => {
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  // Mendefinisikan fungsi onChange, yang digunakan untuk menangani perubahan dalam pemilihan genre film
  const onChange = (selectedOptions) => {
    setGenre(selectedOptions);

    //  Memperbarui state genre dengan nilai dari selectedOptions. selectedOptions adalah array objek yang mewakili genre yang dipilih oleh pengguna.
    const selectedGenreIds = selectedOptions.map((option) => option.id); // Membuat array selectedGenreIds yang berisi ID genre dari opsi yang dipilih oleh pengguna.

    // Memfilter film berdasarkan genre yang dipilih
    if (selectedGenreIds.length === 0) {
      // Jika tidak ada genre yang dipilih (selectedGenreIds.length === 0), maka semua film ditampilkan (setAllMovies(movies?.results)).
      setAllMovies(movies?.results);
    } else {
      // Jika ada genre yang dipilih, maka film-film akan difilter berdasarkan genre yang dipilih. filteredMovies akan berisi film-film yang memiliki setidaknya satu ID genre yang cocok dengan genre yang dipilih oleh pengguna.
      const filteredMovies = movies?.results.filter((movie) =>
        movie.genre_ids.some((genreId) => selectedGenreIds.includes(genreId))
      );
      setAllMovies(filteredMovies);
    }
  };

  // useEffect digunakan untuk melakukan efek samping setelah render komponen. Efek samping yang diinginkan di sini adalah mereset nilai pageNum ketika genre dihapus.
  useEffect(() => {
    if (!genre || genre.length === 0) {
      setPageNum(1);
    } // Pengecekan apakah genre tidak ada atau panjangnya 0 (tidak ada genre yang dipilih). Jika tidak ada genre (!genre) atau panjangnya 0 (genre.length === 0), maka nilai pageNum direset menjadi 1.
  }, [genre]);

  // Fungsi untuk menampilkan efek loading (skeleton) selama proses pengambilan data
  const skeleton = () => {
    return (
      <main className="w-40 h-60  animate-pulse flex flex-col items-center justify-center gap-2">
        <div className="w-full h-full bg-skeleton rounded " />
        <section className="w-full flex flex-col gap-2 ">
          <div className="w-full h-4 bg-skeleton rounded" />
          <div className="w-[80%] h-4 bg-skeleton rounded" />
        </section>
      </main>
    );
  };

  // Menampilkan pesan error jika terdapat kesalahan
  if (error) return <Error />;

  // Mengembalikan tampilan komponen utama
  return (
    <>
      <SEO title="Popular Movies - Finding Movies" />
      <div className="w-full h-full py-10">
        <ContentWrapper>
          <section className="w-full h-full flex items-center justify-end mb-10 px-10">
            {/* Komponen Select untuk pemilihan genre */}
            <Select
              isMulti
              name="genres"
              value={genre}
              onChange={onChange}
              closeMenuOnSelect={false}
              options={genresData?.genres}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholder="Select genres"
              classNamePrefix="react-select"
              className="w-full sm:w-[300px] text-black"
            />
          </section>
          
          {/* Komponen InfiniteScroll untuk memuat lebih banyak film saat di-scroll */}
          <InfiniteScroll
            dataLength={allMovies.length}
            next={fetchNextPage}
            hasMore={pageNum <= (movies?.total_pages || 0)}
            loader={<Loader />}
          >
            {!isFetching ? (
              // Menampilkan daftar film
              <div className="w-full h-full flex flex-wrap items-start justify-center gap-5">
                {allMovies.map((media, index) => (
                  <section key={`${media.id}-${index}`}>
                    <MovieCard Media={media} />
                  </section>
                ))}
              </div>
            ) : (
              // Menampilkan efek loading selama pengambilan data
              <div className="w-full h-full flex flex-wrap justify-center overflow-x-hidden px-5 gap-5">
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
                {skeleton()}
              </div>
            )}
          </InfiniteScroll>
        </ContentWrapper>
      </div>
    </>
  );
};

// Mengekspor komponen Popular sebagai default eksport
export default Popular;
