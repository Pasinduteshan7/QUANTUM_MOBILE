import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, onAddToCart }) {
    const { addToCart } = useCart();
    const rating = product.avgRating ?? product.rating ?? 4.8;
    const reviews = product.reviewCount ?? 24;
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;
    const imageSrc = product.image || product.mainImage || (product.finishes && product.finishes[0]?.image) || '/iphone16pro.jpg';
    const productId = product._id || product.id;
    const formattedSpecs = Array.isArray(product.specs)
        ? product.specs.map(s => s.desc || s.title).slice(0, 2).join(' • ')
        : product.specs;

    const openChat = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-store-chat', {
                detail: {
                    name: product.name,
                    price: product.price,
                    image: imageSrc
                }
            }));
        }
    };
    const productUrl = `/phones/${productId}`;
    return (<div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <span className="product-rating-badge">
        <Star size={12} fill="#d97706" color="#d97706"/>
        <span>{rating.toFixed(1)}</span>
      </span>

      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <img src={imageSrc} alt={product.name} style={{ maxHeight: '100%', objectFit: 'contain' }}/>
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="product-name">{product.name}</div>
        </Link>
        {formattedSpecs && <div className="product-specs">{formattedSpecs}</div>}

        <div className="product-price-row" style={{ marginTop: 'auto' }}>
          <span className="product-price">LKR {Number(product.price).toLocaleString()}</span>
          {product.originalPrice && (<span className="product-price-old">LKR {Number(product.originalPrice).toLocaleString()}</span>)}
          {discount && <span className="product-discount">{discount}% OFF</span>}
        </div>

        <div className="product-actions">
          <button className="btn-cart" onClick={() => {
            if (onAddToCart) {
                onAddToCart(product);
            } else {
                addToCart({
                    id: productId,
                    productId: productId,
                    name: product.name,
                    price: product.price,
                    unitPrice: product.price,
                    image: imageSrc,
                    specs: formattedSpecs || 'Standard'
                });
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
