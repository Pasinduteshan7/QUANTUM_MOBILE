import { Link } from 'react-router-dom';
import { Smartphone, Clock, MapPin, Phone, Mail } from 'lucide-react';
export default function Footer() {
    return (<footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Smartphone size={22} color="#00d4ff"/>
              <span>QUANTUM MOBILE</span>
            </div>
            <p className="footer-desc">
              Sri Lanka&apos;s premier destination for genuine smartphones, verified accessories, 
              and professional phone repair. Walk-in appointments & islandwide mail-in courier service.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <span className="badge-pill" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', fontSize: 11, padding: '4px 8px', borderRadius: 6 }}>
                Verified Buyer Reviews
              </span>
              <span className="badge-pill" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontSize: 11, padding: '4px 8px', borderRadius: 6 }}>
                PayHere LKR
              </span>
              <span className="badge-pill" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11, padding: '4px 8px', borderRadius: 6 }}>
                6-Mo Warranty
              </span>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Shop & Catalog</div>
            <Link to="/phones" className="footer-link">Smartphones (iPhone, Galaxy, Pixel)</Link>
            <Link to="/accessories?category=Chargers" className="footer-link">GaN & MagSafe Chargers</Link>
            <Link to="/accessories?category=Cases" className="footer-link">Protective & Slim Cases</Link>
            <Link to="/accessories?category=Screen" className="footer-link">Tempered Glass Protectors</Link>
            <Link to="/accessories?category=Audio" className="footer-link">TWS & Earbuds</Link>
          </div>

          <div>
            <div className="footer-col-title">Repair Services</div>
            <Link to="/repairs/book" className="footer-link">Book Walk-In Appointment</Link>
            <Link to="/repairs/book" className="footer-link">Mail-In Courier Repair</Link>
            <Link to="/repairs/track" className="footer-link">Track Live Repair (REP-104)</Link>
            <Link to="/repairs/book" className="footer-link">Cracked Screen Replacement</Link>
            <Link to="/repairs/book" className="footer-link">Battery Health Replacement</Link>
          </div>

          <div>
            <div className="footer-col-title">Colombo Service Centre</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} color="#00d4ff"/>
                <span>45 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="#10b981"/>
                <span>Mon - Sat: 9:00 AM - 7:00 PM | Sun: 10:00 - 5:00</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={16} color="#f59e0b"/>
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} color="#a855f7"/>
                <span>support@quantummobile.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
          <div>&copy; {new Date().getFullYear()} Quantum Mobile. Prepared by Teshan G.H.P. Full-stack MERN with Socket.io.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Workspace</Link>
            <Link to="/super-admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Super Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>);
}
