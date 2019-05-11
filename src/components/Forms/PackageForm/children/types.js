export type PackageType = {
  id: string,
  name: string,
  discount: number,
  duration: number,
  businessId: string,
  servicesIds: Array<string>
};

export type P = {
  data?: PackageType,
  mode: 'create' | 'update',
  onSubmit: Function,
  loading: boolean
};

export type S = {
}

