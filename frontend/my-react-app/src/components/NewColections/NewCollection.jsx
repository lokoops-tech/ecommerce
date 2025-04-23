import './NewCollection.css';
import Item from '../item/Item.jsx';
import { useEffect, useState } from 'react';
const API_BASE_URL = "http://localhost:4000";

const NewProducts = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate discount percentage
  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice || oldPrice <= 0) return 0;
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discount); // Round to nearest integer
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product/newcollection`);
        const data = await response.json();
        
        // Check if data has newcollection property (as shown in the error)
        if (data && Array.isArray(data.newcollection)) {
          const itemsWithDiscount = data.newcollection.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        } 
        // Also keep your existing checks as fallbacks
        else if (Array.isArray(data)) {
          const itemsWithDiscount = data.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        } 
        else if (data && Array.isArray(data.items)) {
          const itemsWithDiscount = data.items.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        } 
        else {
          console.error("Received data is not in expected format:", data);
          setError("Data format error");
          setNewCollection([]);
        }
      } catch (error) {
        console.error("Error fetching new collection:", error);
        setError("Failed to load products");
        setNewCollection([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
   <div className="new-collection">
  <h1 className="new-collection__title">New Collection|| Be First To Experience</h1>


  {isLoading ? (
    <div className="new-collection__loading">Loading...</div>
  ) : error ? (
    <div className="new-collection__error">{error}</div>
  ) : newCollection.length === 0 ? (
    <div className="new-collection__empty">No items found in the collection</div>
  ) : (
    <div className="new-collection__grid">
      {newCollection.map((item, i) => (
        <Item
          key={i}
          id={item.id}
          image={item.image}
          name={item.name}
          old_price={item.old_price}
          new_price={item.new_price}
          discount={item.discount}
          className="new-collection__item"
        />
      ))}
    </div>
  )}
</div>
  );
};

export default NewProducts;
