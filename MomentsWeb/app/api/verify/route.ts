import { SelfBackendVerifier } from '@selfxyz/core';
import { prisma } from "@/lib/prisma"

const selfBackendVerifier = new SelfBackendVerifier(
    process.env.NEXT_PUBLIC_SELF_RPC_URL || "", // Celo RPC url, we recommend using Forno
    process.env.NEXT_PUBLIC_SELF_SCOPE || ""
);

export async function POST(req: Request) {
    console.log("Received verification request");
    
    try {
        const { proof, publicSignals } = await req.json();

        console.log("Proof received:", !!proof);
        console.log("Public Signals received:", !!publicSignals);

        // Verify the proof using Self
        const result = await selfBackendVerifier.verify(proof, publicSignals);  

        console.log("Verification result:", result);
        console.log("Is valid:", result.isValid);
        console.log("User ID from result:", result.userId);

        // if result.isValid is true, update the user's verification status in the database
        if (result.isValid) {
            try {
                // the property result.userId contains the user Id in the User Table
                const userId = result.userId;
                
                if (userId) {
                    // Update the user's verification status in the database
                    const updatedUser = await prisma.user.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            isVerified: true,
                        },
                    });
                    
                    console.log(`User ${userId} verified successfully:`, updatedUser);
                } else {
                    console.error("User ID not found in verification result. Cannot update verification status.");
                    
                    // Additional logging of the entire result for debugging
                    console.log("Full verification result:", JSON.stringify(result));
                    
                    return Response.json({
                        status: "error",
                        message: "User ID not found in verification result",
                        result: result.isValid
                    }, { status: 400 });
                }
            } catch (error) {
                console.error("Error updating user verification status:", error);
                
                return Response.json({
                    status: "error",
                    message: "Error updating user verification status",
                    result: result.isValid
                }, { status: 500 });
            }
        } else {
            console.warn("Verification failed. Result is not valid.");
        }

        // Return the verification status
        return Response.json({
            status: "success",
            result: result.isValid
        });
    } catch (error) {
        console.error("Error processing verification request:", error);
        
        return Response.json({
            status: "error",
            message: "Error processing verification request",
            result: false
        }, { status: 500 });
    }
}

