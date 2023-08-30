import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager"

const client: SecretsManagerClient = new SecretsManagerClient({
    region: "eu-central-1",
})

export const getSecret = async (name: string): Promise<string> => {
    const keyRes = await client.send(
        new GetSecretValueCommand({
            SecretId: name,
            VersionStage: "AWSCURRENT",
        })
    )

    if (!keyRes.SecretString) {
        throw "Weather Key is empty."
    }

    return keyRes.SecretString
}
