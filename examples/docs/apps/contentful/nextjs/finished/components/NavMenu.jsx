import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

const links = [
  { id: 'home', text: 'Home', href: '/' },
  { id: 'developers', text: 'For Developers', href: '/developers' },
  { id: 'marketers', text: 'For Marketers', href: '/marketers' },
  { id: 'registration', text: 'Registration', href: '/registration' },
  { id: 'campaign', text: 'Campaign', href: '/?utm_campaign=unfrmconf' }
]

const NavMenu = () => {
  const router = useRouter();

  const activeLink = useMemo(() => {
    if (router.pathname === '/') {
      const home = links.find(link => link.href === router.pathname);
      return home;
    }

    const active = links.find(link => link.href.startsWith(router.pathname));
    return active;
  }, [router.pathname]);

  return (
    <ul className="list-reset lg:flex justify-end flex-1 items-center space-x-2 lg:mr-4">
      {links.map(link => {
        return (
          <li key={link.id}>
            <Link href={link.href}>
              <a className={`inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4 ${activeLink?.href === link.href ? 'font-bold' : ''}`}>
                {link.text}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  );
}

export default NavMenu;