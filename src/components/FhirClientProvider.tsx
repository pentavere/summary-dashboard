'use client';

import React, { useState, useEffect } from "react";
import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

const FhirClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<{
        client: any | null;
        error: Error | null;
        loading: boolean;
    }>({
        client: null,
        error: null,
        loading: true
    });

    useEffect(() => {
        const initializeFhirClient = async () => {
            try {
                // Initialize SMART configuration
                await SMART.init({
                    iss: process.env.NEXT_PUBLIC_FHIR_SERVER_URL,
                    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                    scope: 'launch/patient patient/*.read',
                    redirectUri: window.location.origin + '/distillery',
                });

                // Get the authorized client
                const client = await SMART.ready();
                setState(prevState => ({ 
                    ...prevState, 
                    client,
                    loading: false 
                }));
            } catch (error) {
                console.error('FHIR Client Error:', error);
                setState(prevState => ({ 
                    ...prevState, 
                    error: error instanceof Error ? error : new Error('Failed to initialize FHIR client'),
                    loading: false 
                }));
            }
        };

        initializeFhirClient();
    }, []);

    if (state.error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error: {state.error.message}</p>
            </div>
        );
    }

    if (state.loading) {
        return (
            <div className="p-4 text-center">
                <p>Loading FHIR client...</p>
            </div>
        );
    }

    return (
        <FhirClientContext.Provider
            value={{
                client: state.client,
                setClient: (client: any) => setState(prev => ({ ...prev, client }))
            }}
        >
            {children}
        </FhirClientContext.Provider>
    );
};

export default FhirClientProvider;