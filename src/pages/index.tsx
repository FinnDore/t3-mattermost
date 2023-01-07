import { type NextPage } from "next";
import Head from "next/head";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

    return (
        <>
            <Head>
           </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div>peppa</div>
                     </main>
        </>
    );
};

export default Home;
