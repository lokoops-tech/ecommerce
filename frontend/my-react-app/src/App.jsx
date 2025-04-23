import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton.jsx";
import FindUs from "./pages/Top.jsx";
import { ToastContainer } from "react-toastify";
import phone from "../src/Assets/ph.png"

// Lazy load components
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ShopCategory = lazy(() => import("./pages/ShopCategory.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const LoginSignup = lazy(() => import("./pages/loginSignup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const About = lazy(() => import("./components/About/About.jsx"));
const Company = lazy(() => import("./components/company/Company.jsx"));
const Offices = lazy(() => import("./components/Offices/Offices.jsx"));
const Contact = lazy(() => import("./components/contacts/Contacts.jsx"));
const Orders = lazy(() => import("./components/Orders/Orders.jsx"));
const Faq = lazy(() => import("./components/Faq/Faq.jsx"));
const PrivacyPolicy = lazy(() => import("./components/Privacy/Privacy.jsx"));
const ReturnPolicy = lazy(() => import("./components/Return-policy/ReturnPolicy.jsx"));
const ShippingInfo = lazy(() => import("./components/Shipping/Shipping.jsx"));
const PaymentOptions = lazy(() => import("./components/Payment-option/Payment.jsx"));
const StoreLocations = lazy(() => import("./components/Store-location/Store.jsx"));
const TermsAndConditions = lazy(() => import("./components/Terms/Terms.jsx"));
const PaymentGuide = lazy(() => import("./components/Paymentguide/PaymentGuide.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const ForgotPassword = lazy(() => import("./components/Forgetpassword/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("./components/ResetPassword/ResetPassword.jsx"));
const SearchResultsPage = lazy(() => import("./pages/SearchResults.jsx"));
const Checkout = lazy(() => import("./components/ChekOut/ChekOut.jsx"));
const BestProducts = lazy(() => import("./pages/BestProducts.jsx"));
const Warranty = lazy(() => import("./components/Waranty/Waranty.jsx"));
import All from "./pages/All.jsx";
import SEO from "./pages/Seo.jsx";

const App = () => {
  const categoryRoutes = {
    "phone-accessories": ["cases-covers", "screen-protectors", "chargers-cables", "power-banks", "phone-stands", "camera-accessories"],
    "watch": ["smartwatches", "analog-watches", "digital-watches", "luxury-watches", "watch-bands", "watch-repair-kits"],
    "fridge": ["single-door", "double-door", "side-by-side", "mini-fridges", "wine-coolers", "freezers"],
    "pc-computer-products": ["laptops", "desktops", "monitors", "keyboards-mice", "storage-devices", "networking-equipment"],
    "tv-appliances": ["smart-tvs", "led-lcd-tvs", "tv-mounts", "streaming-devices", "remote-controls", "tv-accessories"],
    "woofers": ["subwoofers", "soundbars", "home-theater-systems", "car-woofers", "wireless-speakers", "amplifiers"],
    "kitchen-appliances": ["mixers-blenders", "microwave-ovens", "dishwashers", "food-processors", "coffee-makers", "electric-kettles"],
    "groomings": ["shavers-trimmers", "hair-dryers", "straighteners", "facial-care-devices", "body-groomers", "manicure-sets"],
    "earpods": ["wireless-earbuds", "gaming-headsets", "noise-canceling", "sports-earphones", "true-wireless", "earphone-accessories"],
    "electricals": ["switches-sockets", "wiring-cables", "circuit-breakers", "led-lighting", "fans-ventilation", "voltage-stabilizers"]
  };

  return (
    <BrowserRouter>
    <SEO/>
    <ToastContainer/>
      <FindUs/>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Shop />} />

          {Object.keys(categoryRoutes).map(category => (
            <Route 
              key={category}
              path={`/${category}`}
              element={<ShopCategory category={category} />}
            
            />
          ))}

          {Object.entries(categoryRoutes).map(([category, subcategories]) =>
            subcategories.map(subcategory => (
              <Route
                key={`${category}-${subcategory}`}
                path={`/${category}/${subcategory}`}
                element={<ShopCategory category={category} subcategory={subcategory} />}
              />
            ))
          )}

          <Route path="/product/:productName" element={<Products />} />
          <Route path="/product/:productName/:productId" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/all-in-one" element={<All/>}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/company" element={<Company />} />
          <Route path="/offices" element={<Offices />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/store-locations" element={<StoreLocations />} />
          <Route path="/mpesa-guide" element={<PaymentGuide />} />
          <Route path="/terms-condition" element={<TermsAndConditions />} />
          <Route path="/:mainCategory/:subCategory/:brand" element={<BestProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <WhatsAppButton />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
