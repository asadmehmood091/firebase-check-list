import "@/styles/globals.css";
import Head from "next/head";
import { AuthUserProvider } from "@/firebase/auth";
export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>JS Dev | WonderCrafts</title>
            </Head>
            <AuthUserProvider>
                <Component {...pageProps} />
            </AuthUserProvider>
        </>
    );
}
