# 1. TypeScript y Separación de Componentes (Frontend)

## 🎯 Objetivos
- Entender qué es TypeScript y por qué es útil
- Convertir nuestra app React a TypeScript
- Separar el código en componentes reutilizables
- Aprender a definir tipos e interfaces
- Preparar la estructura para una app más grande

## 📚 ¿Qué es TypeScript?

TypeScript es JavaScript con **tipos**. Imagina que JavaScript es escribir en un documento sin revisar la ortografía, mientras que TypeScript es como tener un corrector automático que te avisa de errores antes de ejecutar el código.

### Ventajas de TypeScript:
1. **Previene errores**: Te avisa si intentas usar una variable incorrectamente
2. **Autocompletado mejorado**: El editor te sugiere qué propiedades y métodos puedes usar
3. **Documentación automática**: Los tipos sirven como documentación del código
4. **Refactoring seguro**: Cambiar nombres o estructuras es más seguro

### Ejemplo de la diferencia:

```javascript
// JavaScript - No hay error hasta ejecutar
const usuario = { nombre: "Juan", edad: 25 };
console.log(usuario.apellido); // undefined - Error en tiempo de ejecución
```

```typescript
// TypeScript - Error inmediato en el editor
interface Usuario {
  nombre: string;
  edad: number;
}

const usuario: Usuario = { nombre: "Juan", edad: 25 };
console.log(usuario.apellido); // ❌ Error: La propiedad 'apellido' no existe
```

## 🔧 Configurando TypeScript en nuestro proyecto

### Paso 1: Instalar dependencias

En la carpeta `frontend`, ejecuta:

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

### Paso 2: Renombrar archivos

Cambia las extensiones de los archivos:
- `App.jsx` → `App.tsx`
- `main.jsx` → `main.tsx`

### Paso 3: Crear tsconfig.json

Crea un archivo `tsconfig.json` en la carpeta frontend:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Paso 4: Actualizar vite.config.js

No necesitas cambiar nada - Vite detecta TypeScript automáticamente.

## 📦 Separando en Componentes

Vamos a dividir nuestro `App.tsx` en componentes más pequeños:

### 1. Definir tipos (src/types/Cliente.ts)

```typescript
// Definimos cómo debe lucir un Cliente
export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  objetivo: string; // Ej: "Perder peso", "Ganar músculo", "Mejorar condición"
}
```

### 2. Servicio API (src/services/api.ts)

```typescript
import { Cliente } from '../types/Cliente';

const API_URL = 'http://localhost:3001/api/clientes';

// Obtener todos los clientes
export const getClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener clientes');
  return response.json();
};

// Crear un cliente
export const createCliente = async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) throw new Error('Error al crear cliente');
  return response.json();
};

// Actualizar un cliente
export const updateCliente = async (id: number, cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) throw new Error('Error al actualizar cliente');
  return response.json();
};

// Eliminar un cliente
export const deleteCliente = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar cliente');
};
```

### 3. Componente ClienteForm (src/components/ClienteForm.tsx)

```typescript
import { useState, useEffect, FormEvent } from 'react';
import { Cliente } from '../types/Cliente';

// Props que recibe el componente
interface ClienteFormProps {
  onSubmit: (cliente: Omit<Cliente, 'id'>) => void;
  clienteToEdit?: Cliente | null;
  onCancelEdit?: () => void;
}

export const ClienteForm = ({ onSubmit, clienteToEdit, onCancelEdit }: ClienteFormProps) => {
  // Estados con tipos
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [objetivo, setObjetivo] = useState<string>('');

  // Efecto para actualizar el formulario cuando cambia clienteToEdit
  useEffect(() => {
    if (clienteToEdit) {
      setNombre(clienteToEdit.nombre);
      setEmail(clienteToEdit.email);
      setTelefono(clienteToEdit.telefono);
      setObjetivo(clienteToEdit.objetivo);
    } else {
      setNombre('');
      setEmail('');
      setTelefono('');
      setObjetivo('');
    }
  }, [clienteToEdit]);

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!nombre.trim() || !email.trim() || !telefono.trim() || !objetivo.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    onSubmit({ nombre, email, telefono, objetivo });
    
    // Limpiar formulario si no estamos editando
    if (!clienteToEdit) {
      setNombre('');
      setEmail('');
      setTelefono('');
      setObjetivo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Objetivo (ej: Perder peso, Ganar músculo)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
        />
      </div>
      <div className="form-buttons">
        <button type="submit">
          {clienteToEdit ? 'Actualizar' : 'Agregar'} Cliente
        </button>
        {clienteToEdit && onCancelEdit && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
```

