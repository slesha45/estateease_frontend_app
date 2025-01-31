import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmailApi } from "../../apis/Api";

const VerifyEmail = () => {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await verifyEmailApi({ token });
                if (res.data.success) {
                    // toast.success("Email verified successfully!");
                    navigate("/login");
                } else {
                    toast.error(
                        res.data.message || "Verification failed. Please try again."
                    );
                }
            } catch (err) {
                console.error("Error:", err); // Log the error details
                toast.error("Server Error");
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover"
            style={{ backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div
                className="bg-gray-100 p-8 rounded-lg shadow-md"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(5px)",
                }}
            >
                <h2 className="text-4xl font-bold text-center mb-6">
                    {isLoading ? "Verifying..." : "Email Verification"}
                </h2>
                {!isLoading && (
                    <p className="text-center text-gray-700">
                        {token
                            ? "Your email has been verified. You can now log in."
                            : "Verification failed or link is invalid."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;