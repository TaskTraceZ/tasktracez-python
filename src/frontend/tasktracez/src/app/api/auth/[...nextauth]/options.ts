import { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

interface AdditionalProps {
    idToken?: string;
}

async function refreshIdAndAccessToken(token: string) {
};

export const options: NextAuthOptions = {
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID as string,
            clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
            issuer: process.env.COGNITO_ISSUER as string,
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            let additionalProps: AdditionalProps = {};
            
            if (account) {
                additionalProps.idToken = account.id_token;
            }

            return { ...token, ...additionalProps };
        },
        async session({ session, token }) {
            return { ...session, idToken: token.idToken };
        },
    }
};