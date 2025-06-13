import { useState, useEffect } from 'react';
import './App.css';
import { Client } from './types/Client';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import * as api from './services/api';

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleSubmit = async (clientData: Omit<Client, 'id'>) => {
    try {
      if (editingClient) {
        await api.updateClient(editingClient.id, clientData);
        setEditingClient(null);
      } else {
        await api.createClient(clientData);
      }
      loadClients();
    } catch (error) {
      console.error('Error guardando cliente:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.deleteClient(id);
        loadClients();
      } catch (error) {
        console.error('Error eliminando cliente:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  return (
    <div className="app">
      <h1>Gestión de Clientes - Entrenador Fitness</h1>
      
      <ClientForm
        onSubmit={handleSubmit}
        clientToEdit={editingClient}
        onCancelEdit={handleCancelEdit}
      />
      
      <ClientList
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;