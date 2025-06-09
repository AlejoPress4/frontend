export class Usuario {
    _id?: string;
    nombre?: string;
    email?: string;
    password?: string;
    token?: string;
    fotoUrl?: string; // Para foto de perfil
    role?: string; // 'Admin', 'Operario', 'Gobernante'
    permissions?: string[]; // Permisos específicos del usuario
}


