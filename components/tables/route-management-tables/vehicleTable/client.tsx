'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
// import { UserManagement, userManagementData } from '@/constants/user-management-data';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { EmployeeManagement, EmployeeManagementData } from '@/constants/employee-management-data';

export const EmployeeManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: EmployeeManagement[] = EmployeeManagementData;
  const [data, setData] = useState<EmployeeManagement[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.contactInformation.phone.toLowerCase().includes(searchValue.toLowerCase())
    );
    setData(filteredData);
  };

  const filters = [
    {
      label: 'Role',
      subOptions: ['Manager', 'Support Staff', 'Technician', 'Customer Service'],
    },
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Employee (${data.length})`}
          description="Manage Employee (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/employee`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKeys={['firstName', 'lastName', 'phone']}
        columns={columns}
        data={data}
        onSearch={handleSearch}
        filters={filters}
      />
    </>
  );
};
