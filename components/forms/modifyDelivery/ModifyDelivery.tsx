'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash, Edit, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea component
import { FormControl, FormField, FormLabel } from '@/components/ui/form';
import { useRouter } from 'next/navigation';

interface BagItem {
  itemName: string;
  itemPrice: number;
  unitQuantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  requiredUnits: number;
}

interface AddOn {
  itemName: string;
  itemPrice: number;
  unitQuantity: number;
  requiredUnits: number;
}

interface FormValues {
  bagItems: BagItem[];
  addOns: AddOn[];
  city: string;
  route: string;
  deliveryTimeSlot: string;
  description: string; // Add description field to form values
  netPrice: number; // Add netPrice to form values
}

const order = {
  orderId: 101,
  empId: 1022,
  customerName: "Deepak Singh",
  deliveries: [
    {
      deliveryDate: '2023-07-17',
      deliveryTimeSlot: '10am - 12pm',
      deliveryStatus: 'Delivered',
      assignedEmployee: "Shivam Singh",
      assignedRoutes: "Route 1"
    },
    {
      deliveryDate: '2023-07-18',
      deliveryTimeSlot: '9am - 11am',
      deliveryStatus: 'Pending',
      assignedEmployee: "Shivam Singh",
      assignedRoutes: "Route 1"
    },
  ],
  bagOrdered: [
    {
      "itemName": "Potato",
      "itemPrice": 30,
      "unitQuantity": 1000,
      "minimumQuantity": 1,
      "maximumQuantity": 30,
      "requiredUnits": 1
    },
    {
      "itemName": "Onions",
      "itemPrice": 25,
      "unitQuantity": 500,
      "minimumQuantity": 1,
      "maximumQuantity": 50,
      "requiredUnits": 1
    },
    {
      "itemName": "Tomatoes",
      "itemPrice": 50,
      "unitQuantity": 1000,
      "minimumQuantity": 3,
      "maximumQuantity": 10,
      "requiredUnits": 3
    },
    {
      "itemName": "Garlic",
      "itemPrice": 300,
      "unitQuantity": 1000,
      "minimumQuantity": 1,
      "maximumQuantity": 4,
      "requiredUnits": 1
    },
    {
      "itemName": "Ginger",
      "itemPrice": 200,
      "unitQuantity": 200,
      "minimumQuantity": 1,
      "maximumQuantity": 3,
      "requiredUnits": 1
    },
    {
      "itemName": "Coriander",
      "itemPrice": 30,
      "unitQuantity": 100,
      "minimumQuantity": 1,
      "maximumQuantity": 3,
      "requiredUnits": 1
    },
    {
      "itemName": "Mint",
      "itemPrice": 300,
      "unitQuantity": 200,
      "minimumQuantity": 1,
      "maximumQuantity": 3,
      "requiredUnits": 1
    },
    {
      "itemName": "Lemons",
      "itemPrice": 30,
      "unitQuantity": 100,
      "minimumQuantity": 1,
      "maximumQuantity": 3,
      "requiredUnits": 1
    },
    {
      "itemName": "Chillies",
      "itemPrice": 300,
      "unitQuantity": 1000,
      "minimumQuantity": 2,
      "maximumQuantity": 30,
      "requiredUnits": 2
    },
    {
      "itemName": "Amla",
      "itemPrice": 300,
      "unitQuantity": 100,
      "minimumQuantity": 2,
      "maximumQuantity": 5,
      "requiredUnits": 2
    }
  ]
  ,
  totalWeight: 5000, // Maximum weight in grams
  totalPrice: 779,
  paymentStatus: 'Paid',
  subscriptionType: 'Regular Veggie Bag',
  specialInstructions: 'Leave the package at the front door.'
};

const previousDelivery = {
  deliveryDate: '2023-07-17',
  items: [
    { itemName: 'Carrot', unitQuantity: 500, requiredUnits: 1 },
    { itemName: 'Cucumber', unitQuantity: 300, requiredUnits: 2 },
    { itemName: 'Ladyfinger', unitQuantity: 1000, requiredUnits: 1 },
  ],
  addons: [
    { itemName: 'Arva', unitQuantity: 500, requiredUnits: 1 },
    { itemName: 'Cucumber', unitQuantity: 300, requiredUnits: 2 },
    { itemName: 'Ladyfinger', unitQuantity: 1000, requiredUnits: 1 },
  ]
};

const dummyItems = [
  { value: 'Carrot', label: 'Carrot', price: 200, unitQuantity: 500, minimumQuantity: 1, maximumQuantity: 5 },
  { value: 'Cucumber', label: 'Cucumber', price: 100, unitQuantity: 300, minimumQuantity: 2, maximumQuantity: 5 },
  { value: 'Ladyfinger', label: 'Ladyfinger', price: 300, unitQuantity: 1000, minimumQuantity: 1, maximumQuantity: 3 },
];

