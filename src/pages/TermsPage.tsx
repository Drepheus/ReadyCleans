import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#09090b] py-20 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy.
                            If you disagree with any part of the terms, then you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Cleaning Services</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Scope:</strong> We provide residential cleaning services as described in your booking.</li>
                            <li><strong>Access:</strong> You agree to provide access to the property at the scheduled time.</li>
                            <li><strong>Safety:</strong> We reserve the right to refuse service if the property is deemed unsafe or hazardous.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Payments & Deposits</h2>
                        <p>
                            A non-refundable deposit of $25 is required to secure your booking. This deposit is applied towards the total cost of the service.
                            The remaining balance is due upon completion of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Cancellation Policy</h2>
                        <p>
                            Cancellations made more than 24 hours before the scheduled appointment time are eligible for a deposit refund or rescheduling.
                            Cancellations made less than 24 hours in advance result in the forfeiture of the $25 deposit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Satisfaction Guarantee</h2>
                        <p>
                            We strive for 100% satisfaction. If you are not satisfied with any aspect of our service, please contact us within 24 hours of the cleaning,
                            and we will return to re-clean the specific areas at no additional cost.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Liability</h2>
                        <p>
                            While we take utmost care, we are not liable for damage due to normal wear and tear, improper installation of items, or existing damage.
                            Our liability is limited to the cost of the service provided.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
