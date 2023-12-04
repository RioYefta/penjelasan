// Mengimpor hook useState, useEffect dari React
import { useState, useEffect } from "react";

// Mengimpor beberapa komponen dari berkas terpisah
import { Error, Loader, MovieCard, SEO } from "../../components";

// Mengimpor komponen ContentWrapper dari berkas terpisah
import ContentWrapper from "../../Hoc/SectionWrapper";

// Mengimpor dua fungsi query dari berkas terpisah yang disediakan oleh Redux Toolkit
import {
  useGetGenresDataQuery,
  useGetUpcomingMovieQuery,
} from "../../redux/TMDB";

// Mengimpor komponen InfiniteScroll dan Select dari berkas terpisah
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

// Definisi komponen utama bernama "Upcoming"
const Upcoming = () => {
  // Menggunakan hook useState untuk menyimpan nilai pageNum dan fungsi setPageNum
  const [pageNum, setPageNum] = useState(1);

  // Menggunakan hook useState untuk menyimpan nilai allMovies dan fungsi setAllMovies
  const [allMovies, setAllMovies] = useState([]);

  // Menggunakan hook useState untuk menyimpan nilai genre dan fungsi setGenre
  const [genre, setGenre] = useState(null);

  // Mendefinisikan konstanta media_type dengan nilai "movie"
  const media_type = "movie";

  // Menggunakan hook useGetUpcomingMovieQuery untuk mendapatkan data film yang akan datang
  const { data: movies, isFetching, error } = useGetUpcomingMovieQuery(pageNum);

  // Menggunakan hook useGetGenresDataQuery untuk mendapatkan data genre
  const { data: genresData } = useGetGenresDataQuery(media_type);

  // Menggunakan useEffect untuk menjalankan logika setelah data film yang akan datang diambil
  useEffect(() => {
    if (movies?.results) {
      // Menambahkan hasil film ke array allMovies
      setAllMovies((prevMovies) => [...prevMovies, ...movies.results]);
    }
  }, [movies]);

  // Fungsi untuk mengambil halaman berikutnya dari film yang akan datang
  const fetchNextPage = () => {
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  // Fungsi yang dijalankan ketika pemilihan genre berubah
  const onChange = (selectedOptions) => {
    setGenre(selectedOptions);
    const selectedGenreIds = selectedOptions.map((option) => option.id);
    if (selectedGenreIds.length === 0) {
      setAllMovies(movies?.results);
    } else {
      const filteredMovies = movies?.results.filter((movie) =>
        movie.genre_ids.some((genreId) => selectedGenreIds.includes(genreId))
      );
      setAllMovies(filteredMovies);
    }
  };

  // Menggunakan useEffect untuk mengatur pageNum kembali ke 1 ketika genre dibersihkan
  useEffect(() => {
    if (!genre || genre.length === 0) {
      setPageNum(1);
    }
  }, [genre]);

  // Fungsi untuk menentukan apakah tanggal rilis film berada dalam rentang tanggal yang valid
  const isWithinDateRange = (dateStr) => {
    const currentDate = new Date();
    const date = new Date(dateStr);
    return date >= currentDate;
  };

  // Memfilter film berdasarkan rentang tanggal yang valid
  const filteredMovies = allMovies.filter((movie) =>
    isWithinDateRange(movie.release_date)
  );

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
      <SEO title="Upcoming Movies - Finding Movies" />
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
            dataLength={filteredMovies.length}
            next={fetchNextPage}
            hasMore={pageNum <= (movies?.total_pages || 0)}
            loader={<Loader />}
          >
            {!isFetching ? (
              // Menampilkan daftar film yang akan datang
              <div className="w-full h-full flex flex-wrap items-start justify-center gap-5">
                {filteredMovies.map((media, index) => (
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

// Mengekspor komponen Upcoming sebagai default eksport
export default Upcoming;
