import { SelfBackendVerifier } from '@selfxyz/core';

const selfBackendVerifier = new SelfBackendVerifier(
    process.env.NEXT_PUBLIC_SELF_RPC_URL || "", // Celo RPC url, we recommend using Forno
    process.env.NEXT_PUBLIC_SELF_SCOPE || ""
);

export async function POST(req: Request) {
    console.log("Received request");
    console.log(req);

    const { proof, publicSignals  } = await req.json();

    console.log("Proof: ", proof);
    console.log("Public Signals: ", publicSignals);


    const result = await selfBackendVerifier.verify(proof, publicSignals);  

    console.log("Result: ", result);

    const verificationResult = { status: "success" , result: result.isValid}; //await selfBackendVerifier.verify(userId, disclosures);
    return Response.json(verificationResult);
}

