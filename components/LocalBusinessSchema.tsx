import React from 'react';
import { Helmet } from 'react-helmet-async';

interface CityData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinate: { latitude: number; longitude: number };
  timezone: string;
  timezoneName: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  description: string;
  teamSize: string;
  expertise: string[];
  imageUrl?: string;
}

interface LocalBusinessSchemaProps {
  city: CityData;
  url: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ city, url }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': url,
        name: `TrivianEdge - ${city.name}`,
        description: city.description,
        image: city.imageUrl || 'https://www.trivianedge.com/og-image.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: city.address,
          postalCode: city.postalCode,
          addressCountry: city.countryCode,
          addressLocality: city.name,
          addressRegion: city.country,
        },
        telephone: city.phone,
        email: city.email,
        url: url,
        sameAs: [
          'https://www.linkedin.com/company/trivianedge',
          'https://twitter.com/trivianedge',
        ],
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.coordinate.latitude,
          longitude: city.coordinate.longitude,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '47',
        },
        priceRange: '$$$',
        areaServed: {
          '@type': 'Country',
          name: city.country,
        },
        knowsAbout: city.expertise,
        serviceArea: {
          '@type': 'Country',
          name: city.country,
        },
        organizationType: 'Staffing Agency',
      },
      {
        '@type': 'CivicStructure',
        '@id': `${url}#civic`,
        name: city.name,
        addressLocality: city.name,
        addressCountry: city.countryCode,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.coordinate.latitude,
          longitude: city.coordinate.longitude,
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      {/* Geo meta tags for local search */}
      <meta name="geo.position" content={`${city.coordinate.latitude};${city.coordinate.longitude}`} />
      <meta name="geo.placename" content={city.name} />
      <meta name="geo.region" content={`${city.countryCode}-${city.name.toUpperCase()}`} />
      <meta name="ICBM" content={`${city.coordinate.latitude}, ${city.coordinate.longitude}`} />
    </Helmet>
  );
};

export default LocalBusinessSchema;
