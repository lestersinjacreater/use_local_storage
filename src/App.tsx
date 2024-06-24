import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import useLocalStorage from './useLocalStorage';

interface TUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}

function App() {
  const [fetchedData, setFetchedData] = useLocalStorage<TUser[]>('users', []);
  const [reset, setReset] = useState<boolean>(false);

  const getUsers = async () => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((res) => setFetchedData(res.data))
      .catch((err) => console.log(err));
  }

  const getUser = async (id: number) => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => setFetchedData([res.data]))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (!fetchedData || fetchedData.length === 0) {
      getUsers();
    }
  }, [reset]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = parseInt((e.currentTarget.elements.namedItem('id') as HTMLInputElement).value, 10);
    if (id) {
      getUser(id);
      e.currentTarget.reset();
    } else {
      alert('Please enter a valid id of type number');
    }
  }

  const handleReset = () => {
    getUsers();
    setReset(!reset);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="text" name='id' placeholder="Enter user ID" />
        <button type='submit'>Search</button>
        <button type='button' onClick={handleReset}>Reset</button>
      </form>
      <div className='users'>
        {
          fetchedData && fetchedData.length > 0 ? (
            fetchedData.map((user: TUser) => {
              return (
                <div className='user' key={user.id}>
                  <p>Name: {user.name}</p>
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Address: {user.address.street}, {user.address.city}</p>
                  <p>{`Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}`}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Website: {user.website}</p>
                  <p>Company: {user.company.name}</p>
                </div>
              );
            })
          ) : (
            <div className='no-data'> 💀 No data</div>
          )
        }
      </div>
    </div>
  );
}

export default App;
