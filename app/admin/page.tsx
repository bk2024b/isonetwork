import { getProductsData } from '@/lib/blob';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Administration — ISO Network',
};

export default async function AdminPage() {
  const data = await getProductsData();

  return <AdminDashboard initialProducts={data.products} />;
}
