// Mengimpor komponen Route dan Routes dari react-router-dom
import { Route, Routes } from "react-router-dom";

// Mengimpor beberapa komponen dari berkas terpisah
import { Footer, Navbar } from "./components";

// Mengimpor beberapa halaman (pages) dari berkas terpisah
import { Home, Search, MovieDetails, TvDetails } from "./pages";
import { Popular, Upcoming } from "./pages/Movie";
import { PopularTv } from "./pages/Tv";

// Mengimpor komponen ToastContainer dari react-toastify untuk menampilkan notifikasi
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mengimpor berkas CSS untuk gaya aplikasi
import "./App.css";

// Mengimpor halaman Favorite dari berkas terpisah
import Favorite from "./pages/Favorite";

// Definisi komponen utama "App"
const App = () => {
  return (
    <>
      {/* Wrapper untuk seluruh aplikasi dengan background hitam */}
      <section className="w-full mx-auto overflow-hidden bg-black">
        
        {/* Komponen Navbar sebagai navigasi aplikasi */}
        <Navbar />
        
        {/* Komponen Routes untuk menangani rute halaman */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/popular" element={<Popular />} />
          <Route path="/movie/upcoming" element={<Upcoming />} />
          <Route path="/tv/popular-tv" element={<PopularTv />} />
          <Route path="/movie/:movie_id" element={<MovieDetails />} />
          <Route path="/tv/:tv_id" element={<TvDetails />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
        
        {/* Komponen Footer untuk bagian bawah halaman */}
        <Footer />

        {/* Komponen ToastContainer untuk menampilkan notifikasi */}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </section>
    </>
  );
};

// Mengekspor komponen App sebagai default eksport
export default App;
