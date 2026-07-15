import { useQuery } from '@tanstack/react-query';
import { gigKeys, gigService } from '../services/gigService';

export function useGig(id: string | undefined) {
  return useQuery({
    queryKey: gigKeys.detail(id ?? ''),
    queryFn: () => gigService.getGigById(id ?? ''),
    enabled: Boolean(id),
  });
}
