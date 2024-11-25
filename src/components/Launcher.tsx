"use client";
import React from "react";
import { oauth2 as SMART } from "fhirclient";
import { useParams, useSearchParams } from 'next/navigation';
import config from "../config";
import { FhirClientContext } from "@/FhirClientContext";

class LauncherBase extends React.Component {
    static contextType = FhirClientContext;

    componentDidMount() {
        this.onChangeProvider({
            target: { 
                value: `cerner-provider-${this.props.app}`
            }
        }, this.context);
    }

    onChangeProvider(event, context) {
        const providerKey = event.target.value;
        const fhirconfig = config[event.target.value];

        const secret_client_id = "NEXT_PUBLIC_CLIENT_ID" + providerKey;

        // if ("NEXT_PUBLIC_CLIENT_ID" in process.env) {
        fhirconfig.client_id = process.env["NEXT_PUBLIC_CLIENT_ID"];
        // }

        const options = {
            clientId: fhirconfig.client_id,
            scope: fhirconfig.scope,
            redirectUri: fhirconfig.redirectUri,
            completeInTarget: fhirconfig.completeInTarget,
            pkceMode: fhirconfig.pkceMode
        };

        if (fhirconfig.client_id === 'OPEN') {
            options.fhirServiceUrl = fhirconfig.url;
            options.patientId = fhirconfig.patientId;
        } else {
            options.iss = fhirconfig.url;
        }

        SMART.authorize(options);
    }

    renderOptions() {
        return Object.keys(config).map((configKey) => (
            <option key={configKey}>{configKey}</option>
        ));
    }

    render() {
        return null;
    }
}

// Wrapper component to use Next.js navigation
const Launcher = () => {
    return <LauncherBase app="distillery" />;
};

export default Launcher;