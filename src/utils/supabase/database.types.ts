export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {               // the data expected from .select()
          id: number;
          email: string;
          password: string;
          phone: string | null;
        }
        Insert: {            // the data to be passed to .insert()
          id?: never;        // generated columns must not be supplied
          email: string;     // `not null` columns with no default must be supplied
          password: string;  // `not null` columns with no default must be supplied
          phone?: string | null; // nullable columns can be omitted
        }
        Update: {            // the data to be passed to .update()
          id?: never;
          email?: string;    // `not null` columns are optional on .update()
          password?: string; // `not null` columns are optional on .update()
          phone?: string | null;
        }
      }
    }
  }
}
