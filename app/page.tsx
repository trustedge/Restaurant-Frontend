import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Restaurant Management</h1>
      <nav>
        <ul>
          <li><Link href="/menu">Menu</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li><Link href="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}
