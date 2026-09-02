import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';

function getPageHelp(pathname) {
  if (pathname.startsWith('/products')) return ['Search by product ID or use the category filter.', 'Use / or Ctrl/Cmd + K to jump to product search.', 'Use Copy product link to share an item.'];
  if (pathname.startsWith('/cart')) return ['Review item quantities before checkout.', 'Your cart is retained while you continue browsing.'];
  if (pathname.startsWith('/account/orders')) return ['Review order and payment status here.', 'Use Copy reference to save your order number.'];
  if (pathname.startsWith('/account')) return ['Use the account tabs to manage orders and your wishlist.'];
  if (pathname.startsWith('/admin')) return ['Use the administration tabs to manage products and orders.'];
  return ['Browse the latest arrivals or open the full shop.', 'Use / or Ctrl/Cmd + K to jump to product search.'];
}

export default function PageHelp() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const items = getPageHelp(pathname);

  useEffect(() => {
    const openHelp = () => setOpen(true);
    window.addEventListener('open-page-help', openHelp);
    return () => window.removeEventListener('open-page-help', openHelp);
  }, []);

  return <>
    <button className="page-help" type="button" aria-label="Open page help" onClick={() => setOpen(true)}>?</button>
    <Modal open={open} onClose={() => setOpen(false)} title="Circuit & Grain">
      <div className="page-help__content">
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="page-help__shortcut"><kbd>?</kbd> Open help &nbsp; <kbd>/</kbd> Search products</p>
      </div>
    </Modal>
  </>;
}
