import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Inicializa el cliente de la base de datos
const sql = neon(process.env.DATABASE_URL!);

// Función para asegurar que la tabla 'registrations' exista con la nueva columna
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) UNIQUE, -- NUEVO CAMPO
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      room_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Añade la columna si no existe (para migraciones no destructivas)
  try {
    await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255) UNIQUE;`;
  } catch (error: unknown) {
    // Verificamos si el error es una instancia de Error antes de usarlo.
    if (error instanceof Error) {
        console.log("Info: No se pudo alterar la tabla (la columna puede que ya exista):", error.message);
    } else {
        console.log("Ocurrió un error desconocido al intentar alterar la tabla.");
    }
  }
}

// Handler para obtener todos los registros (GET) - sin cambios
export async function GET() {
  try {
    await ensureTableExists();
    const registrations = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ message: 'Error al obtener los registros' }, { status: 500 });
  }
}

// Handler para añadir un nuevo registro (POST) - actualizado
export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const { customerId, fullName, email, checkInDate, checkOutDate, roomType } = await request.json();

    if (!customerId || !fullName || !email || !checkInDate || !checkOutDate || !roomType) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    await sql`
      INSERT INTO registrations (customer_id, full_name, email, check_in_date, check_out_date, room_type) 
      VALUES (${customerId}, ${fullName}, ${email}, ${checkInDate}, ${checkOutDate}, ${roomType})
    `;
    
    return NextResponse.json({ message: 'Registro completado con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error adding registration:', error);
    return NextResponse.json({ message: 'Error al añadir el registro' }, { status: 500 });
  }
}

// Handler para actualizar un registro (PUT) - actualizado
export async function PUT(request: Request) {
  try {
    const { id, customerId, fullName, email, checkInDate, checkOutDate, roomType } = await request.json();

    if (!id || !customerId || !fullName || !email || !checkInDate || !checkOutDate || !roomType) {
      return NextResponse.json({ message: 'Todos los campos, incluyendo el ID, son requeridos' }, { status: 400 });
    }

    await sql`
      UPDATE registrations 
      SET customer_id = ${customerId}, full_name = ${fullName}, email = ${email}, check_in_date = ${checkInDate}, check_out_date = ${checkOutDate}, room_type = ${roomType}
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ message: 'Registro actualizado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ message: 'Error al actualizar el registro' }, { status: 500 });
  }
}

// Handler para eliminar un registro (DELETE) - sin cambios
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: 'El ID es requerido' }, { status: 400 });
    await sql`DELETE FROM registrations WHERE id = ${id}`;
    return NextResponse.json({ message: 'Registro eliminado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ message: 'Error al eliminar el registro' }, { status: 500 });
  }
}

