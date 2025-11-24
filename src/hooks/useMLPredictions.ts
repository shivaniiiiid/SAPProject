import { useMutation } from '@tanstack/react-query';
import {
  analyzeCropImageWithML,
  predictYield,
  predictWaterStress,
  detectPests,
  detectNutrientDeficiency
} from '@/lib/ml-predictions';

export function useCropImageAnalysisML() {
  return useMutation({
    mutationFn: (base64Image: string) => analyzeCropImageWithML(base64Image)
  });
}

export function useYieldPrediction() {
  return useMutation({
    mutationFn: (params: any) => predictYield(params)
  });
}

export function useWaterStressPrediction() {
  return useMutation({
    mutationFn: (params: any) => predictWaterStress(params)
  });
}

export function usePestDetection() {
  return useMutation({
    mutationFn: (params: any) => detectPests(params)
  });
}

export function useNutrientDeficiencyDetection() {
  return useMutation({
    mutationFn: (params: any) => detectNutrientDeficiency(params)
  });
}
