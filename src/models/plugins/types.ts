export interface Plugins {
  toJSON: (schema: any) => void;
  paginate: (filter: any, options: any) => Promise<any>;
}
