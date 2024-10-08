'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ReactSelect from 'react-select';
import { useState } from 'react';

export interface ComplaintManagement {
  complaintId: number;
  userId: number;
  customerName: string;
  complaintType: 'Delay' | 'Bad quality' | 'Wrong item' | 'Not reached';
  description: string;
  status: 'Active' | 'Inactive';
  resolution?: 'Coupon' | 'Store credits' | 'Add-on bag';
  deliveryDateSlot: string;
}

const complaintFormSchema = z.object({
  complaintId: z.number().nonnegative(),
  userId: z.number().nonnegative(),
  customerName: z.string(),
  deliveryDateSlot: z.string(),
  complaintType: z.string(),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Active', 'Inactive']),
  resolution: z.string().optional(),
});

export const ReceivedComplaintForm: React.FC<{ initialData?: ComplaintManagement }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<string[]>([]);

  const form = useForm<ComplaintManagement>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: initialData || {
      complaintId: 0,
      userId: 0,
      customerName: '',
      complaintType: 'Delay',
      description: '',
      status: 'Active',
      resolution: undefined,
      deliveryDateSlot: ''
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit: SubmitHandler<ComplaintManagement> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing complaint
      } else {
        // Create new complaint
      }
      // Refresh or redirect after submission
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const customerOptions = [
    {
      id: '1',
      orderId: '101',
      empId: '1022',
      name: 'Alice Johnson',
      phoneNumber: '123-456-7890',
      assignedEmployee: 'Deepak Singh',
      assignedRoutes: 'Route 1',
      subscriptionType: 'Biweekly Regular Veggie',
      totalWeightKg: 10000,
      totalPriceInr: 779,
      addOns: 'Lemons',
      specialInstructions: 'Leave the package at the front door.',
      deliveryDates: [
        { date: '11/JUN/2024' },
        { date: '17/MAR/2024'},
        { date: '21/JUL/2024' }
      ]
    },
    {
      id: '2',
      orderId: '102',
      empId: '1023',
      name: 'Bob Brown',
      phoneNumber: '098-765-4321',
      assignedEmployee: 'Jane Doe',
      assignedRoutes: 'Route 2',
      subscriptionType: 'Biweekly Mini Veggie',
      totalWeightKg: 5000,
      totalPriceInr: 459,
      addOns: 'Bananas',
      specialInstructions: 'Ring the bell upon arrival.',
      deliveryDates: [
        { date: '10/JUN/2024', details: 'First delivery in June' },
        { date: '15/MAR/2024', details: 'Delivery in March' },
        { date: '20/JUL/2024', details: 'Mid-year delivery' }
      ]
    },
    {
      id: '3',
      orderId: '103',
      empId: '1024',
      name: 'Deepak Singh',
      phoneNumber: '123-123-1234',
      assignedEmployee: 'John Smith',
      assignedRoutes: 'Route 3',
      subscriptionType: 'Mixed Greens Bag',
      totalWeightKg: 7000,
      totalPriceInr: 569,
      addOns: 'Cucumbers',
      specialInstructions: 'Call before delivery.',
      deliveryDates: [
        { date: '12/JUN/2024', details: 'First delivery in June' },
        { date: '18/MAR/2024', details: 'Delivery in March' },
        { date: '22/JUL/2024', details: 'Mid-year delivery' }
      ]
    }
  ];

  const complaintTypeOptions = [
    { value: 'Delay', label: 'Delay' },
    { value: 'Bad quality', label: 'Bad quality' },
    { value: 'Wrong item', label: 'Wrong item' },
    { value: 'Not reached', label: 'Not reached' },
  ];

  return (
    <div className="container mx-auto p-4">
      <Heading title={initialData ? 'Edit Complaint' : 'Create Complaint'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Controller
              control={control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isClearable
                      isSearchable
                      options={customerOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      isDisabled={loading}
                      onChange={(selected) => {
                        field.onChange(selected ? selected.name : '');
                        setSelectedCustomer(selected || null);
                        setDeliveryDates(selected ? selected.deliveryDates.map((d) => d.date) : []);
                        setSelectedDeliveryDate(null); // Reset delivery date when customer changes
                      }}
                      value={customerOptions.find(option => option.name === field.value)}
                      filterOption={(candidate, input) => {
                        const customer = customerOptions.find(cust => cust.id === candidate.value);
                        return candidate.label.toLowerCase().includes(input.toLowerCase()) ||
                          (customer?.phoneNumber.includes(input) ?? false);
                      }}
                    />
                  </FormControl>
                  <FormMessage>{errors.customerName?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Controller
              control={control}
              name="deliveryDateSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date Slot</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isClearable
                      isSearchable
                      options={deliveryDates.map((slot) => ({ value: slot, label: slot }))}
                      onChange={(selected) => {
                        field.onChange(selected?.value);
                        setSelectedDeliveryDate(selected ? selected.value : null);
                      }}
                      value={deliveryDates.find((slot) => slot === field.value) ? { value: field.value, label: field.value } : null}
                      isDisabled={loading}
                    />
                  </FormControl>
                  <FormMessage>{errors.deliveryDateSlot?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Controller
              control={control}
              name="complaintType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complaint Type</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isClearable
                      isSearchable
                      options={complaintTypeOptions}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isDisabled={loading}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      value={complaintTypeOptions.find(option => option.value === field.value)}
                    />
                  </FormControl>
                  <FormMessage>{errors.complaintType?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.status?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading} 
                      onChange={field.onChange} 
                      value={field.value} 
                      placeholder="Enter Resolution" 
                    />
                  </FormControl>
                  <FormMessage>{errors.resolution?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" disabled={loading} placeholder="Enter Description" {...field} />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {initialData ? 'Save Changes' : 'Create Complaint'}
          </Button>
        </form>
      </Form>

      {selectedCustomer && selectedDeliveryDate && (
        <div className="mt-8">
          <Heading title="Customer Details" description="Details of the selected customer" />
          <Separator />
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Field</th>
                <th className="py-2 px-4 border">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border">Order ID</td>
                <td className="py-2 px-4 border">{selectedCustomer.orderId}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Employee ID</td>
                <td className="py-2 px-4 border">{selectedCustomer.empId}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Phone Number</td>
                <td className="py-2 px-4 border">{selectedCustomer.phoneNumber}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Assigned Employee</td>
                <td className="py-2 px-4 border">{selectedCustomer.assignedEmployee}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Assigned Routes</td>
                <td className="py-2 px-4 border">{selectedCustomer.assignedRoutes}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Subscription Type</td>
                <td className="py-2 px-4 border">{selectedCustomer.subscriptionType}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Total Weight (Kg)</td>
                <td className="py-2 px-4 border">{selectedCustomer.totalWeightKg}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Total Price (₹)</td>
                <td className="py-2 px-4 border">{selectedCustomer.totalPriceInr}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Add-ons</td>
                <td className="py-2 px-4 border">{selectedCustomer.addOns}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Special Instructions</td>
                <td className="py-2 px-4 border">{selectedCustomer.specialInstructions}</td>
              </tr>
           
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
