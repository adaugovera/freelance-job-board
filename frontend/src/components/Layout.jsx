import Header from "./Header";
import ToastBridge from "./Toast";
import Footer from "./Footer";

// Layout wraps pages to provide consistent spacing and header/footer.
export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="site-container">{children}</main>
      <ToastBridge />
      <Footer />
    </div>
  );
}
