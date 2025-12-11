package com.esprit.tn.hkeyitna.service;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GraphClientFactory {

    @Value("${app.graph.tenant-id}")
    private String tenantId;

    @Value("${app.graph.client-id}")
    private String clientId;

    @Value("${app.graph.client-secret}")
    private String clientSecret;

    @Value("${app.graph.scope}")
    private String scope;

    public GraphServiceClient createClient() {
        // Si les credentials ne sont pas configurés, retourner null
        if (tenantId == null || tenantId.isEmpty() ||
                clientId == null || clientId.isEmpty() ||
                clientSecret == null || clientSecret.isEmpty()) {
            return null;
        }

        try {
            // Créer les credentials Azure AD
            ClientSecretCredential credential = new ClientSecretCredentialBuilder()
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .tenantId(tenantId)
                    .build();

            // Créer le client Graph
            String[] scopes = new String[] { scope };
            return new GraphServiceClient(credential, scopes);

        } catch (Exception e) {
            System.err.println("Error creating Graph client: " + e.getMessage());
            return null;
        }
    }
}
