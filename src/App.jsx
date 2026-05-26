import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================
// SUPABASE CLIENT
// ======================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ======================
// MAIN APP (FULL GARAGE CRM)
// ======================
export default function App() {
  const [tab, setTab] = useState('cars');

  // DATA
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [repairs, setRepairs] = useState([]);

  const [loading, setLoading] = useState(true);

  // FORMS
  const [carForm, setCarForm] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    plate: '',
    mileage: '',
  });
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [repairForm, setRepairForm] = useState({
    car_id: '',
    customer_id: '',
    description: '',
    cost: '',
    status: 'open',
  });

  // ======================
  // FETCH DATA
  // ======================
  async function fetchAll() {
    setLoading(true);

    const [carsRes, custRes, repRes] = await Promise.all([
      supabase.from('cars').select('*').order('id', { ascending: false }),
      supabase.from('customers').select('*').order('id', { ascending: false }),
      supabase.from('repairs').select('*').order('id', { ascending: false }),
    ]);

    if (!carsRes.error) setCars(carsRes.data);
    if (!custRes.error) setCustomers(custRes.data);
    if (!repRes.error) setRepairs(repRes.data);

    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // ======================
  // ADD CAR
  // ======================
  async function addCar() {
    if (!carForm.vin) return;

    await supabase.from('cars').insert([
      {
        vin: carForm.vin,
        make: carForm.make,
        model: carForm.model,
        year: carForm.year ? parseInt(carForm.year) : null,
        plate: carForm.plate,
        mileage: carForm.mileage ? parseInt(carForm.mileage) : null,
      },
    ]);

    setCarForm({
      vin: '',
      make: '',
      model: '',
      year: '',
      plate: '',
      mileage: '',
    });
    fetchAll();
  }

  // ======================
  // ADD CUSTOMER
  // ======================
  async function addCustomer() {
    if (!customerForm.name) return;

    await supabase.from('customers').insert([customerForm]);

    setCustomerForm({ name: '', phone: '', email: '' });
    fetchAll();
  }

  // ======================
  // ADD REPAIR
  // ======================
  async function addRepair() {
    if (!repairForm.car_id) return;

    await supabase.from('repairs').insert([
      {
        ...repairForm,
        cost: repairForm.cost ? parseFloat(repairForm.cost) : 0,
      },
    ]);

    setRepairForm({
      car_id: '',
      customer_id: '',
      description: '',
      cost: '',
      status: 'open',
    });
    fetchAll();
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-4">
        <h1 className="text-3xl font-bold">🚗 Garage CRM Pro</h1>

        <div className="flex gap-2 mt-3">
          {['cars', 'customers', 'repairs'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${
                tab === t ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading && <p>Loading data...</p>}

        {/* ======================
            CARS TAB
        ====================== */}
        {tab === 'cars' && (
          <div>
            <div className="bg-white p-4 rounded mb-4">
              <h2 className="font-bold mb-2">Add Car</h2>

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="VIN"
                  className="border p-2"
                  value={carForm.vin}
                  onChange={(e) =>
                    setCarForm({ ...carForm, vin: e.target.value })
                  }
                />
                <input
                  placeholder="Plate"
                  className="border p-2"
                  value={carForm.plate}
                  onChange={(e) =>
                    setCarForm({ ...carForm, plate: e.target.value })
                  }
                />
                <input
                  placeholder="Make"
                  className="border p-2"
                  value={carForm.make}
                  onChange={(e) =>
                    setCarForm({ ...carForm, make: e.target.value })
                  }
                />
                <input
                  placeholder="Model"
                  className="border p-2"
                  value={carForm.model}
                  onChange={(e) =>
                    setCarForm({ ...carForm, model: e.target.value })
                  }
                />
                <input
                  placeholder="Year"
                  className="border p-2"
                  value={carForm.year}
                  onChange={(e) =>
                    setCarForm({ ...carForm, year: e.target.value })
                  }
                />
                <input
                  placeholder="Mileage"
                  className="border p-2"
                  value={carForm.mileage}
                  onChange={(e) =>
                    setCarForm({ ...carForm, mileage: e.target.value })
                  }
                />
              </div>

              <button
                onClick={addCar}
                className="mt-3 bg-black text-white px-4 py-2 rounded"
              >
                Add Car
              </button>
            </div>

            <div className="bg-white p-4 rounded">
              <h2 className="font-bold mb-2">Cars</h2>
              {cars.map((c) => (
                <div key={c.id} className="border p-2 mb-2 rounded">
                  <div className="font-semibold">
                    {c.make} {c.model} ({c.year})
                  </div>
                  <div className="text-sm text-gray-600">
                    VIN: {c.vin} | Plate: {c.plate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================
            CUSTOMERS TAB
        ====================== */}
        {tab === 'customers' && (
          <div>
            <div className="bg-white p-4 rounded mb-4">
              <h2 className="font-bold mb-2">Add Customer</h2>

              <input
                placeholder="Name"
                className="border p-2 w-full mb-2"
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, name: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                className="border p-2 w-full mb-2"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, phone: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
              />

              <button
                onClick={addCustomer}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Add Customer
              </button>
            </div>

            <div className="bg-white p-4 rounded">
              {customers.map((c) => (
                <div key={c.id} className="border p-2 mb-2 rounded">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">
                    {c.phone} | {c.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================
            REPAIRS TAB
        ====================== */}
        {tab === 'repairs' && (
          <div>
            <div className="bg-white p-4 rounded mb-4">
              <h2 className="font-bold mb-2">Add Repair</h2>

              <input
                placeholder="Car ID"
                className="border p-2 w-full mb-2"
                value={repairForm.car_id}
                onChange={(e) =>
                  setRepairForm({ ...repairForm, car_id: e.target.value })
                }
              />

              <input
                placeholder="Customer ID"
                className="border p-2 w-full mb-2"
                value={repairForm.customer_id}
                onChange={(e) =>
                  setRepairForm({ ...repairForm, customer_id: e.target.value })
                }
              />

              <input
                placeholder="Description"
                className="border p-2 w-full mb-2"
                value={repairForm.description}
                onChange={(e) =>
                  setRepairForm({ ...repairForm, description: e.target.value })
                }
              />

              <input
                placeholder="Cost"
                className="border p-2 w-full mb-2"
                value={repairForm.cost}
                onChange={(e) =>
                  setRepairForm({ ...repairForm, cost: e.target.value })
                }
              />

              <button
                onClick={addRepair}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Add Repair
              </button>
            </div>

            <div className="bg-white p-4 rounded">
              {repairs.map((r) => (
                <div key={r.id} className="border p-2 mb-2 rounded">
                  <div className="font-semibold">Repair #{r.id}</div>
                  <div className="text-sm text-gray-600">
                    Car: {r.car_id} | Customer: {r.customer_id}
                  </div>
                  <div className="text-sm">{r.description}</div>
                  <div className="text-sm font-bold">€ {r.cost}</div>
                  <div className="text-sm">Status: {r.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}