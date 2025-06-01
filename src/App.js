import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MapComponent from './components/planes';

function App() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchPlanes = () => {
      axios
        .get('http://localhost:8000/planes')
        .then((res) => setPlanes(res.data))
        .catch((err) => console.error('Veri çekilemedi:', err));
    };

    fetchPlanes();
    const interval = setInterval(fetchPlanes, 1000); // her saniye veri çekiyor
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
        }}
      >
        <img
          src="/images/baykar-logo.svg"
          alt="Baykar"
          style={{
            height: '20px',
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 999,
          }}
        />
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 999,
            position: 'absolute',
            bottom: '32px',
            left: '10px',
            color: 'white',
            textShadow: '1px 1px 1px black',
          }}
        >
          Simge Öztürk <br /> simgeozturk@mail.com
        </span>
        <MapComponent planes={planes} />
      </div>
    </div>
  );
}

export default App;
