import Desktop from '@/components/desktop/Desktop';
import { DesktopProvider } from '@/context/DesktopContext';

export default function Home() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}