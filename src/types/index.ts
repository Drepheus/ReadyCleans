export type ServiceType = 'standard' | 'airbnb';

export type UnitSize = 'studio' | '1bed1bath' | '2bed1bath' | '2bed2bath' | '3bed2bath' | '3bed3bath' | '4bed2bath' | '4bed3bath' | '5bed2bath' | '5bed3bath';

export type AddOnType = 'oven' | 'fridge' | 'windows' | 'same-day';

export interface BookingState {
  city: string;
  zip: string;
  address: string;
  serviceType: ServiceType;
  unitSize: UnitSize;
  addOns: AddOnType[];
  date: Date | null;
  time: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
}

export const INITIAL_BOOKING_STATE: BookingState = {
  city: '',
  zip: '',
  address: '',
  serviceType: 'standard',
  unitSize: '1bed1bath',
  addOns: [],
  date: null,
  time: '',
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  }
};

export const PRICING = {
  'standard': {
    'studio': 77,
    '1bed1bath': 100,
    '2bed1bath': 122,
    '2bed2bath': 144,
    '3bed2bath': 167,
    '3bed3bath': 189,
    '4bed2bath': 212,
    '4bed3bath': 234,
    '5bed2bath': 256,
    '5bed3bath': 279
  },
  'airbnb': {
    'studio': 77,
    '1bed1bath': 100,
    '2bed1bath': 122,
    '2bed2bath': 144,
    '3bed2bath': 167,
    '3bed3bath': 189,
    '4bed2bath': 212,
    '4bed3bath': 234,
    '5bed2bath': 256,
    '5bed3bath': 279
  },
  'addons': {
    'oven': 17,
    'fridge': 17,
    'windows': 17,
    'same-day': 39
  }
};

