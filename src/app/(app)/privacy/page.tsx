
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Privacy & Data Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>
                    Way to Nexus stores a minimal set of profile information to personalize career advice. We are committed to protecting your privacy and ensuring that your personal data is handled securely and transparently.
                </p>
                <h3 className="font-semibold text-lg text-foreground pt-4">What We Store</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Persona Information:</strong> To provide tailored recommendations, we store the details you enter when creating a persona. This includes your age, location (state and optionally city), education stage, interests, and career goals.</li>
                    <li><strong>Age vs. Date of Birth:</strong> We intentionally store your age, not your date of birth, to reduce the amount of personally identifiable information (PII) we hold.</li>
                    <li><strong>Location Data:</strong> Location information is used to provide accurate exam and college information relevant to your region. Providing a city is optional.</li>
                </ul>

                <h3 className="font-semibold text-lg text-foreground pt-4">How We Use Your Data</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personalization:</strong> Your persona data is used by our AI to generate career advice, news feeds, and mind maps that are relevant to your specific profile.</li>
                    <li><strong>Anonymized Research:</strong> If you consent, we may use an anonymized version of your persona data for research purposes to improve our services and understand career trends. We will never share your personal details.</li>
                </ul>

                <h3 className="font-semibold text-lg text-foreground pt-4">Data Sharing</h3>
                 <p>
                    We will never share your personal details with third parties without your explicit consent. Your trust is our top priority.
                </p>

                 <p className="pt-4">
                    For a more detailed explanation of our data practices, please review our full (placeholder) privacy policy. If you have any questions, feel free to <Link href="/contact" className="text-primary underline">contact us</Link>.
                </p>

            </CardContent>
        </Card>
    </div>
  );
}
