import { Outlet } from 'react-router-dom';
import NavbarRC from '../components/Navbar'; // tu navbar morado

export default function ProtectedLayout() {
  return (
    <>
      <NavbarRC />       {/* solo aparece en rutas protegidas */}
      <Outlet />         {/* aquí se renderizan las páginas protegidas */}
    </>
  );
}
