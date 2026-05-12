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
    'studio': 69,
    '1bed1bath': 89,
    '2bed1bath': 109,
    '2bed2bath': 129,
    '3bed2bath': 149,
    '3bed3bath': 169,
    '4bed2bath': 189,
    '4bed3bath': 209,
    '5bed2bath': 229,
    '5bed3bath': 249
  },
  'airbnb': {
    'studio': 69,
    '1bed1bath': 89,
    '2bed1bath': 109,
    '2bed2bath': 129,
    '3bed2bath': 149,
    '3bed3bath': 169,
    '4bed2bath': 189,
    '4bed3bath': 209,
    '5bed2bath': 229,
    '5bed3bath': 249
  },
  'addons': {
    'oven': 15,
    'fridge': 15,
    'windows': 15,
    'same-day': 35
  }
};

