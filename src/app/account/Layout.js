import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { userService } from 'services';

export const Layout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (userService.userValue) {
      router.push('/');
    }
  }, [router]);

  return (
    <div>
      { children }
    </div>
  );
};