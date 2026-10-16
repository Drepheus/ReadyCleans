import { JsonLd } from './JsonLd';

const PRIMARY_CITY = 'Phoenix';
const REGION = 'AZ';
const PHONE = '+1-602-123-4567';
const WEBSITE = 'https://ReadyCleans.space';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CleaningService',
  '@id': `${WEBSITE}/#localbusiness`,
  name: 'ReadyCleans',
  description:
    'Remote cleaning service serving the Phoenix metro area. Specializing in move-in, move-out, deep clean, Airbnb turnover, and recurring residential cleaning with online booking.',
  url: WEBSITE,
  telephone: PHONE,
  email: 'hello@readycleans.space',
  image: `${WEBSITE}/og-image.png`,
  priceRange: '$$',
  foundingDate: '2024',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit card, Debit card',
  address: {
    '@type': 'PostalAddress',
    addressLocality: PRIMARY_CITY,
    addressRegion: REGION,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.4484,
    longitude: -112.074,
  },
  areaServed: [
    {
      '@type': 'City',
      name: PRIMARY_CITY,
      addressRegion: REGION,
    },
    {
      '@type': 'State',
      name: 'Arizona',
    },
    ...([
      'Phoenix',
      'Scottsdale',
      'Mesa',
      'Tempe',
      'Chandler',
      'Gilbert',
      'Glendale',
      'Peoria',
      'Surprise',
      'Goodyear',
      'Buckeye',
      'Avondale',
      'Tolleson',
      'Apache Junction',
      'Queen Creek',
      'Fountain Hills',
      'Paradise Valley',
      'Carefree',
      'Cave Creek',
      'Anthem',
      'Ahwatukee',
      'Laveen',
      'Central City Village',
      'Deer Valley',
    ] as const).map((area) => ({
      '@type': 'City',
      name: area,
      addressRegion: REGION,
    })),
  ],
  hasMap:
    'https://www.google.com/maps/search/?api=1&query=ReadyCleans+Phoenix+AZ',
  area: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 33.4484,
      longitude: -112.074,
    },
    geoRadius: '80 km',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${WEBSITE}/services/standard#service`,
        name: 'Standard Cleaning',
        description:
          'Recurring residential cleaning service for Phoenix metro homes.',
        serviceType: 'House Cleaning',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${WEBSITE}/services/deep-clean#service`,
        name: 'Deep Cleaning',
        description:
          'Thorough deep clean for homes, move-outs, and one-time refreshes.',
        serviceType: 'Deep Cleaning',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${WEBSITE}/services/airbnb#service`,
        name: 'Airbnb Turnover Cleaning',
        description:
          'Fast, reliable turnover cleaning for short-term rental hosts in Phoenix.',
        serviceType: 'Airbnb Turnover Cleaning',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${WEBSITE}/services/move-in-out#service`,
        name: 'Move-In / Move-Out Cleaning',
        description:
          'Move-in and move-out cleaning for renters and homeowners across the Phoenix metro.',
        serviceType: 'Move-In Cleaning',
      },
    },
  ],
  additionalType: [
    'https://www.wikidata.org/wiki/Q831734',
    `${WEBSITE}/#cleaningservice`,
  ],
};

export const ReadyCleansLocalBusinessSchema = () => (
  <JsonLd data={schema} />
);
