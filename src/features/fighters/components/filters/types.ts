export type FiltersState = {
  searchName: string;
  nationality: string;
  heightCategory: string;
  weightCategory: string;
  bodyType: string;
};

export const initialFilters: FiltersState = {
  searchName: '',
  nationality: '',
  heightCategory: '',
  weightCategory: '',
  bodyType: '',
};