const cityRoutes = [
  { city: 'City A', routes: ['Route 1', 'Route 2', 'Route 3'] },
  { city: 'City B', routes: ['Route 4', 'Route 5', 'Route 6'] },
  { city: 'City C', routes: ['Route 7', 'Route 8', 'Route 9'] },
];

const timeSlotsDefault = ['9:00 AM - 11:00 AM', '12:00 PM - 2:00 PM', '3:00 PM - 5:00 PM'];


export const ModifyDelivery: React.FC = () => {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState<{ value: string; label: string } | null>(null);
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [timeSlots, setTimeSlots] = useState(timeSlotsDefault);

  const methods = useForm<FormValues>({
    defaultValues: {
      bagItems: order.bagOrdered,
      addOns: [],
      city: '',
      route: '',
      deliveryTimeSlot: '',
      description: '', // Initialize description field
      netPrice: 0, // Initialize netPrice
    }
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bagItems'
  });
  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control,
    name: 'addOns'
  });

  const handleSaveChanges = (data: FormValues) => {
    // Save changes logic here
    console.log('Saved data:', data);
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const handleRemoveAddOn = (index: number) => {
    removeAddOn(index);
  };

  const totalAmount = watch('bagItems').reduce((total, item) => total + (item.itemPrice * item.requiredUnits), 0);
  const totalWeight = watch('bagItems').reduce((total, item) => total + (item.unitQuantity * item.requiredUnits), 0);

  const totalAddOnAmount = watch('addOns').reduce((total, item) => total + (item.itemPrice * item.requiredUnits), 0);
  const totalAddOnWeight = watch('addOns').reduce((total, item) => total + (item.unitQuantity * item.requiredUnits), 0);

  useEffect(() => {
    setValue('netPrice', totalAddOnAmount);
  }, [totalAddOnAmount, setValue]);

  const handleAddNewItem = () => {
    if (totalWeight < order.totalWeight) {
      append({ itemName: '', itemPrice: 0, unitQuantity: 0, minimumQuantity: 1, maximumQuantity: 5, requiredUnits: 1 });
    } else {
      alert('Cannot add more items. Total weight exceeds the maximum allowed weight.');
    }
  };

  const handleAddNewAddOn = () => {
    appendAddOn({ itemName: '', itemPrice: 0, unitQuantity: 0, requiredUnits: 1 });
  };

  const handleCityChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedCity(selectedOption);
    setValue('city', selectedOption?.value || '');
    setValue('route', ''); // Reset route selection when city changes
  };

  const addTimeSlot = () => {
    if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
      setTimeSlots([...timeSlots, newTimeSlot]);
      setNewTimeSlot('');
    }
  };

  const deleteTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  // const router =useRouter()

  const handleComplainView = () => {
  //  router.push("/viewComplains/23")
  router.push(`/complaint-management/23`);

  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-start justify-between">
        <Heading title="Order Details" description="View Order Details" />
      </div>
      <Separator />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-4 shadow-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Order ID:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">{order.orderId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Customer Name:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subscription Type:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">{order.subscriptionType}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Maximum Weight (g):</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">{order.totalWeight}</p>
          </div>
          <div  >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Complained In Last Delivery</p>
            <p className="text-lg flex items-center font-semibold text-red-600 animate-bounce	mt-2 dark:text-red-600 mt-1"><span>Delayed</span><Eye className='text-red-500 ms-2 ' /></p>
          </div>
          <div  >
            <Button onClick={handleComplainView} >View Complains</Button>
          </div>
         
        </div>
      </div>

      <Separator className="my-4" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-4 shadow-lg">
        <Heading title="Previous Delivery Details" description="Last Delivery Information" />
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items Ordered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Addons
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {previousDelivery.deliveryDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Item Name
        </th>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ordered Units
        </th>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Unit Quantity (g)
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {previousDelivery.items.map((item, idx) => (
        <tr key={idx}>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.itemName}
          </td>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.requiredUnits}
          </td>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.unitQuantity}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Item Name
        </th>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ordered Units
        </th>
        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Unit Quantity (g)
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {previousDelivery.addons.map((item, idx) => (
        <tr key={idx}>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.itemName}
          </td>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.requiredUnits}
          </td>
          <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
            {item.unitQuantity}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Separator className="my-4" />
      {/* Bag 1 */}
      <Heading title="Bag 1" description="" />
      {fields.length > 0 && (
        <form onSubmit={handleSubmit(handleSaveChanges)}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className='bg-green-300 text-white'>
              <tr className='bg-green-300'>
                <th className="px-6 py-3 text-left text-xs font-bold text-black   uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black   uppercase tracking-wider">
                  Item Price (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Unit Quantity (g)
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Minimum Units
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Maximum Units
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Required Units
                </th>
                <th className="px-6 py-3  text-right text-xs font-bold text-black   uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.itemName`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{watch(`bagItems.${index}.itemPrice`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.unitQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.minimumQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.maximumQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      control={control}
                      name={`bagItems.${index}.requiredUnits` as const}
                      render={({ field }) => (
                        <>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value >= watch(`bagItems.${index}.minimumQuantity`) && value <= watch(`bagItems.${index}.maximumQuantity`)) {
                                field.onChange(value);
                                setValue(`bagItems.${index}.requiredUnits`, value);
                              }
                            }}
                          />
                          {errors.bagItems?.[index]?.requiredUnits && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.bagItems?.[index]?.requiredUnits?.message}
                            </p>
                          )}
                        </>
                      )}
                      rules={{
                        required: 'Required Units is required',
                        validate: value => {
                          const min = watch(`bagItems.${index}.minimumQuantity`);
                          const max = watch(`bagItems.${index}.maximumQuantity`);
                          return value >= min && value <= max || `Required Units must be between ${min} and ${max}`;
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold text-gray-700">Total Price: ₹{totalAmount}</p>
          </div>
          <div className="flex justify-end mt-4">
            <p className={`text-lg font-semibold ${totalWeight > order.totalWeight ? 'text-red-600' : 'text-gray-700'}`}>
              Total Weight: {totalWeight} g
            </p>
          </div>
          {totalWeight > order.totalWeight && (
            <div className="flex justify-end mt-2">
              <p className="text-red-600">The total added item weight cannot be greater than 5000 g (Add More Items Through Add-ons)</p>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={totalWeight > order.totalWeight}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

<Separator className="my-4" />
      {/* Bag 2 */}
      <Heading title="Bag 2" description="" />
      {fields.length > 0 && (
        <form onSubmit={handleSubmit(handleSaveChanges)}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className='bg-green-300 text-white'>
              <tr className='bg-green-300'>
                <th className="px-6 py-3 text-left text-xs font-bold text-black   uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black   uppercase tracking-wider">
                  Item Price (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Unit Quantity (g)
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Minimum Units
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Maximum Units
                </th>
                <th className="px-6 py-3  text-left text-xs font-bold text-black  uppercase tracking-wider">
                  Required Units
                </th>
                <th className="px-6 py-3  text-right text-xs font-bold text-black   uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.itemName`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{watch(`bagItems.${index}.itemPrice`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.unitQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.minimumQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`bagItems.${index}.maximumQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      control={control}
                      name={`bagItems.${index}.requiredUnits` as const}
                      render={({ field }) => (
                        <>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value >= watch(`bagItems.${index}.minimumQuantity`) && value <= watch(`bagItems.${index}.maximumQuantity`)) {
                                field.onChange(value);
                                setValue(`bagItems.${index}.requiredUnits`, value);
                              }
                            }}
                          />
                          {errors.bagItems?.[index]?.requiredUnits && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.bagItems?.[index]?.requiredUnits?.message}
                            </p>
                          )}
                        </>
                      )}
                      rules={{
                        required: 'Required Units is required',
                        validate: value => {
                          const min = watch(`bagItems.${index}.minimumQuantity`);
                          const max = watch(`bagItems.${index}.maximumQuantity`);
                          return value >= min && value <= max || `Required Units must be between ${min} and ${max}`;
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold text-gray-700">Total Price: ₹{totalAmount}</p>
          </div>
          <div className="flex justify-end mt-4">
            <p className={`text-lg font-semibold ${totalWeight > order.totalWeight ? 'text-red-600' : 'text-gray-700'}`}>
              Total Weight: {totalWeight} g
            </p>
          </div>
          {totalWeight > order.totalWeight && (
            <div className="flex justify-end mt-2">
              <p className="text-red-600">The total added item weight cannot be greater than 5000 g (Add More Items Through Add-ons)</p>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={totalWeight > order.totalWeight}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
      <Separator className="my-4" />
      <Heading title="Add-ons" description="Add more items to the Bag" />
      <Button onClick={handleAddNewAddOn} className="mb-4 mt-2 bg-green-600">
        Add New Add-on
      </Button>
      {addOnFields.length > 0 && (
        <form onSubmit={handleSubmit(handleSaveChanges)}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Price (₹)
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Quantity (g)
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Units
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {addOnFields.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      control={control}
                      name={`addOns.${index}.itemName` as const}
                      render={({ field }) => (
                        <Select
                          isClearable
                          isSearchable
                          options={dummyItems.map(item => ({
                            value: item.value,
                            label: item.label,
                            price: item.price,
                            unitQuantity: item.unitQuantity,
                            minimumQuantity: item.minimumQuantity,
                            maximumQuantity: item.maximumQuantity
                          }))}
                          formatOptionLabel={({ label, price }) => (
                            <div className="flex justify-between">
                              <span>{label}</span>
                              <span>₹{price}</span>
                            </div>
                          )}
                          isDisabled={false}
                          onChange={(selected) => {
                            field.onChange(selected?.value);
                            const selectedItem = dummyItems.find(item => item.value === selected?.value);
                            if (selectedItem) {
                              setValue(`addOns.${index}.itemPrice`, selectedItem.price);
                              setValue(`addOns.${index}.unitQuantity`, selectedItem.unitQuantity);
                              setValue(`addOns.${index}.requiredUnits`, selectedItem.minimumQuantity); // Initialize requiredUnits with minimumQuantity
                            }
                          }}
                          value={dummyItems.find((option) => option.value === field.value)}
                        />
                      )}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{watch(`addOns.${index}.itemPrice`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {watch(`addOns.${index}.unitQuantity`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      control={control}
                      name={`addOns.${index}.requiredUnits` as const}
                      render={({ field }) => (
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            field.onChange(value);
                            setValue(`addOns.${index}.requiredUnits`, value);
                          }}
                        />
                      )}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveAddOn(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold text-gray-700">Total Add-on Price: ₹{totalAddOnAmount}</p>
          </div>
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold text-gray-700">Total Add-on Weight: {totalAddOnWeight} g</p>
          </div>
          <div className="flex justify-end mt-4">
         <div className="">
         <label className="block my-2 text-sm font-medium text-gray-700 dark:text-gray-300">Net Price</label>
            <Controller
              control={control}
              name="netPrice"
              render={({ field }) => (
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              )}
            />
         </div>
          </div>
        </form>
      )}
      <Separator className="my-4" />
      <Heading title="Assign Routes" description="Assign routes to this order" />
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <div>
              <label className="block my-2 text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
              <Select
                isClearable
                isSearchable
                options={cityRoutes.map(city => ({ value: city.city, label: city.city }))}
                onChange={(selected) => {
                  field.onChange(selected?.value);
                  handleCityChange(selected);
                }}
                value={selectedCity}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="route"
          render={({ field }) => (
            <div>
              <label className="block my-2 text-sm font-medium text-gray-700 dark:text-gray-300">Route</label>
              <Select
                isClearable
                isSearchable
                options={selectedCity ? cityRoutes.find(city => city.city === selectedCity.value)?.routes.map(route => ({ value: route, label: route })) : []}
                onChange={(selected) => field.onChange(selected?.value)}
                value={selectedCity ? { value: field.value, label: field.value } : null}
                isDisabled={!selectedCity}
              />
            </div>
          )}
        />
      </div>

      <Separator className="mt-4 " />
      <Heading title="Delivery Time Slot" description="Select or add delivery time slots" />
      <Controller
        control={control}
        name="deliveryTimeSlot"
        render={({ field }) => (
          <div className=" mb-16">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium my-2 text-gray-700 dark:text-gray-300">Delivery Time Slot</label>
              <Edit
                onClick={() => setIsTimeSlotModalOpen(true)}
                className="cursor-pointer text-red-500"
                height={15}
                width={15}
              />
            </div>
            <Select
              isClearable
              isSearchable
              options={timeSlots.map((slot) => ({ value: slot, label: slot }))}
              onChange={(selected) => field.onChange(selected?.value)}
              value={timeSlots.find((slot) => slot === field.value) ? { value: field.value, label: field.value } : null}
            />
          </div>
        )}
      />

      <div className="flex flex-col ">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              rows={5}
              placeholder="Enter any Notes"
              {...field}
            />
          )}
        />
        <Button className='my-3' type="submit" >
              Save Changes
            </Button>
      </div>

      <Dialog open={isTimeSlotModalOpen} onOpenChange={(open) => !open && setIsTimeSlotModalOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Delivery Time Slots</DialogTitle>
            <DialogDescription>Add or remove delivery time slots</DialogDescription>
          </DialogHeader>
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((slot, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slot}</td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash onClick={() => deleteTimeSlot(index)} className="cursor-pointer text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new time slot"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
              />
              <Button onClick={addTimeSlot} className="ml-2">
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
