/**
 * usePlantIdentification — mutation that sends a photo URI to the backend and
 * returns a structured plant identification. The scan screen drives the loading
 * + error states from this.
 */

import { useMutation } from '@tanstack/react-query';

import { aiService } from '../services/ai.service';
import { PlantIdentification } from '../types/ai.types';

export function usePlantIdentification() {
  return useMutation<PlantIdentification, Error, string>({
    mutationFn: (uri) => aiService.identifyPlant(uri),
  });
}
