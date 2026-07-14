import Keycloak from 'keycloak-js'

// Singleton — une seule instance partagée dans toute l'app
const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
})

export default keycloak
