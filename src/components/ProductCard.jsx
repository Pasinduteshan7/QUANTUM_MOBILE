import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';
export default function ProductCard({ product, onAddToCart }) {
    const rating = product.avgRating ?? product.rating ?? 4.8;
    const reviews = product.reviewCount ?? 24;
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;
    const openChat = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-store-chat', {
                detail: {
                    name: product.name,
                    price: product.price,
                    image: product.image
                }
            }));
        }
    };
    const productUrl = `/phones/${product.id}`;
    return (<div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <span className="product-rating-badge">
        <Star size={12} fill="#d97706" color="#d97706"/>
        <span>{rating.toFixed(1)}</span>
      </span>

      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <img src={product.image} alt={product.name} style={{ maxHeight: '100%', objectFit: 'contain' }}/>
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="product-name">{product.name}</div>
        </Link>
        {product.specs && <div className="product-specs">{product.specs}</div>}

        <div className="product-price-row" style={{ marginTop: 'auto' }}>
          <span className="product-price">LKR {Number(product.price).toLocaleString()}</span>
          {product.originalPrice && (<span className="product-price-old">LKR {Number(product.originalPrice).toLocaleString()}</span>)}
          {discount && <span className="product-discount">{discount}% OFF</span>}
        </div>

        <div className="product-actions">
          <button className="btn-cart" onClick={() => {
            if (onAddToCart)
                onAddToCart(product);
            else {
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('quantum_cart');
                    const list = stored ? JSON.parse(stored) : [];
                    list.push({ ...product, quantity: 1, unitPrice: product.price });
                    localStorage.setItem('quantum_cart', JSON.stringify(list));
                    window.dispatchEvent(new Event('cart-updated'));
                }
            }
        }}>
            <ShoppingCart size={14}/>
            Add to Cart
          </button>
          <button className="btn-ask" onClick={openChat} title="Ask expert about compatibility & specs">
            <MessageSquare size={14}/>
            Ask
          </button>
        </div>
      </div>
    </div>);
}