### 4. Componente ClienteCard (src/components/ClienteCard.tsx)

```typescript
import { Cliente } from '../types/Cliente';

interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export const ClienteCard = ({ cliente, onEdit, onDelete }: ClienteCardProps) => {
  return (
    <div className="cliente">
      <div className="cliente-info">
        <h3>{cliente.nombre}</h3>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>Objetivo:</strong> {cliente.objetivo}</p>
      </div>
      <div className="cliente-actions">
        <button onClick={() => onEdit(cliente)}>Editar</button>
        <button onClick={() => onDelete(cliente.id)}>Eliminar</button>
      </div>
    </div>
  );
};
```

### 5. Componente ClienteList (src/components/ClienteList.tsx)

```typescript
import { Cliente } from '../types/Cliente';
import { ClienteCard } from './ClienteCard';

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export const ClienteList = ({ clientes, onEdit, onDelete }: ClienteListProps) => {
  return (
    <div className="clientes-list">
      <h2>Clientes</h2>
      {clientes.length === 0 ? (
        <p>No hay clientes registrados</p>
      ) : (
        clientes.map((cliente) => (
          <ClienteCard
            key={cliente.id}
            cliente={cliente}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};
```

### 6. App principal actualizada (src/App.tsx)

```typescript
import { useState, useEffect } from 'react';
import './App.css';
import { Cliente } from './types/Cliente';
import { ClienteForm } from './components/ClienteForm';
import { ClienteList } from './components/ClienteList';
import * as api from './services/api';

function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  // Cargar clientes al iniciar
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await api.getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleSubmit = async (clienteData: Omit<Cliente, 'id'>) => {
    try {
      if (editingCliente) {
        await api.updateCliente(editingCliente.id, clienteData);
        setEditingCliente(null);
      } else {
        await api.createCliente(clienteData);
      }
      loadClientes();
    } catch (error) {
      console.error('Error guardando cliente:', error);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.deleteCliente(id);
        loadClientes();
      } catch (error) {
        console.error('Error eliminando cliente:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCliente(null);
  };

  return (
    <div className="app">
      <h1>Gestión de Clientes - Entrenador Fitness</h1>
      
      <ClienteForm
        onSubmit={handleSubmit}
        clienteToEdit={editingCliente}
        onCancelEdit={handleCancelEdit}
      />
      
      <ClienteList
        clientes={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
```

## 🎨 Estructura final del proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ClienteForm.tsx
│   │   ├── ClienteList.tsx
│   │   └── ClienteCard.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── Cliente.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.js
```

## 🚀 Beneficios de esta estructura

1. **Componentes reutilizables**: Pueden adaptar `ClienteForm` para rutinas, dietas, pagos
2. **Tipos seguros**: TypeScript previene errores como `cliente.nombr` (mal escrito)
3. **Separación de responsabilidades**: 
   - `api.ts` maneja la comunicación con el servidor
   - Los componentes solo se encargan de la UI
   - Los tipos definen la estructura de datos
4. **Fácil de mantener**: Cada componente tiene una sola responsabilidad
5. **Trabajo en equipo**: Cada alumno puede trabajar en componentes diferentes

## 🔍 Tipos útiles de TypeScript para React

```typescript
// Para eventos
const handleClick = (e: MouseEvent<HTMLButtonElement>) => { }
const handleChange = (e: ChangeEvent<HTMLInputElement>) => { }

// Para children
interface Props {
  children: ReactNode;
}

// Para estados opcionales
const [data, setData] = useState<Item | null>(null);

// Para arrays
const [items, setItems] = useState<Item[]>([]);

// Para funciones como props
interface Props {
  onSubmit: (data: Item) => void;
  onCancel?: () => void; // ? significa opcional
}
```

## 💡 Consejos

1. **Empieza simple**: No intentes tipar todo de una vez
2. **Usa el autocompletado**: TypeScript te sugerirá las propiedades correctas
3. **Lee los errores**: Los mensajes de error de TypeScript son muy descriptivos
4. **any es tu enemigo**: Evita usar `any`, mejor usa tipos específicos
5. **Interfaces vs Types**: Para objetos usa `interface`, para uniones usa `type`