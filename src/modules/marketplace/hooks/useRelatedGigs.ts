import { useQuery } from '@tanstack/react-query';
import { gigKeys, gigService } from '../services/gigService';
import type { Gig } from '../types/gig.types';

export function useRelatedGigs(gig: Gig | undefined) {
  return useQuery({
    queryKey: gigKeys.related(gig?.id ?? ''),
    queryFn: () => gigService.getRelatedGigs(gig!),
    enabled: Boolean(gig),
  });
}
