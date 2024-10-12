export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      archivos: {
        Row: {
          archivo: string
          fecha: string
          id_archivo: number
          id_mensaje: number | null
          id_tipo_archivo: number | null
        }
        Insert: {
          archivo: string
          fecha: string
          id_archivo?: number
          id_mensaje?: number | null
          id_tipo_archivo?: number | null
        }
        Update: {
          archivo?: string
          fecha?: string
          id_archivo?: number
          id_mensaje?: number | null
          id_tipo_archivo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "archivos_id_mensaje_fkey"
            columns: ["id_mensaje"]
            isOneToOne: false
            referencedRelation: "mensajes"
            referencedColumns: ["id_mensaje"]
          },
          {
            foreignKeyName: "archivos_id_tipo_archivo_fkey"
            columns: ["id_tipo_archivo"]
            isOneToOne: false
            referencedRelation: "tipos_archivos"
            referencedColumns: ["id_tipo_archivo"]
          },
        ]
      }
      categorias: {
        Row: {
          id_categoria: number
          tipo_mascotas: string
        }
        Insert: {
          id_categoria?: number
          tipo_mascotas: string
        }
        Update: {
          id_categoria?: number
          tipo_mascotas?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          fecha: string
          id_chat: number
          id_publicacion: number | null
          id_usuario_adoptante: number | null
          id_usuario_publicacion: number | null
        }
        Insert: {
          fecha: string
          id_chat?: number
          id_publicacion?: number | null
          id_usuario_adoptante?: number | null
          id_usuario_publicacion?: number | null
        }
        Update: {
          fecha?: string
          id_chat?: number
          id_publicacion?: number | null
          id_usuario_adoptante?: number | null
          id_usuario_publicacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_id_publicacion_fkey"
            columns: ["id_publicacion"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id_publicacion"]
          },
          {
            foreignKeyName: "chats_id_usuario_adoptante_fkey"
            columns: ["id_usuario_adoptante"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "chats_id_usuario_publicacion_fkey"
            columns: ["id_usuario_publicacion"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      confirmaciones: {
        Row: {
          dictamen_id: number | null
          fecha: string
          id_confirmacion: number
          id_moderador: number | null
          id_publicacion: number | null
          mod_id: number | null
        }
        Insert: {
          dictamen_id?: number | null
          fecha: string
          id_confirmacion?: number
          id_moderador?: number | null
          id_publicacion?: number | null
          mod_id?: number | null
        }
        Update: {
          dictamen_id?: number | null
          fecha?: string
          id_confirmacion?: number
          id_moderador?: number | null
          id_publicacion?: number | null
          mod_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "confirmaciones_dictamen_id_fkey"
            columns: ["dictamen_id"]
            isOneToOne: false
            referencedRelation: "estados_confimaciones"
            referencedColumns: ["id_estado"]
          },
          {
            foreignKeyName: "confirmaciones_id_moderador_fkey"
            columns: ["id_moderador"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "confirmaciones_id_publicacion_fkey"
            columns: ["id_publicacion"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id_publicacion"]
          },
        ]
      }
      estados: {
        Row: {
          estado: string
          id_estado: number
        }
        Insert: {
          estado: string
          id_estado?: number
        }
        Update: {
          estado?: string
          id_estado?: number
        }
        Relationships: []
      }
      estados_confimaciones: {
        Row: {
          estado: string
          id_estado: number
        }
        Insert: {
          estado: string
          id_estado?: number
        }
        Update: {
          estado?: string
          id_estado?: number
        }
        Relationships: []
      }
      estados_mensajes: {
        Row: {
          estado: string
          id_estado: number
        }
        Insert: {
          estado: string
          id_estado?: number
        }
        Update: {
          estado?: string
          id_estado?: number
        }
        Relationships: []
      }
      estados_usuarios: {
        Row: {
          estado: string
          id_estado: number
        }
        Insert: {
          estado: string
          id_estado?: number
        }
        Update: {
          estado?: string
          id_estado?: number
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          fecha: string
          id_favorito: number
          id_publicacion: number | null
          id_usuario: number | null
        }
        Insert: {
          fecha: string
          id_favorito?: number
          id_publicacion?: number | null
          id_usuario?: number | null
        }
        Update: {
          fecha?: string
          id_favorito?: number
          id_publicacion?: number | null
          id_usuario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_id_publicacion_fkey"
            columns: ["id_publicacion"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id_publicacion"]
          },
          {
            foreignKeyName: "favoritos_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      fotos: {
        Row: {
          foto: string
          id_foto: number
          id_publicacion: number | null
        }
        Insert: {
          foto: string
          id_foto?: number
          id_publicacion?: number | null
        }
        Update: {
          foto?: string
          id_foto?: number
          id_publicacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fotos_id_publicacion_fkey"
            columns: ["id_publicacion"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id_publicacion"]
          },
        ]
      }
      mensajes: {
        Row: {
          contenido: string
          fecha: string
          id_chat: number | null
          id_estado: number | null
          id_mensaje: number
          id_usuario: number | null
        }
        Insert: {
          contenido: string
          fecha: string
          id_chat?: number | null
          id_estado?: number | null
          id_mensaje?: number
          id_usuario?: number | null
        }
        Update: {
          contenido?: string
          fecha?: string
          id_chat?: number | null
          id_estado?: number | null
          id_mensaje?: number
          id_usuario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_id_chat_fkey"
            columns: ["id_chat"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id_chat"]
          },
          {
            foreignKeyName: "mensajes_id_estado_fkey"
            columns: ["id_estado"]
            isOneToOne: false
            referencedRelation: "estados_mensajes"
            referencedColumns: ["id_estado"]
          },
          {
            foreignKeyName: "mensajes_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      notificaciones: {
        Row: {
          fecha: string
          foto: string | null
          id_notificacion: number
          id_usuario: number | null
          titulo: string
        }
        Insert: {
          fecha: string
          foto?: string | null
          id_notificacion?: number
          id_usuario?: number | null
          titulo: string
        }
        Update: {
          fecha?: string
          foto?: string | null
          id_notificacion?: number
          id_usuario?: number | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      publicaciones: {
        Row: {
          color: string | null
          condicion_medica: string | null
          edad: number | null
          fecha_creacion: string
          id_publicacion: number
          id_usuario: number | null
          nombre: string | null
          peso: number | null
          tipo_animal: number | null
          vacunas: boolean | null
        }
        Insert: {
          color?: string | null
          condicion_medica?: string | null
          edad?: number | null
          fecha_creacion: string
          id_publicacion?: number
          id_usuario?: number | null
          nombre?: string | null
          peso?: number | null
          tipo_animal?: number | null
          vacunas?: boolean | null
        }
        Update: {
          color?: string | null
          condicion_medica?: string | null
          edad?: number | null
          fecha_creacion?: string
          id_publicacion?: number
          id_usuario?: number | null
          nombre?: string | null
          peso?: number | null
          tipo_animal?: number | null
          vacunas?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "publicaciones_tipo_animal_fkey"
            columns: ["tipo_animal"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id_categoria"]
          },
        ]
      }
      reportes_soporte: {
        Row: {
          descripcion: string
          fecha: string
          id_reporte_soporte: number
          id_usuario: number | null
        }
        Insert: {
          descripcion: string
          fecha: string
          id_reporte_soporte?: number
          id_usuario?: number | null
        }
        Update: {
          descripcion?: string
          fecha?: string
          id_reporte_soporte?: number
          id_usuario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reportes_soporte_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      tipos_archivos: {
        Row: {
          id_tipo_archivo: number
          tipo: string
        }
        Insert: {
          id_tipo_archivo?: number
          tipo: string
        }
        Update: {
          id_tipo_archivo?: number
          tipo?: string
        }
        Relationships: []
      }
      tipos_de_usuarios: {
        Row: {
          id_tipo_usuario: number
          nombre: string
        }
        Insert: {
          id_tipo_usuario?: number
          nombre: string
        }
        Update: {
          id_tipo_usuario?: number
          nombre?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          apellido1: string | null
          apellido2: string | null
          contrasena: string
          correo: string
          fecha_creacion: string | null
          id_estado: number | null
          id_mascota_favorita: number | null
          id_tipo_usuario: number | null
          id_usuario: number
          nombre1: string | null
          nombre2: string | null
          telefono: string | null
        }
        Insert: {
          apellido1?: string | null
          apellido2?: string | null
          contrasena: string
          correo: string
          fecha_creacion?: string | null
          id_estado?: number | null
          id_mascota_favorita?: number | null
          id_tipo_usuario?: number | null
          id_usuario?: number
          nombre1?: string | null
          nombre2?: string | null
          telefono?: string | null
        }
        Update: {
          apellido1?: string | null
          apellido2?: string | null
          contrasena?: string
          correo?: string
          fecha_creacion?: string | null
          id_estado?: number | null
          id_mascota_favorita?: number | null
          id_tipo_usuario?: number | null
          id_usuario?: number
          nombre1?: string | null
          nombre2?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_estado_fkey"
            columns: ["id_estado"]
            isOneToOne: false
            referencedRelation: "estados_usuarios"
            referencedColumns: ["id_estado"]
          },
          {
            foreignKeyName: "usuarios_id_mascota_favorita_fkey"
            columns: ["id_mascota_favorita"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id_categoria"]
          },
          {
            foreignKeyName: "usuarios_id_tipo_usuario_fkey"
            columns: ["id_tipo_usuario"]
            isOneToOne: false
            referencedRelation: "tipos_de_usuarios"
            referencedColumns: ["id_tipo_usuario"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
