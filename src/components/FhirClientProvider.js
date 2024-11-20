'use client';

import React, { useState, useEffect } from "react";
import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

const FhirClientProvider = ({ children }) => {
    const [state, setState] = useState({
        client: null,
        error: null
    });

    const setClient = (client) => {
        setState(prevState => ({ ...prevState, client }));
    };

    if (state.error) {
        return <pre>{state.error.message}</pre>;
    }

    return (
        <FhirClientContext.Provider
            value={{
                client: state.client,
                setClient: setClient
            }}
        >
            <FhirClientContext.Consumer>
                {({ client }) => {
                    if (!client) {
                        SMART.ready()
                            .then(client => {
                                setState(prevState => ({ ...prevState, client }));
                            })
                            .catch(error => {
                                setState(prevState => ({ ...prevState, error }));
                            });
                        return null;
                    }
                    return children;
                }}
            </FhirClientContext.Consumer>
        </FhirClientContext.Provider>
    );
};

export default FhirClientProvider;