'use client';
import { createContext, useContext } from 'react';

export const FhirClientContext = createContext({
  client: null,
  setClient: () => {},
});

export const useFhirClient = () => useContext(FhirClientContext);