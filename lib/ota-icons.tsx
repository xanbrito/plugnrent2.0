/**
 * Ícones para OTAs (Online Travel Agencies)
 */

import { Calendar, Globe, Building2, MapPin } from 'lucide-react';

export interface OTAIcon {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const otaIcons: Record<string, OTAIcon> = {
  airbnb: {
    name: 'Airbnb',
    icon: Building2,
    color: '#FF5A5F',
  },
  booking: {
    name: 'Booking.com',
    icon: Globe,
    color: '#003580',
  },
  expedia: {
    name: 'Expedia',
    icon: Globe,
    color: '#FFB800',
  },
  vrbo: {
    name: 'VRBO',
    icon: Building2,
    color: '#00A699',
  },
  direct: {
    name: 'Direto',
    icon: Calendar,
    color: '#6B7280',
  },
  other: {
    name: 'Outro',
    icon: MapPin,
    color: '#9CA3AF',
  },
};

/**
 * Obter ícone para canal de reserva
 */
export function getOTAIcon(channel: string): OTAIcon {
  const normalizedChannel = channel.toLowerCase().trim();
  
  if (normalizedChannel.includes('airbnb')) {
    return otaIcons.airbnb;
  }
  if (normalizedChannel.includes('booking')) {
    return otaIcons.booking;
  }
  if (normalizedChannel.includes('expedia')) {
    return otaIcons.expedia;
  }
  if (normalizedChannel.includes('vrbo')) {
    return otaIcons.vrbo;
  }
  if (normalizedChannel.includes('direto') || normalizedChannel.includes('direct')) {
    return otaIcons.direct;
  }

  return otaIcons.other;
}

/**
 * Componente de ícone OTA
 */
export function OTAIconComponent({ channel, className = 'h-5 w-5' }: { channel: string; className?: string }) {
  const ota = getOTAIcon(channel);
  const Icon = ota.icon;

  return (
    <div className="flex items-center space-x-2">
      <Icon className={className} style={{ color: ota.color }} />
      <span className="text-sm font-medium" style={{ color: ota.color }}>
        {ota.name}
      </span>
    </div>
  );
}




