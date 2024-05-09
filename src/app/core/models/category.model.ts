export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | undefined;
  parentId: number | undefined | null;
  children: Array<Category> | undefined | null;
}
